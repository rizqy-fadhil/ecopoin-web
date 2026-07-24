"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Scale3d, // Replacement for weight/timbangan
  BadgeCheck,
  BadgeX,
} from "lucide-react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import clsx from "clsx";

export default function AdminEcoDropPage() {
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch ecodrop transactions
  async function fetchTransactions() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          "*, profiles!transactions_user_id_fkey(full_name), trash_categories(name)"
        )
        .eq("type", "ecodrop")
        .order("created_at", { ascending: false });
      if (!error) {
        setTransactions(Array.isArray(data) ? data : []);
      } else {
        setTransactions([]);
        alert("Gagal memuat data: " + error.message);
      }
    } catch (e: any) {
      setTransactions([]);
      alert("Gagal memuat data: " + (e?.message || e));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Metrics/statistik
  const stats = useMemo(() => {
    let totalDrop = 0;
    let pending = 0;
    let completed = 0;
    let totalWeight = 0;
    for (const t of transactions) {
      if (t && t.id) {
        totalDrop++;
        if (t.status === "pending") pending++;
        if (t.status === "completed") completed++;
        totalWeight += Number(t.weight) || 0;
      }
    }
    return { totalDrop, pending, completed, totalWeight };
  }, [transactions]);

  // Search/filter
  const filtered = useMemo(() => {
    if (!search) return transactions;
    const term = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const ref = (t.reference_number || "").toLowerCase();
      const fullName = (t.profiles?.full_name || "").toLowerCase();
      return ref.includes(term) || fullName.includes(term);
    });
  }, [transactions, search]);

  // Action handler: accept/decline
  async function handleAction(
    transactionId: number,
    statusAction: "completed" | "cancelled",
    userId: number,
    totalPoints: number
  ) {
    if (!transactionId) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/approve-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          action: statusAction,
          transactionType: "ecodrop",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal update status");
      }

      if (statusAction === "completed") {
        alert("Transaksi disetujui dan poin ditambahkan!");
      } else {
        alert("Transaksi berhasil ditolak.");
      }
      fetchTransactions();
    } catch (err: any) {
      alert("Gagal update status: " + (err?.message || err));
    } finally {
      setIsLoading(false);
    }
  }

  // Status tag styles
  const statusColors: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: <Clock className="w-4 h-4 text-yellow-500 mr-1" />,
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle className="w-4 h-4 text-green-600 mr-1" />,
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <BadgeX className="w-4 h-4 text-red-500 mr-1" />,
    },
  };

  function formatDate(d: string) {
    try {
      return new Date(d).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  }
  function formatTime(d: string) {
    try {
      return new Date(d).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).replace(".", ":");
    } catch {
      return "-";
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">EcoDrop Management</h1>
        <p className="text-gray-500 mt-1">
          Pantau dan verifikasi setoran sampah manual dari pengguna di Drop Point.
        </p>
      </div>
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-7">
        <div className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-2">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-gray-700 font-bold text-xl">{stats.totalDrop}</div>
            <div className="text-sm text-gray-500">Total Drop-off</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-4">
          <div className="bg-yellow-100 rounded-full p-2">
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <div className="text-gray-700 font-bold text-xl">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-4">
          <div className="bg-green-50 rounded-full p-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-gray-700 font-bold text-xl">{stats.completed}</div>
            <div className="text-sm text-gray-500">Selesai</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-4">
          <div className="bg-blue-100 rounded-full p-2">
            <Scale3d className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-gray-700 font-bold text-xl">
              {stats.totalWeight.toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg
            </div>
            <div className="text-sm text-gray-500">Total Berat</div>
          </div>
        </div>
      </div>
      {/* Search bar */}
      <div className="mb-7 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari by Nomor Referensi atau Nama User..."
          className="w-full sm:w-96 border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-50 transition"
          value={search}
          disabled={isLoading}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* List */}
      <div className="flex flex-col gap-5">
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            Tidak ada data EcoDrop.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-stretch justify-between border border-gray-100 rounded-xl shadow-sm py-5 px-6 bg-white gap-4"
            >
              {/* Left: user info */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="font-semibold text-slate-900 text-base">{item.profiles?.full_name || "-"}</div>
                <div className="flex items-center gap-2 mt-1 text-xs text-blue-500 font-mono">
                  <Package className="w-4 h-4" />
                  <span>{item.reference_number}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {formatDate(item.created_at)} {formatTime(item.created_at)}
                </div>
              </div>
              {/* Middle: trash category, weight, point */}
              <div className="flex-1 w-full md:w-1/3 flex flex-col justify-center items-start gap-3 md:gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100`}
                  >
                    {item.trash_categories?.name || "-"}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 font-semibold">
                    Berat:{" "}
                    <span className="text-slate-800">{item.weight ?? "-"} kg</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-purple-600">Poin:</span>
                  <span className="text-purple-800 font-bold">
                    {item.total_points} GC
                  </span>
                </div>
              </div>
              {/* Right: Status & Actions */}
              <div className="w-full md:w-1/3 flex flex-col items-end justify-between gap-3">
                <div
                  className={clsx(
                    "flex items-center px-3 py-1 rounded-full font-medium text-xs mb-2",
                    statusColors[item.status]?.bg || "bg-gray-100",
                    statusColors[item.status]?.text || "text-gray-500"
                  )}
                >
                  {statusColors[item.status]?.icon || null}
                  {(item.status || "unknown")
                    .charAt(0)
                    .toUpperCase() +
                    (item.status || "unknown").slice(1)}
                </div>
                {item.status === "pending" ? (
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-2 rounded-lg border border-red-400 text-red-700 font-semibold bg-white hover:bg-red-50 transition text-sm flex items-center gap-1"
                      onClick={() =>
                        handleAction(
                          item.id,
                          "cancelled",
                          item.user_id,
                          item.total_points
                        )
                      }
                      disabled={isLoading}
                    >
                      <BadgeX className="w-4 h-4" />
                      Tolak
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm flex items-center gap-1"
                      onClick={() =>
                        handleAction(
                          item.id,
                          "completed",
                          item.user_id,
                          item.total_points
                        )
                      }
                      disabled={isLoading}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      Terima
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs mt-4 italic">
                    Tidak ada aksi
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}