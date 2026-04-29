"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Camera,
  CheckCircle,
  Clock,
  FolderOpen,
  MapPin,
  Phone,
  Upload,
  FileImage,
  Recycle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_LOCATION = {
  label: "Bank Sampah Induk Surabaya",
  address: "Jl. Raya Menur No.31-A, Manyar Sabrangan, Kec. Mulyorejo, Surabaya, Jawa Timur 60116",
  map_url:
    "https://maps.app.goo.gl/TSFJgNdL8yproxRH6",
  phone: "0851-0009-0858",
  hours: "Senin - Sabtu, 08:00 - 15:00",
};

// Generate EDP reference: EDP-DDMMYY-XXXX
function generateReferenceNumber() {
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  const d = new Date();
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yy = d.getFullYear().toString().slice(-2);
  const rand = pad(Math.floor(1000 + Math.random() * 9000), 4);
  return `EDP-${dd}${mm}${yy}-${rand}`;
}

export default function EcoDropPage() {
  const router = useRouter();
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // File (mock only UI)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Date & Time Pickup
  const [pickupDate, setPickupDate] = useState<string>(() => {
    // Default: today
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [pickupTime, setPickupTime] = useState<string>(() => {
    // Default: now + 5 mins
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${min}`;
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("trash_categories")
        .select("id, name, point_per_unit")
        .order("id");
      if (!error && data) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCategory =
    categories.find((cat) => String(cat.id) === String(selectedCategoryId)) ||
    null;
  const pointPerUnit = selectedCategory
    ? Number(selectedCategory.point_per_unit)
    : 0;
  const weightNum = Number(weight) > 0 ? Number(weight) : 0;

  // Kalkulasi GreenCoin
  const calculatedPoints =
    selectedCategory && weightNum > 0
      ? Math.round(weightNum * pointPerUnit)
      : 0;

  // LOGIKA SUBMIT - with pickup_datetime
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      selectedCategoryId,
      weight,
      notes,
      photoFile,
      pickupDate,
      pickupTime,
      selectedLocation,
    };
    console.log("Tombol diklik, mulai submit data...", formData);

    // required: kategori, weight, foto, tanggal, jam
    if (
      !selectedCategoryId ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !photoFile ||
      !pickupDate ||
      !pickupTime
    ) {
      alert("Mohon lengkapi seluruh field wajib, termasuk upload foto.");
      return;
    }
    setIsLoading(true);

    try {
      // User from supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error Supabase:", userError || "User tidak ditemukan.");
        alert('Gagal menyimpan: ' + (userError?.message || "User tidak ditemukan, silakan login ulang."));
        return;
      }

      // Nomor referensi EDP
      const reference_number = generateReferenceNumber();

      // Gabungkan tanggal & waktu pickup
      const pickup_datetime = `${pickupDate}T${pickupTime}`;

      // Insert ke transactions - PENTING di dalam try..catch
      let trx, trxError;
      try {
        const res = await supabase
          .from("transactions")
          .insert([
            {
              user_id: user.id,
              type: "ecodrop", // huruf kecil semua
              status: "pending",
              trash_category_id: selectedCategory.id,
              weight: weightNum,
              total_points: calculatedPoints,
              reference_number,
              location_address: selectedLocation.address,
              pickup_datetime,
              notes,
            },
          ])
          .select()
          .single();

        trx = res.data;
        trxError = res.error;
      } catch (error) {
        console.error("Error Supabase:", error);
        alert('Gagal menyimpan: ' + (error as any)?.message);
        setIsLoading(false);
        return;
      }

      if (trxError) {
        console.error("Error Supabase:", trxError);
        alert('Gagal menyimpan: ' + trxError.message);
        setIsLoading(false);
        return;
      }

      // Success summary state
      setSuccessData({
        ...trx,
        reference_number,
        category: selectedCategory.name,
        location: selectedLocation.label,
        address: selectedLocation.address,
        estimatedPoints: calculatedPoints,
        weight: weightNum,
        pickupDate,
        pickupTime,
        photoFile, // UI only
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error Supabase:", err);
      alert(
        'Gagal menyimpan: ' + (err?.message || "Terjadi kesalahan.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedCategoryId("");
    setWeight("");
    setNotes("");
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGoHome = () => {
    setIsSuccess(false);
    setSuccessData(null);
    router.push("/dashboard");
  };

  // Conditional: UI Sukses (Design Baru)
  if (isSuccess && successData) {
    const tgl = pickupDate
      ? new Date(`${pickupDate}T${pickupTime}`)
      : new Date();
    // Format tanggal ID
    const tanggalSetor = tgl.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // Format waktu
    const waktuKirim = tgl
      .toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(".", ":");

    return (
      <main className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
        {/* Header Success */}
        <div className="mb-6 flex flex-col items-center relative">
          <div className="bg-green-100 relative rounded-full p-6 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-600 font-bold" strokeWidth={2.5} />
            <span className="absolute bottom-1 right-1 bg-white border-2 border-green-100 rounded-full w-8 h-8 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-green-600" />
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mt-4 mb-2">
            EcoDrop Berhasil
          </h1>
          <div className="text-gray-500 text-base md:text-lg text-center max-w-md">
            Data setoran Anda telah kami terima dan sedang menunggu verifikasi dari petugas.
          </div>
        </div>
        {/* Card Ringkasan Setoran */}
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-4">
            {/* Header Card */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900 text-lg">Ringkasan setoran</span>
              <span className="bg-blue-50 text-blue-500 font-semibold rounded-full px-3 py-1 text-xs">
                Menunggu verifikasi
              </span>
            </div>
            {/* Data rows */}
            <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-400">Lokasi setor</span>
              <span className="font-semibold text-gray-900">{successData.location}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-400">Tanggal setor</span>
              <span className="font-medium text-gray-900">{tanggalSetor}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-400">Waktu kirim</span>
              <span className="font-medium text-gray-900">
                {waktuKirim}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-400">Kategori sampah</span>
              <span className="font-medium text-gray-900">{successData.category}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-400">Berat</span>
              <span className="font-medium text-gray-900">
                {successData.weight} kg
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b-0">
              <span className="text-gray-400">Foto bukti</span>
              <span className="flex items-center gap-1 text-green-700 font-semibold">
                <FileImage className="w-5 h-5 text-green-600" />
                <span>Terkirim</span>
              </span>
            </div>

            {/* Box Estimasi */}
            <div className="bg-green-50 bg-opacity-70 rounded-2xl p-4 mt-5 flex items-center justify-between">
              <span className="text-green-700 font-medium text-base">Estimasi GreenCoin</span>
              <span className="text-2xl text-green-800 font-bold">+{successData.estimatedPoints} GC</span>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 mt-6 pt-4 flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Nomor Referensi</div>
              <div className="font-mono text-gray-800 text-sm tracking-wide font-bold">
                {successData.reference_number}
              </div>
            </div>
          </div>
          {/* Card Langkah Selanjutnya */}
          <div className="bg-green-50/50 rounded-3xl p-6 mt-4">
            <div className="font-bold text-gray-800 text-lg mb-4">Langkah selanjutnya</div>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-semibold text-base select-none">1</span>
                <span className="text-gray-800 text-base">Petugas akan memverifikasi data dan berat setoran Anda.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-semibold text-base select-none">2</span>
                <span className="text-gray-800 text-base">GreenCoin akan masuk setelah proses verifikasi selesai.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-green-200 text-green-800 font-semibold text-base select-none">3</span>
                <span className="text-gray-800 text-base">Anda dapat memantau status setoran di halaman EcoDrop.</span>
              </li>
            </ol>
          </div>
        </div>
        {/* Tombol kembali */}
        <button
          onClick={handleGoHome}
          className="w-full max-w-xl bg-white border border-gray-300 text-gray-800 font-bold rounded-full py-4 mt-6 shadow-sm transition hover:border-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-100"
        >
          Kembali ke beranda
        </button>
      </main>
    );
  }

  // Main Form (Tetap seperti awal, hanya ada tambahan waktu & tanggal pick up)
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          EcoDrop Manual Deposit
        </h1>
        <p className="text-gray-700 text-base md:text-lg">
          Catat penyerahan sampah manual di pusat daur ulang.
        </p>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between gap-6">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            {DEFAULT_LOCATION.label}
          </h2>
          <div className="flex items-start gap-2 mb-1">
            <MapPin className="w-5 h-5 mt-1 text-green-700" />
            <span className="text-gray-800">
              {DEFAULT_LOCATION.address}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-green-700" />
            <span className="text-sm text-gray-700">
              {DEFAULT_LOCATION.hours}
              <span className="inline-flex items-center ml-3">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">Open Now</span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-700" />
            <span className="text-sm text-gray-700">{DEFAULT_LOCATION.phone}</span>
          </div>
        </div>
        {/* Map & Directions */}
        <div className="flex flex-col items-center md:items-end min-w-[220px]">
          <div className="w-[220px] h-[100px] bg-gray-200 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
            {/* Static map image placeholder */}
            <img
              src="/foto-bsis.jpeg"
              alt="Static Map Surabaya"
              className="object-cover w-full h-full"
            />
          </div>
          <a
            href={DEFAULT_LOCATION.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition text-sm"
          >
            Get Directions
          </a>
        </div>
      </div>
      {/* Main Content Grid */}
      <form
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        onSubmit={handleSubmit}
      >
        {/* Left Column: Drop-off Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col gap-6">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-black">
              Data Penyerahan Sampah
            </h3>
          </div>
          {/* Waste Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kategori Sampah
            </label>
            <select
              id="category"
              name="category"
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              value={selectedCategoryId}
              required
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih kategori sampah...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Berat (kg)
            </label>
            <div className="relative flex">
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.0"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                className="block w-full border border-gray-200 rounded-l-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                required
                value={weight}
                onChange={(e) => {
                  const val = e.target.value;
                  // Block negative values: ignore if minus sign is typed
                  if (val === "" || (Number(val) >= 0 && !val.includes("-"))) {
                    setWeight(val);
                  }
                }}
                disabled={isLoading}
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 text-gray-600 text-sm">
                kg
              </span>
            </div>
          </div>
          {/* Estimated Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi GreenCoin</label>
            <div className="px-3 py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 font-semibold text-lg flex items-center gap-2">
              +{calculatedPoints} <span className="text-sm">GC</span>
            </div>
          </div>
          {/* Date */}
          <div>
            <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Setor
            </label>
            <input
              id="pickup-date"
              name="pickup-date"
              type="date"
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {/* Time */}
          <div>
            <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700 mb-1">
              Waktu Kirim
            </label>
            <input
              id="pickup-time"
              name="pickup-time"
              type="time"
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              required
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Catatan <span className="text-gray-400">(Opsional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Tambah keterangan khusus sampah jika diperlukan..."
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        {/* Right Column: Upload Photo & Submit Actions */}
        <div className="flex flex-col h-full">
          <div
            className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col flex-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-black">
                Unggah Foto Drop-off
              </h3>
            </div>
            {/* Dropzone */}
            <label
              htmlFor="dropoff-photo"
              className="flex flex-col items-center justify-center flex-1 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl py-8 px-4 transition hover:bg-green-50 text-center mb-6"
            >
              {photoFile ? (
                <img
                  src={URL.createObjectURL(photoFile)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-green-400 mb-2" />
                  <span className="font-medium text-green-700 mb-1">
                    Klik untuk unggah foto
                  </span>
                  <span className="text-xs text-gray-500">
                    SVG, PNG, JPG atau GIF (maks. 3MB)
                  </span>
                </>
              )}
              <input
                ref={fileInputRef}
                id="dropoff-photo"
                name="dropoff-photo"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isLoading}
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    setPhotoFile(e.target.files[0]);
                  } else {
                    setPhotoFile(null);
                  }
                }}
              />
            </label>
            <div className="mt-auto flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm transition hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-100"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-green-300"
                disabled={isLoading}
              >
                <Upload className="w-5 h-5" />
                {isLoading ? "Menyimpan..." : "Submit Drop-off"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}