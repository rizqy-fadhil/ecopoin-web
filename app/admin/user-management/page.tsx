"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Search, RefreshCw, Loader2, Users, UserCheck, Filter } from "lucide-react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  total_points: number | null;
  is_active?: boolean | null;
  role?: string | null;
  created_at?: string | null;
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

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatUserId(id: string): string {
  return `#USR-${id.slice(0, 8).toUpperCase()}`;
}

function getUserStatus(profile: Profile): "AKTIF" | "PASIF" {
  if (profile.is_active !== undefined && profile.is_active !== null) {
    return profile.is_active ? "AKTIF" : "PASIF";
  }
  return (profile.total_points ?? 0) > 0 ? "AKTIF" : "PASIF";
}

export default function UserManagementPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProfiles = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error fetching profiles:", error);
    } else {
      console.log("Data Users dari Supabase:", data);
      setProfiles(data ?? []);
    }

    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.toLowerCase();
    return profiles.filter(
      (p) =>
        (p.full_name ?? "").toLowerCase().includes(q) ||
        (p.email ?? "").toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [profiles, search]);

  const totalUsers = profiles.length;
  const activeUsers = profiles.filter((p) => getUserStatus(p) === "AKTIF").length;
  const filteredCount = filtered.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
              {totalUsers} Total
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Kelola dan monitor semua user terdaftar di platform.
          </p>
        </div>
        <button
          onClick={() => fetchProfiles(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-100">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-emerald-100">
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">User Aktif</div>
            <div className="text-2xl font-bold text-gray-900">{activeUsers}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-purple-100">
            <Filter className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Hasil Filter</div>
            <div className="text-2xl font-bold text-gray-900">{filteredCount}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, atau ID User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        />
      </div>

      {/* User Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-sm">
            {search.trim()
              ? "Tidak ada user yang sesuai dengan pencarian."
              : "Belum ada user terdaftar."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((user) => {
            const status = getUserStatus(user);
            const initials = getInitials(user.full_name);
            const avatarColor = getAvatarColor(user.id);

            return (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition"
              >
                {/* Avatar */}
                <div
                  className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-lg ${avatarColor}`}
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 truncate">
                    {user.full_name || "Unnamed User"}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {user.email || "-"}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">
                    {formatUserId(user.id)}
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full ${
                    status === "AKTIF"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
