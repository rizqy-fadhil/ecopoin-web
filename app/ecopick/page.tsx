"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Upload,
  FolderOpen,
  Calendar,
  MapPin,
  ChevronDown,
  BadgeCheck,
  Truck,
  Info,
  Clock,
  FileStack,
  Weight,
  MapPin as Pin,
  Navigation,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

// Import peta secara dinamis (ssr:false) agar tidak error 'window is not defined'
const DynamicMap = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => <p className="text-sm text-gray-500 py-4 text-center">Memuat peta...</p>,
});

// Waktu tersedia
const TIME_SLOTS = [
  { value: "08:00", label: "08:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "15:00", label: "03:00 PM" },
];

// Address dummy / default
const DEFAULT_ADDRESS = "Jl. Pemuda No. 12, Surabaya";

function generateReferenceNumber() {
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  const d = new Date();
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yy = d.getFullYear().toString().slice(-2);
  const rand = pad(Math.floor(1000 + Math.random() * 9000), 4);
  return `EPK-${dd}${mm}${yy}-${rand}`;
}

export default function PickupPage() {
  // --- State ---
  const router = useRouter();
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  // Trash categories state (from DB)
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [weight, setWeight] = useState<string>(""); // input is string for controlled input
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Location state ---
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLon, setLocationLon] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    // Fetch trash_categories from Supabase on mount
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
  }, []); // run once

  // Find selected category object
  const selectedCategory =
    categories.find((cat) => String(cat.id) === String(selectedCategoryId)) || null;

  // Weight parse/convert (decimal, safe fallback to 0)
  const weightNum = Number(weight) > 0 ? Number(weight) : 0;

  // Dynamic calculated points (auto updates)
  const calculatedPoints =
    selectedCategory && weightNum > 0
      ? Math.round(weightNum * Number(selectedCategory.point_per_unit))
      : 0;

  // --- Detect Location Handler ---
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolocation.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
              headers: { "User-Agent": "EcoPoin-App/1.0" },
            }
          );
          const data = await res.json();
          setLocationAddress(data.display_name || `${lat}, ${lon}`);
          setLocationLat(lat);
          setLocationLon(lon);
        } catch {
          setLocationAddress(`${lat}, ${lon}`);
          setLocationLat(lat);
          setLocationLon(lon);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        alert(
          "Gagal mendapatkan lokasi: " +
          (err.message || "Izin lokasi ditolak.")
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotoFile = (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran foto maksimal 10MB.");
      return;
    }
    setPhotoFile(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhotoFile(e.target.files?.[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handlePhotoFile(e.dataTransfer.files?.[0] ?? null);
  };

  // --- Handlers ---
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi simple
    if (
      !selectedCategory ||
      String(selectedCategoryId) === "" ||
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !pickupDate ||
      !pickupTime
    ) {
      alert("Mohon lengkapi semua field wajib!");
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");

      // Gabungkan tanggal & jam jadi pickup_datetime (format ISO - string)
      const pickup_datetime = new Date(
        `${pickupDate}T${pickupTime}`
      ).toISOString();

      // Generate reference number
      const reference_number = generateReferenceNumber();

      const formData = new FormData();
      formData.append("trash_category_id", String(selectedCategory.id));
      formData.append("weight", String(weightNum));
      formData.append("location_address", locationAddress || DEFAULT_ADDRESS);
      if (locationLat !== null) formData.append("latitude", String(locationLat));
      if (locationLon !== null) formData.append("longitude", String(locationLon));
      formData.append("pickup_datetime", pickup_datetime);
      formData.append("notes", notes);
      formData.append("total_points", String(calculatedPoints));
      formData.append("reference_number", reference_number);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await fetch("/api/ecopick", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menjadwalkan penjemputan.");
      }

      const trx = result.data;

      // For success summary UI
      setSuccessData({
        ...trx,
        category: selectedCategory.name,
        estimatedPoints: calculatedPoints,
        pickup_datetime,
        weight: weightNum,
        pickupTime:
          TIME_SLOTS.find((s) => s.value === pickupTime)?.label || pickupTime,
        pickupDate,
        location: locationAddress || DEFAULT_ADDRESS,
        reference_number,
      });
      setIsSuccess(true);
    } catch (err: any) {
      alert(
        "Gagal menjadwalkan penjemputan.\n\n" +
        (err?.message || "Terjadi kesalahan.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset and go home
  const handleGoHome = () => {
    setIsSuccess(false);
    setSuccessData(null);
    router.push("/dashboard");
  };

  // --- RENDER SUKSES ---
  if (isSuccess && successData) {
    // Tampilkan halaman sukses dengan styling sesuai instruksi
    return (
      <main className="bg-gray-50 min-h-screen p-3 sm:p-4 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 mt-6">
            <div className="relative">
              <span className="w-20 h-20 rounded-full flex items-center justify-center bg-green-100">
                <Truck className="w-11 h-11 text-green-600" />
              </span>
              <span className="absolute -bottom-1 -right-1 flex items-center justify-center bg-white rounded-full border border-green-300 shadow w-7 h-7">
                <BadgeCheck className="w-5 h-5 text-green-500" />
              </span>
            </div>
            <h2 className="font-extrabold text-2xl text-gray-900 mt-4">
              EcoPick Berhasil
            </h2>
            <p className="text-gray-500 text-center mt-2 max-w-xs">
              Permintaan penjemputan Anda telah kami terima. Petugas kami akan menuju lokasi Anda sesuai jadwal.
            </p>
          </div>

          {/* Card Ringkasan */}
          <div className="bg-white rounded-3xl shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="font-bold text-base text-gray-800">Ringkasan penjemputan</div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600 border border-blue-200">
                MENUNGGU PENJEMPUTAN
              </span>
            </div>
            <ul className="space-y-4 mb-5">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                <span>
                  <span className="block font-semibold text-gray-700">{successData.pickupDate && successData.pickupTime
                    ? TIME_SLOTS.find(s => s.value === pickupTime)?.label
                      ? `${successData.pickupTime}, ${new Date(successData.pickupDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`
                      : `${new Date(successData.pickup_datetime).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : ""}
                  </span>
                  <span className="block text-xs text-gray-500">Tanggal & Waktu Penjemputan</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Pin className="w-5 h-5 text-green-500 mt-0.5" />
                <span>
                  <span className="block font-semibold text-gray-700">{successData.location}</span>
                  <span className="block text-xs text-gray-500">Lokasi Penjemputan</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileStack className="w-5 h-5 text-green-500 mt-0.5" />
                <span>
                  <span className="block font-semibold text-gray-700">{successData.category}</span>
                  <span className="block text-xs text-gray-500">Kategori Sampah</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Weight className="w-5 h-5 text-green-500 mt-0.5" />
                <span>
                  <span className="block font-semibold text-gray-700">{Number(successData.weight).toFixed(2)} kg</span>
                  <span className="block text-xs text-gray-500">Estimasi Berat</span>
                </span>
              </li>
            </ul>
            {/* Box green coin */}
            <div className="bg-green-50 rounded-xl flex items-center justify-between p-4 mb-3 border border-green-100">
              <div className="font-semibold text-green-700">Estimasi GreenCoin</div>
              <div className="text-xl font-bold text-green-700">
                +{successData.estimatedPoints} GC
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-4 text-right">
              Nomor Referensi: <span className="font-mono">{successData.reference_number}</span>
            </div>
          </div>

          {/* Card Langkah Selanjutnya */}
          <div className="rounded-3xl bg-green-50/50 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800 text-lg">Langkah selanjutnya</span>
            </div>
            <ol className="space-y-3 pl-1">
              {[
                "Pisahkan sampah sesuai kategori untuk memudahkan petugas.",
                "Pastikan sampah sudah terbungkus rapi dan mudah diangkat.",
                "Tunggu petugas menghubungi Anda sebelum penjemputan.",
              ].map((txt, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 mt-1">{txt}</span>
                </li>
              ))}
            </ol>
          </div>

          <button
            type="button"
            className="w-full py-4 rounded-full border border-gray-200 text-gray-700 font-bold text-lg shadow-sm bg-white transition hover:bg-gray-50"
            onClick={handleGoHome}
          >
            Kembali ke beranda
          </button>
        </div>
      </main>
    );
  }

  // --- DEFAULT FORM RENDER ---
  return (
    <main className="p-3 sm:p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Schedule Pickup
        </h1>
        <p className="text-gray-700 max-w-xl">
          Ready to recycle? Fill in the details below to schedule a waste pickup from your location and earn EcoPoints.
        </p>
      </div>

      {/* Main Content */}
      <form
        className="grid grid-cols-1 lg:[grid-template-columns:2fr_1fr] gap-4 md:gap-8"
        onSubmit={handleSchedule}
        autoComplete="off"
      >
        {/* Left Column */}
        <div>
          {/* Card 1: Upload Waste Photos */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              Upload Waste Photos
              <span className="text-xs font-normal text-gray-400">(opsional)</span>
            </h2>
            <label
              htmlFor="waste-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-xl py-8 px-4 transition ${
                isDragOver
                  ? "border-green-500 bg-green-50"
                  : "border-green-300 hover:bg-green-50"
              }`}
            >
              {photoFile ? (
                <>
                  <img
                    src={photoPreview!}
                    alt="Preview sampah"
                    className="w-28 h-28 object-cover rounded-xl mb-2"
                  />
                  <span className="font-medium text-green-700 mb-1">
                    {photoFile.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    Klik untuk ganti foto
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-green-400 mb-2" />
                  <span className="font-medium text-green-700 mb-1">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (max. 10MB)
                  </span>
                </>
              )}
              <input
                ref={fileInputRef}
                id="waste-upload"
                name="waste-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isLoading}
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          {/* Card 2: Category, Weight, Notes */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-green-600" />
              Waste Category
            </h2>
            {/* Category Select (from Supabase) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Sampah <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="block w-full rounded-lg border border-gray-300 pr-10 pl-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 appearance-none"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                  disabled={categories.length === 0}
                >
                  <option value="" disabled>
                    {categories.length === 0
                      ? "Loading..."
                      : "Pilih kategori sampah..."}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* Estimated Weight */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berat (kg) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.0"
                  className="block w-full rounded-lg border border-gray-300 pr-12 pl-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600"
                  value={weight}
                  onChange={(e) => {
                    // Hanya terima angka dan desimal saja, hilangkan karakter lain
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    // Prevent enter multiple decimals
                    if ((val.match(/\./g) || []).length > 1) return;
                    setWeight(val);
                  }}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                  kg
                </span>
              </div>
            </div>
            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan
              </label>
              <textarea
                rows={3}
                placeholder="Tambahkan keterangan khusus sampah jika diperlukan..."
                className="block w-full rounded-lg border border-gray-300 p-3 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 resize-none"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="flex flex-col h-full">
          {/* Pickup Details Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-lg text-black mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Pickup Details
            </h2>
            {/* Date Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SELECT DATE <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  className="block w-full rounded-lg border border-gray-300 pr-4 pl-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Time Slots */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AVAILABLE TIME SLOTS <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot.value}
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition focus:outline-none ${pickupTime === slot.value
                      ? "border-2 border-green-600 bg-green-100 text-green-700"
                      : "border border-gray-300 bg-gray-50 text-gray-700 hover:border-green-500 hover:bg-green-50 focus:ring-2 focus:ring-green-200"
                      }`}
                    style={pickupTime === slot.value ? { borderWidth: 2 } : {}}
                    onClick={() => setPickupTime(slot.value)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Pickup Location */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PICKUP LOCATION
              </label>

              {/* Tombol Deteksi Lokasi */}
              <button
                type="button"
                id="detect-location-btn"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 font-semibold text-sm transition mb-3 ${isLocating
                  ? "border-green-300 bg-green-50 text-green-400 cursor-not-allowed"
                  : "border-green-600 bg-white text-green-700 hover:bg-green-50 active:scale-95"
                  }`}
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sedang mencari lokasi...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Deteksi Lokasi Saya
                  </>
                )}
              </button>

              {/* Input Alamat */}
              <div className="relative mb-3">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600 pointer-events-none" />
                <input
                  id="location-address-input"
                  type="text"
                  placeholder="Klik tombol di atas atau ketik alamat manual..."
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 pl-9 pr-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600"
                />
              </div>

              {/* Peta Interaktif — muncul setelah lokasi terdeteksi */}
              {locationLat !== null && locationLon !== null && (
                <DynamicMap lat={locationLat} lon={locationLon} />
              )}

              {locationLat === null && (
                <p className="text-xs text-gray-400 mt-1">
                  Peta akan muncul setelah lokasi terdeteksi.
                </p>
              )}
            </div>
          </div>
          {/* Points Estimate & Button */}
          <div className="mt-auto">
            <div className="bg-green-50 rounded-xl flex items-center justify-between p-4 mb-5 border border-green-100">
              <div className="font-medium text-gray-700">Estimated Points</div>
              <div className="text-2xl font-bold text-green-700">
                +{calculatedPoints} Pts
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-4 rounded-xl text-lg font-semibold text-white shadow transition ${isLoading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Jadwalkan Penjemputan"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}