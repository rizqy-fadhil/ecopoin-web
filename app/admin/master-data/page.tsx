"use client";

import React, { useEffect, useState } from "react";
import {
  Recycle,
  Pencil,
  Trash2,
} from "lucide-react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

// Helper type
type TrashCategory = {
  id: number;
  name: string;
  unit: string;
  point_per_unit: number;
};

const supabase: SupabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function MasterDataKonversiPoinPage() {
  const [categories, setCategories] = useState<TrashCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Perubahan: point_per_unit = string agar "" bisa diterima saat input kosong
  const [formData, setFormData] = useState<{ name: string; point_per_unit: string }>({
    name: "",
    point_per_unit: "",
  });

  // Fetch categories initially and after CRUD
  async function fetchCategories() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("trash_categories")
      .select("id, name, unit, point_per_unit")
      .order("id", { ascending: true });
    if (!error && data) {
      setCategories(data as TrashCategory[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or update
  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); // pastikan halaman tidak reload
    try {
      // validasi: nama harus diisi, point_per_unit harus angka >= 0
      const name = formData.name.trim();
      // Jangan konversi string "" ke number secara langsung, biarkan jika kosong
      const pointStr = formData.point_per_unit.trim();
      if (!name) {
        alert("Nama kategori wajib diisi");
        return;
      }
      if (pointStr === "") {
        alert("Poin per Kg wajib diisi");
        return;
      }
      const pointNumber = Number(pointStr);
      if (isNaN(pointNumber)) {
        alert("Nilai Poin per Kg harus berupa angka");
        return;
      }
      if (pointNumber < 0) {
        alert("Poin tidak boleh kurang dari 0");
        return;
      }

      // Debugging
      const dataToSave = {
        name: name,
        point_per_unit: pointNumber,
        unit: "Kg", // pastikan selalu default 'Kg' jika INSERT
      };
      console.log("Data yang akan dikirim:", dataToSave);

      if (editId === null) {
        // INSERT
        try {
          const { error } = await supabase.from("trash_categories").insert([dataToSave]);
          if (error) {
            alert("Gagal menyimpan data: " + (error.message || "Unknown error"));
            return;
          }
          // Berhasil: refresh, tutup modal, reset form
          await fetchCategories();
          setIsModalOpen(false);
          setFormData({ name: "", point_per_unit: "" });
        } catch (err: any) {
          alert("Terjadi error saat insert: " + (err?.message || err));
        }
      } else {
        // UPDATE
        try {
          // Jangan update "unit" supaya tidak merusak (asumsi unit fix "Kg")
          const { error } = await supabase
            .from("trash_categories")
            .update({
              name: name,
              point_per_unit: pointNumber,
            })
            .eq("id", editId);
          if (error) {
            alert("Gagal update data: " + (error.message || "Unknown error"));
            return;
          }
          // Berhasil: refresh, tutup modal, reset form, reset editId
          await fetchCategories();
          setIsModalOpen(false);
          setFormData({ name: "", point_per_unit: "" });
          setEditId(null);
        } catch (err: any) {
          alert("Terjadi error saat update: " + (err?.message || err));
        }
      }
    } catch (outerErr: any) {
      alert("Error tak terduga: " + (outerErr?.message || outerErr));
    }
  }

  // Delete via API route (verifikasi admin + bypass RLS jika service role tersedia)
  async function handleDelete(id: number) {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      const response = await fetch(`/api/admin/trash-categories/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Gagal menghapus kategori.");
        return;
      }

      await fetchCategories();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Terjadi kesalahan saat menghapus: " + message);
    }
  }

  // Open modal for add
  function openAddModal() {
    setFormData({ name: "", point_per_unit: "" });
    setEditId(null);
    setIsModalOpen(true);
  }

  // Open modal for edit
  function openEditModal(category: TrashCategory) {
    setFormData({
      name: category.name,
      point_per_unit: category.point_per_unit.toString(),
    });
    setEditId(category.id);
    setIsModalOpen(true);
  }

  // Modal close
  function closeModal() {
    setIsModalOpen(false);
    setFormData({ name: "", point_per_unit: "" });
    setEditId(null);
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Master Data Konversi Poin</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
              {categories.length} Kategori
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Atur nilai tukar GreenCoin per kilogram untuk setiap jenis sampah.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-600/20 transition transform active:scale-[0.98]"
          onClick={openAddModal}
        >
          + Tambah Kategori
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="text-center text-gray-500 py-16 text-sm">Memuat data...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-sm">Belum ada kategori sampah.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between py-4 px-6 hover:bg-gray-50/50 transition"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-emerald-100 rounded-xl">
                    <Recycle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{cat.name}</div>
                    <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                      {cat.point_per_unit} GC / {cat.unit}
                    </div>
                  </div>
                </div>
                {/* Right: Actions */}
                <div className="flex gap-1 items-center">
                  <button
                    className="p-2 rounded-xl hover:bg-blue-50 transition"
                    title="Edit"
                    onClick={() => openEditModal(cat)}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    className="p-2 rounded-xl hover:bg-red-50 transition"
                    title="Hapus"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[95vw] max-w-md relative border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              {editId ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h2>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5 ml-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  placeholder="Nama kategori sampah"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5 ml-1">
                  Poin per Kg
                </label>
                <input
                  type="number"
                  value={formData.point_per_unit}
                  min={0}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      point_per_unit: e.target.value,
                    }))
                  }
                  required
                  placeholder="Masukkan nilai poin (cth: 10)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition transform active:scale-[0.98]"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}