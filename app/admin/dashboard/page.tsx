"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import {
  Users,
  ScrollText,
  Leaf,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Transaction = {
  id: number;
  type: string;
  status: string;
  weight: number | null;
  total_points: number | null;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
  } | null;
};

type Profile = {
  id: string;
  full_name: string | null;
};

const AVATAR_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function getInitials(name: string | null): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

function getAvatarColor(id: string | number): string {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function typeLabel(type: string): string {
  if (type === "ecopick") return "EcoPick";
  if (type === "ecodrop") return "EcoDrop";
  if (type === "withdraw") return "Withdraw";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateID(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminDashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Fetch user count (role = 'user')
      const { count: userCount, error: userErr } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "user");

      if (userErr) console.error("Error fetching user count:", userErr);

      // Fetch all transactions
      const { data: txData, error: txErr } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (txErr) console.error("Error fetching transactions:", txErr);
      console.log("Raw Transactions Admin:", txData);

      // Fetch all profiles for name lookup
      const { data: profilesData, error: profErr } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (profErr) console.error("Error fetching profiles:", profErr);

      // Build a lookup map: user_id -> full_name
      const profileMap: Record<string, string> = {};
      (profilesData ?? []).forEach((p: any) => {
        profileMap[p.id] = p.full_name ?? "";
      });

      setTotalUsers(userCount ?? 0);

      // Normalize transactions with profile name attached
      const normalized: Transaction[] = ((txData ?? []) as any[]).map((t) => ({
        ...t,
        profiles: { full_name: profileMap[t.user_id] || null },
      }));
      setTransactions(normalized);
    } catch (err) {
      console.error("Unexpected error fetching admin dashboard data:", err);
      setTransactions([]);
      setTotalUsers(0);
    }

    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    totalTransactions,
    totalWaste,
    pendingCount,
    ecopickCount,
    ecodropCount,
    completedCount,
    recentTransactions,
  } = useMemo(() => {
    const total = transactions.length;

    const completedRecycling = transactions.filter(
      (t) =>
        (t.type === "ecopick" || t.type === "ecodrop") &&
        t.status?.toLowerCase() === "completed"
    );
    const waste = completedRecycling.reduce(
      (sum, t) => sum + (t.weight || 0),
      0
    );

    const pending = transactions.filter(
      (t) => t.status?.toLowerCase() === "pending"
    ).length;

    const ecopick = transactions.filter((t) => t.type === "ecopick").length;
    const ecodrop = transactions.filter((t) => t.type === "ecodrop").length;
    const completed = transactions.filter(
      (t) => t.status?.toLowerCase() === "completed"
    ).length;

    const recent = transactions.slice(0, 5);

    return {
      totalTransactions: total,
      totalWaste: waste,
      pendingCount: pending,
      ecopickCount: ecopick,
      ecodropCount: ecodrop,
      completedCount: completed,
      recentTransactions: recent,
    };
  }, [transactions]);

  // Progress bar max is total transactions (or 1 to avoid division by zero)
  const progressMax = Math.max(totalTransactions, 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  const today = formatDateID(new Date());

  const statsCards = [
    {
      label: "Total Users",
      value: formatNumber(totalUsers),
      icon: <Users className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      label: "Total Transactions",
      value: formatNumber(totalTransactions),
      icon: <ScrollText className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100",
    },
    {
      label: "Sampah Daur Ulang",
      value: `${formatNumber(totalWaste)} kg`,
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-100",
    },
    {
      label: "Menunggu Proses",
      value: formatNumber(pendingCount),
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-100",
    },
  ];

  const growthSegments = [
    {
      label: "EcoPick",
      count: ecopickCount,
      color: "bg-emerald-500",
      trackColor: "bg-emerald-100",
    },
    {
      label: "EcoDrop",
      count: ecodropCount,
      color: "bg-blue-500",
      trackColor: "bg-blue-100",
    },
    {
      label: "Selesai (Completed)",
      count: completedCount,
      color: "bg-orange-500",
      trackColor: "bg-orange-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            Selamat datang kembali, Admin 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {today} — Ringkasan aktivitas platform EcoPoin hari ini.
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 flex items-center justify-center rounded-full ${card.iconBg}`}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">
                {card.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Platform Growth (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Platform Growth
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Ringkasan aktivitas lintas segmen platform.
          </p>

          <div className="space-y-6">
            {growthSegments.map((seg) => {
              const pct =
                totalTransactions > 0
                  ? Math.round((seg.count / progressMax) * 100)
                  : 0;
              return (
                <div key={seg.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {seg.label}
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {formatNumber(seg.count)}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div
                    className={`w-full h-3 rounded-full ${seg.trackColor}`}
                  >
                    <div
                      className={`h-3 rounded-full ${seg.color} transition-all duration-500`}
                      style={{
                        width: `${Math.max(pct, 2)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary row */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500">Total Transaksi:</span>{" "}
              <span className="font-bold text-gray-900">
                {formatNumber(totalTransactions)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Selesai:</span>{" "}
              <span className="font-bold text-emerald-600">
                {formatNumber(completedCount)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Pending:</span>{" "}
              <span className="font-bold text-amber-600">
                {formatNumber(pendingCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Aktivitas Terbaru (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Aktivitas Terbaru
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            5 transaksi terakhir di platform.
          </p>

          {recentTransactions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                Belum ada transaksi.
              </p>
            </div>
          ) : (
            <ul className="flex-1 flex flex-col gap-1">
              {recentTransactions.map((tx) => {
                const userName =
                  tx.profiles?.full_name || "Unknown User";
                const initials = getInitials(userName);
                const avatarColor = getAvatarColor(tx.user_id || tx.id);

                return (
                  <li
                    key={tx.id}
                    className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-b-0"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-xs ${avatarColor}`}
                    >
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {typeLabel(tx.type)} · {timeAgo(tx.created_at)}
                      </div>
                    </div>

                    {/* GC Value */}
                    <div className="flex-shrink-0 text-right">
                      {(tx.type === "ecopick" || tx.type === "ecodrop") ? (
                        <span className="text-xs font-bold text-emerald-600">
                          +{formatNumber(tx.total_points ?? 0)} GC
                        </span>
                      ) : tx.type === "withdraw" ? (
                        <span className="text-xs font-bold text-red-600">
                          -{formatNumber(tx.total_points ?? 0)} GC
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-500">
                          {tx.total_points ?? 0} GC
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <span
                      className={`flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-md ${tx.status?.toLowerCase() === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : tx.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : tx.status?.toLowerCase() === "failed" ||
                              tx.status?.toLowerCase() === "canceled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {tx.status
                        ? tx.status.charAt(0).toUpperCase() +
                        tx.status.slice(1).toLowerCase()
                        : "-"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}