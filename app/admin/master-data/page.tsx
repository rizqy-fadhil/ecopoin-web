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
            console.log("INSERT ERROR:", error);
            alert("Gagal menyimpan data: " + (error.message || "Unknown error"));
            return;
          }
          // Berhasil: refresh, tutup modal, reset form
          await fetchCategories();
          setIsModalOpen(false);
          setFormData({ name: "", point_per_unit: "" });
        } catch (err: any) {
          console.log("Exception INSERT", err);
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
            console.log("UPDATE ERROR:", error);
            alert("Gagal update data: " + (error.message || "Unknown error"));
            return;
          }
          // Berhasil: refresh, tutup modal, reset form, reset editId
          await fetchCategories();
          setIsModalOpen(false);
          setFormData({ name: "", point_per_unit: "" });
          setEditId(null);
        } catch (err: any) {
          console.log("Exception UPDATE", err);
          alert("Terjadi error saat update: " + (err?.message || err));
        }
      }
    } catch (outerErr: any) {
      console.log("Exception OUTER", outerErr);
      alert("Error tak terduga: " + (outerErr?.message || outerErr));
    }
  }

  // Delete
  async function handleDelete(id: number) {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      const { error } = await supabase.from("trash_categories").delete().eq("id", id);
      if (!error) {
        fetchCategories();
      }
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
    <div className="max-w-3xl mx-auto">
      {/* Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Master Data Konversi Poin
          </h1>
          <p className="text-gray-500 text-sm">
            Atur nilai tukar GreenCoin per kilogram untuk setiap jenis sampah.
          </p>
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 font-semibold shadow-sm transition"
          onClick={openAddModal}
        >
          + Tambah
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-5">
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Memuat data...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Belum ada kategori sampah.</div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border border-gray-100 rounded-xl shadow-sm py-4 px-5 bg-white"
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-4">
                <div className="bg-green-100 rounded-full p-2">
                  <Recycle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{cat.name}</div>
                  <div className="text-xs text-green-600 mt-0.5">{`${cat.point_per_unit} GC / ${cat.unit}`}</div>
                </div>
              </div>
              {/* Right: Actions */}
              <div className="flex gap-2 items-center">
                <button
                  className="p-2 rounded-full hover:bg-blue-50 transition"
                  title="Edit"
                  onClick={() => openEditModal(cat)}
                >
                  <Pencil className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-red-50 transition"
                  title="Hapus"
                  onClick={() => handleDelete(cat.id)}
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-7 w-[95vw] max-w-md relative">
            <h2 className="text-lg font-bold mb-5">
              {editId ? "Edit Kategori" : "Tambah Kategori"}
            </h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poin per Kg
                </label>
                <input
                  type="number"
                  value={formData.point_per_unit}
                  min={0}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      // jika diketik kosong pada input number, e.target.value === ""
                      point_per_unit: e.target.value,
                    }))
                  }
                  required
                  placeholder="Masukkan nilai poin (cth: 10)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-400 focus:outline-none text-gray-900"
                />
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
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