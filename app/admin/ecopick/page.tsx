"use client";

import React, { useEffect, useState } from "react";
import {
  Truck,
  Clock,
  CheckCircle,
  Scale,
  Search,
  BadgeCheck,
  BadgeX,
  User,
  Mail,
  PackageOpen,
} from "lucide-react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

// Updated statusColors, keys adjusted to new constraint
const statusColors: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: <Clock className="w-4 h-4 text-yellow-500 mr-1" />,
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: <Clock className="w-4 h-4 text-blue-500 mr-1" />,
  },
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <CheckCircle className="w-4 h-4 text-green-500 mr-1" />,
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <BadgeX className="w-4 h-4 text-red-500 mr-1" />,
  },
};

function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function formatTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(".", ":");
}

export default function EcopickManagementPage() {
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Perbaiki query Supabase: gunakan foreign key user_id pada relasi profiles untuk menghindari error PGRST201
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      console.log("Mulai fetch...");
      const { data, error } = await supabase
        .from("transactions")
        .select("*, profiles!transactions_user_id_fkey(full_name), trash_categories(name)")
        .eq("type", "ecopick")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error Query:", error);
        setTransactions([]);
      } else {
        console.log("Data Supabase:", data);
        setTransactions(data || []);
      }
    } catch (err) {
      console.error("Error Sistem:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  // Statistik otomatis sinkron dengan data transactions
  const totalReq = transactions.length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  // Ubah variabel selesai menjadi completed
  const selesai = transactions.filter((t) => t.status === "completed").length;
  const totalBerat = transactions.reduce(
    (sum, t) => sum + (typeof t.weight === "number" ? t.weight : Number(t.weight) || 0),
    0
  );

  // Search Filter
  const filteredData = transactions.filter((t) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (t.reference_number || "")
        .toLowerCase()
        .includes(query) ||
      (t.profiles?.full_name || "")
        .toLowerCase()
        .includes(query) ||
      // Filter by email: if not present, fallback, so this will always return false for email, but safe to keep for UI fallback
      (t.profiles?.email || "")
        .toLowerCase()
        .includes(query)
    );
  });

  // Handle Accept/Reject actions
  async function handleAction(
    transactionId: number,
    statusAction: "completed" | "cancelled",
    userId: string,
    totalPoints: number
  ) {
    try {
      if (statusAction === "completed") {
        // Step 1: Update transaction status
        const { error: trxError } = await supabase
          .from("transactions")
          .update({ status: "completed" })
          .eq("id", transactionId);

        if (trxError) throw trxError;

        // Step 2: Top-up profile GreenCoin
        // Get user curr points
        const { data: profile, error: profErr } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", userId)
          .single();

        if (profErr) throw profErr;

        const prevTotal = profile?.total_points || 0;

        const { error: updErr } = await supabase
          .from("profiles")
          .update({ total_points: prevTotal + totalPoints })
          .eq("id", userId);

        if (updErr) throw updErr;

        alert("Transaksi diterima & GreenCoin sudah ditambahkan!");
      } else if (statusAction === "cancelled") {
        // Step: Update transaction status - cancel
        const { error: trxError } = await supabase
          .from("transactions")
          .update({ status: "cancelled" })
          .eq("id", transactionId);

        if (trxError) throw trxError;

        alert("Transaksi berhasil dibatalkan.");
      }
      // Refresh data
      fetchTransactions();
    } catch (err: any) {
      alert(
        "Gagal melakukan aksi: " + (err?.message || err)
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
          EcoPick Management
        </h1>
        <p className="text-gray-500 text-base">
          Lihat dan kelola seluruh permintaan penjemputan sampah (EcoPick) pengguna. Dapatkan insight dan langsung proses approval dari dashboard ini.
        </p>
      </div>
      {/* Statistic Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="flex items-center rounded-xl bg-white shadow-sm p-5 gap-4 border border-blue-100">
          <div className="bg-blue-100 rounded-full p-3">
            <Truck className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-blue-700">{loading ? "-" : totalReq}</div>
            <div className="text-xs text-gray-500">Total Request</div>
          </div>
        </div>
        <div className="flex items-center rounded-xl bg-white shadow-sm p-5 gap-4 border border-yellow-100">
          <div className="bg-yellow-100 rounded-full p-3">
            <Clock className="w-7 h-7 text-yellow-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-700">{loading ? "-" : pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </div>
        <div className="flex items-center rounded-xl bg-white shadow-sm p-5 gap-4 border border-green-100">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <div>
            {/* Stat label tetap "Selesai" agar tidak membingungkan user */}
            <div className="text-lg font-bold text-green-700">{loading ? "-" : selesai}</div>
            <div className="text-xs text-gray-500">Selesai</div>
          </div>
        </div>
        <div className="flex items-center rounded-xl bg-white shadow-sm p-5 gap-4 border border-purple-100">
          <div className="bg-purple-100 rounded-full p-3">
            <Scale className="w-7 h-7 text-purple-500" />
          </div>
          <div>
            <div className="text-lg font-bold text-purple-700">
              {loading ? "-" : totalBerat}&nbsp;kg
            </div>
            <div className="text-xs text-gray-500">Total Berat</div>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative mb-7"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-slate-900 text-base shadow-sm"
          placeholder="Cari berdasarkan nomor referensi, nama, atau email pengguna..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
      </form>
      {/* List Transactions */}
      <div className="flex flex-col gap-5">
        {loading ? (
          <div className="text-center text-gray-400 py-16">
            Memuat data...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            Tidak ada data Ecopick ditemukan.
          </div>
        ) : (
          // Mapping data utama berdasarkan instruksi prompt
          transactions
            .filter((t) => {
              if (!searchQuery) return true;
              const query = searchQuery.toLowerCase();
              return (
                (t.reference_number || "")
                  .toLowerCase()
                  .includes(query) ||
                (t.profiles?.full_name || "")
                  .toLowerCase()
                  .includes(query) ||
                (t.profiles?.email || "")
                  .toLowerCase()
                  .includes(query)
              );
            })
            .map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-stretch md:items-center bg-white shadow-sm border border-gray-100 rounded-xl p-6 gap-6"
              >
                {/* Left: User Info */}
                <div className="w-full md:w-1/3 flex flex-col gap-1 mb-2 md:mb-0">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-slate-800">
                      {item.profiles?.full_name || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>
                      {item.profiles?.email || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-blue-500 font-mono">
                    <PackageOpen className="w-4 h-4" />
                    <span>{item.reference_number}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Request: {formatDate(item.created_at)} {formatTime(item.created_at)}
                  </div>
                </div>
                {/* Middle: Category & Weight */}
                <div className="w-full md:w-1/3 flex flex-col justify-center items-start gap-3 md:gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100`}
                    >
                      {item.trash_categories?.name || "-"}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 font-semibold">
                      Berat: <span className="text-slate-800">{item.weight}</span> kg
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
                    className={`flex items-center px-3 py-1 rounded-full font-medium text-xs ${
                      statusColors[item.status]?.bg || "bg-gray-100"
                    } ${
                      statusColors[item.status]?.text || "text-gray-500"
                    } mb-2`}
                  >
                    {statusColors[item.status]?.icon || null}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                  {item.status === "pending" ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-4 py-2 rounded-lg border border-red-400 text-red-700 font-semibold bg-white hover:bg-red-50 transition text-sm flex items-center gap-1"
                        onClick={() =>
                          handleAction(item.id, "cancelled", item.user_id, item.total_points)
                        }
                        disabled={loading}
                      >
                        <BadgeX className="w-4 h-4" />
                        Tolak
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm flex items-center gap-1"
                        onClick={() =>
                          handleAction(item.id, "completed", item.user_id, item.total_points)
                        }
                        disabled={loading}
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