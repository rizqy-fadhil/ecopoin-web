"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { User2, Coins, Clock, BadgeCheck, BadgeX, Wallet, Search } from "lucide-react";

const supabase = createClient();

type Transaction = {
  id: number;
  user_id: number;
  total_points: number;
  status: "pending" | "completed" | "cancelled";
  reference_number?: string;
  notes?: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
};

const statusColors: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  pending: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    icon: <Clock className="w-4 h-4 text-orange-500 mr-1" />,
  },
  completed: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    icon: <BadgeCheck className="w-4 h-4 text-sky-500 mr-1" />,
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
    });
  } catch {
    return "-";
  }
}

export default function GreenCoinAdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*, profiles!transactions_user_id_fkey(full_name)")
      .eq("type", "withdraw")
      .order("created_at", { ascending: false });
    if (!error) setTransactions(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    let total = 0;
    let pending = 0;
    let paid = 0;
    let waiting = 0;
    for (const t of transactions) {
      total += 1;
      if (t.status === "pending") {
        pending += t.total_points;
        waiting += 1;
      }
      if (t.status === "completed") {
        paid += t.total_points;
      }
    }
    return {
      total,
      potensiGC: pending,
      gcTerbayar: paid,
      menunggu: waiting,
    };
  }, [transactions]);

  // Search transactions by full_name or reference_number or notes
  const filteredTxs = useMemo(() => {
    if (!search) return transactions;
    const term = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const ref = (t.reference_number || "").toLowerCase();
      const fullName = (t.profiles?.full_name || "").toLowerCase();
      const notes = (t.notes || "").toLowerCase();
      return (
        ref.includes(term) ||
        fullName.includes(term) ||
        notes.includes(term)
      );
    });
  }, [transactions, search]);

  // Refund system action handler (fix: only refund on 'cancelled', never add points on 'completed')
  async function handleAction(
    transactionId: number,
    statusAction: "completed" | "cancelled",
    userId: number,
    amount: number // amount = total_points (GC) yang akan di-refund jika 'cancelled'
  ) {
    if (!transactionId) return;
    setLoading(true);
    try {
      if (statusAction === "completed") {
        // HANYA update status transaksi, JANGAN tambah saldo user!
        const { error } = await supabase
          .from("transactions")
          .update({ status: "completed" })
          .eq("id", transactionId);
        if (error) throw error;
        alert("Permintaan withdraw diterima! Transfer manual dilakukan oleh admin.");
      } else if (statusAction === "cancelled") {
        // Update status transaksi menjadi 'cancelled'
        const { error: trxError } = await supabase
          .from("transactions")
          .update({ status: "cancelled" })
          .eq("id", transactionId);
        if (trxError) throw trxError;

        // Refund: tambahkan kembali GC user
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", userId)
          .single();
        if (profileErr) throw profileErr;

        const nextPoints = Number(profile?.total_points || 0) + Number(amount);
        const { error: updErr } = await supabase
          .from("profiles")
          .update({ total_points: nextPoints })
          .eq("id", userId);
        if (updErr) throw updErr;

        alert("Pencairan ditolak & poin telah dikembalikan ke user!");
      }
      fetchTransactions();
    } catch (err: any) {
      alert("Gagal update status: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Coins className="w-8 h-8 text-orange-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          GreenCoin Transactions
        </h1>
      </div>
      <div className="text-gray-600 mb-8 text-sm md:text-base pl-1">
        Kelola permintaan dan pantau pergerakan pencairan poin (Withdrawal) ke E-Wallet.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="flex items-center p-4 rounded-lg shadow bg-orange-50 border border-orange-100">
          <Coins className="w-6 h-6 text-orange-500 mr-3" />
          <div>
            <div className="text-[13px] text-gray-600 font-medium">Total Transaksi</div>
            <div className="text-xl font-bold text-orange-700">{stats.total}</div>
          </div>
        </div>
        <div className="flex items-center p-4 rounded-lg shadow bg-green-50 border border-green-100">
          <Coins className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <div className="text-[13px] text-gray-600 font-medium">Potensi GC</div>
            <div className="text-xl font-bold text-green-800">
              {stats.potensiGC.toLocaleString("id-ID")} GC
            </div>
          </div>
        </div>
        <div className="flex items-center p-4 rounded-lg shadow bg-sky-50 border border-sky-100">
          <Coins className="w-6 h-6 text-sky-600 mr-3" />
          <div>
            <div className="text-[13px] text-gray-600 font-medium">GC Terbayar</div>
            <div className="text-xl font-bold text-sky-800">
              {stats.gcTerbayar.toLocaleString("id-ID")} GC
            </div>
          </div>
        </div>
        <div className="flex items-center p-4 rounded-lg shadow bg-red-50 border border-red-100">
          <Clock className="w-6 h-6 text-red-400 mr-3" />
          <div>
            <div className="text-[13px] text-gray-600 font-medium">Menunggu</div>
            <div className="text-xl font-bold text-red-700">{stats.menunggu}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm md:text-base"
            placeholder="Cari berdasarkan nama user, nomor referensi, atau notes (e-wallet)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Data List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center text-gray-400">Memuat data...</div>
        ) : filteredTxs.length === 0 ? (
          <div className="py-24 text-center text-gray-400">Tidak ada data transaksi withdraw.</div>
        ) : (
          filteredTxs.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row p-4 md:p-6 rounded-lg border bg-white shadow items-stretch gap-4 md:gap-0"
            >
              {/* Left: User & Date */}
              <div className="w-full md:w-1/3 flex items-center md:items-start gap-3">
                <div className="flex-shrink-0 bg-green-50 rounded-full p-2">
                  <User2 className="w-7 h-7 text-green-500" />
                </div>
                <div className="flex flex-col justify-center md:justify-start">
                  <div className="font-semibold text-green-700 text-lg leading-tight">
                    {item.profiles?.full_name || "-"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Request: {formatDate(item.created_at)} {formatTime(item.created_at)}
                  </div>
                </div>
              </div>
              {/* Middle: E-Wallet (Notes) & Poin Withdraw */}
              <div className="w-full md:w-1/3 flex flex-col justify-center gap-2 items-start md:items-center">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-500" />
                  <span className="text-[13px] text-blue-600 font-mono truncate max-w-[210px]" title={item.notes || "-"}>
                    {item.notes || "—"}
                  </span>
                </div>
                <div className="mt-1 font-bold text-2xl text-purple-700 tracking-tight">
                  {item.total_points.toLocaleString("id-ID")} <span className="text-base text-purple-400">GC</span>
                </div>
              </div>
              {/* Right: Status & Actions */}
              <div className="w-full md:w-1/3 flex flex-col items-end justify-between gap-3">
                <div
                  className={`flex items-center px-3 py-1 rounded-full font-medium text-xs mb-2 ${statusColors[item.status]?.bg || "bg-gray-100"} ${statusColors[item.status]?.text || "text-gray-500"}`}
                >
                  {statusColors[item.status]?.icon || null}
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
                {item.status === "pending" ? (
                  <div className="flex gap-2 mt-1">
                    <button
                      className="px-4 py-2 rounded-lg border border-red-400 text-red-700 font-semibold bg-white hover:bg-red-50 transition text-sm flex items-center gap-1"
                      disabled={loading}
                      onClick={() =>
                        handleAction(item.id, "cancelled", item.user_id, item.total_points)
                      }
                    >
                      <BadgeX className="w-4 h-4" />
                      Tolak
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm flex items-center gap-1"
                      disabled={loading}
                      onClick={() =>
                        handleAction(item.id, "completed", item.user_id, item.total_points)
                      }
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