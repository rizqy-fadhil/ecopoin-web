"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PiggyBank,
  ScrollText,
  Leaf,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

// Supabase client
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function numberFormat(value: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value);
}

// PERBAIKAN: Ganti points menjadi total_points
type Transaction = {
  id: number;
  type: string;
  status: string;
  total_points: number | null; 
  weight: number | null;
  created_at: string;
  trash_category?: {
    name: string;
  } | null;
};

type Profile = {
  total_points: number;
};

type WasteCategory = {
  id: number;
  name: string;
};

type SummaryCardProps = {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
};

function SummaryCard({ icon, bg, label, value }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-5">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bg}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({
  children,
  status,
}: {
  children: React.ReactNode;
  status?: string;
}) {
  const map: Record<string, { bg: string; text: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-900" },
    processing: { bg: "bg-yellow-100", text: "text-yellow-900" },
    completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
    redeemed: { bg: "bg-emerald-100", text: "text-emerald-700" },
    canceled: { bg: "bg-red-100", text: "text-red-700" },
    failed: { bg: "bg-red-100", text: "text-red-700" },
  };
  const lower = (status || "").toLowerCase();
  const { bg, text } = map[lower] || { bg: "bg-gray-100", text: "text-gray-700" };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${bg} ${text}`}>
      {children}
    </span>
  );
}

const CATEGORIES_COLORS = [
  "#16a34a", 
  "#2563eb", 
  "#eab308", 
  "#f97316", 
  "#a21caf", 
  "#ef4444", 
];

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesMaster, setCategoriesMaster] = useState<WasteCategory[]>([]);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);

      const { data: categoriesData, error: catErr } = await supabase
        .from('trash_categories')
        .select('id, name')
        .order('name');
        
      if (catErr) console.error("Error getting trash_categories:", catErr);

      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        setLoading(false);
        return;
      }

      const { data: profData } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", user.id)
        .single();

      const { data: dataRaw, error: txError } = await supabase
        .from('transactions')
        .select('*, trash_categories(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (txError) console.error("Detail Error Transaksi:", txError);

      if (!ignore) {
        setCategoriesMaster(categoriesData ?? []);
        setProfile(profData ? { total_points: profData.total_points ?? 0 } : { total_points: 0 });
        
        // PERBAIKAN: Mapping data trash_categories (Object, bukan Array)
        const normalizedTransactions: Transaction[] = ((dataRaw ?? []) as any[]).map(
          (t) => ({
            ...t,
            trash_category: t.trash_categories ? { name: t.trash_categories.name } : null,
          })
        );
        
        setTransactions(normalizedTransactions ?? []);
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  const {
    totalPoints,
    totalWaste,
    totalTransactions,
    totalCO2,
    recentTransactions,
    activityData,
    categoriesBreakdown,
  } = useMemo(() => {
    const completedRecycling = transactions.filter(
      (t) => (t.type === "ecopick" || t.type === "ecodrop") && t.status?.toLowerCase() === "completed"
    );

    const waste = completedRecycling.reduce((sum, t) => sum + (t.weight || 0), 0);
    const co2 = waste * 2.5;

    const activityMap: Record<string, { label: string; recycled: number }> = {};
    completedRecycling.forEach((trx) => {
      if ((trx.weight ?? 0) > 0) {
        const dt = new Date(trx.created_at);
        const key = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}`;
        const label = dt.toLocaleString("en-US", { month: "short", year: "numeric" });
        if (!activityMap[key]) activityMap[key] = { label, recycled: 0 };
        activityMap[key].recycled += trx.weight || 0;
      }
    });
    const chartData = Object.entries(activityMap)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([, val]) => val);

    const categoriesMap: Record<string, number> = {};
    completedRecycling.forEach((trx) => {
      const catName = trx.trash_category?.name || "";
      if (catName) {
        categoriesMap[catName] = (categoriesMap[catName] || 0) + (trx.weight ?? 0);
      }
    });
    
    const categoriesBreakdown: { name: string; total: number }[] =
      categoriesMaster.map((cat) => ({
        name: cat.name,
        total: categoriesMap[cat.name] || 0,
      }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total);

    const trxCount = transactions.length;
    let recents: Transaction[] = [];
    if (transactions && transactions.length > 0) {
      recents = [...transactions]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
    }

    return {
      totalPoints: profile?.total_points ?? 0,
      totalWaste: waste,
      totalTransactions: trxCount,
      totalCO2: co2,
      recentTransactions: recents,
      activityData: chartData,
      categoriesBreakdown,
    };
  }, [profile, transactions, categoriesMaster]);

  if (loading) {
    return (
      <main className="p-6 bg-gray-50/50 min-h-screen flex flex-col gap-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
        </div>
      </main>
    );
  }

  function transactionIcon(tx: Transaction) {
    if (tx.type === "withdraw") {
      return (
        <span className="inline-flex items-center justify-center bg-red-50 rounded-full w-10 h-10">
          <ArrowUpRight className="text-red-600" size={22} />
        </span>
      );
    }
    if (tx.type === "ecopick" || tx.type === "ecodrop") {
      return (
        <span className="inline-flex items-center justify-center bg-emerald-50 rounded-full w-10 h-10">
          <ArrowDownLeft className="text-emerald-600" size={22} />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center bg-gray-100 rounded-full w-10 h-10">
        <PiggyBank className="text-gray-400" size={22} />
      </span>
    );
  }

  // PERBAIKAN: Menggunakan tx.total_points
  function transactionValueGC(tx: Transaction) {
    if (tx.type === "ecopick" || tx.type === "ecodrop") {
      const pts = tx.total_points ?? 0;
      return (
        <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">
          {`+${numberFormat(pts)} GC`}
        </span>
      );
    }
    if (tx.type === "withdraw") {
      const pts = tx.total_points ?? 0;
      return (
        <span className="font-bold text-red-600 text-sm whitespace-nowrap">
          {`-${numberFormat(pts)} GC`}
        </span>
      );
    }
    return (
      <span className="font-semibold text-gray-600 text-sm">
        {tx.total_points ?? ""}
      </span>
    );
  }

  function typeLabel(tx: Transaction) {
    if (tx.type === "ecopick") return "EcoPick";
    if (tx.type === "ecodrop") return "EcoDrop";
    if (tx.type === "withdraw") return "Withdraw";
    return tx.type.charAt(0).toUpperCase() + tx.type.slice(1);
  }

  function statusLabel(tx: Transaction) {
    switch ((tx.status || "").toLowerCase()) {
      case "pending": return "Pending";
      case "processing": return "Processing";
      case "completed": return "Completed";
      case "redeemed": return "Redeemed";
      case "failed": return "Failed";
      case "canceled": return "Cancelled";
      default: return tx.status ?? "";
    }
  }

  return (
    <main className="p-6 bg-gray-50/50 min-h-screen flex flex-col gap-6">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <SummaryCard
            key="greencoin"
            label="GreenCoin Balance"
            value={`${numberFormat(totalPoints, { maximumFractionDigits: 0 })} GC`}
            icon={<PiggyBank className="text-emerald-700" size={28} />}
            bg="bg-emerald-100"
          />
          <SummaryCard
            key="waste"
            label="Total Waste Recycled"
            value={`${numberFormat(totalWaste)} kg`}
            icon={<Leaf className="text-blue-700" size={28} />}
            bg="bg-blue-100"
          />
          <SummaryCard
            key="transactions"
            label="Total Transactions"
            value={numberFormat(totalTransactions, { maximumFractionDigits: 0 })}
            icon={<ScrollText className="text-purple-600" size={28} />}
            bg="bg-purple-100"
          />
          <SummaryCard
            key="co2"
            label="CO2 Saved"
            value={`${numberFormat(totalCO2)} kg`}
            icon={<Leaf className="text-orange-700" size={28} />}
            bg="bg-orange-100"
          />
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800 text-lg">Recycling Activity</span>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData.length > 0 ? activityData : [{ label: "", recycled: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} minTickGap={8} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={48} allowDecimals />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px" }}
                    labelStyle={{ fontWeight: 500 }}
                    formatter={(value: any, name: any) => [`${numberFormat(Number(value ?? 0))} kg`, "Recycled"]}
                  />
                  <Line type="monotone" dataKey="recycled" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-span-1 bg-white rounded-xl shadow-sm p-5 flex flex-col">
            <div className="font-semibold text-gray-800 text-lg mb-3">Recent Transactions</div>
            <ul className="flex-1 flex flex-col gap-0.5">
              {recentTransactions.length === 0 ? (
                <li>
                  <div className="text-gray-400 text-center py-5">No Transactions Yet.</div>
                </li>
              ) : (
                recentTransactions.map((tx) => (
                  <li key={tx.id} className="flex items-center border-b last:border-b-0 py-3 px-0 gap-4">
                    {transactionIcon(tx)}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 leading-none truncate">{typeLabel(tx)}</div>
                      <div className="flex items-center text-xs text-gray-400 pt-0.5 gap-2">
                        <span>
                          {new Date(tx.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                        {tx.trash_category?.name && (
                          <span className="px-1 rounded bg-gray-50 border text-gray-500 border-gray-100 text-[11px] font-medium">
                            {tx.trash_category.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 pr-2">{transactionValueGC(tx)}</div>
                    <StatusBadge status={tx.status}>{statusLabel(tx)}</StatusBadge>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800 text-lg">Waste Categories</span>
          </div>
          {categoriesBreakdown.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
              <div className="flex-1 flex justify-center">
                <div className="w-[230px] h-[230px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriesBreakdown}
                        dataKey="total"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={55}
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${Math.round((percent ?? 0) * 100)}%)`}
                        isAnimationActive={false}
                      >
                        {categoriesBreakdown.map((entry, i) => (
                          <Cell key={entry.name} fill={CATEGORIES_COLORS[i % CATEGORIES_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any) => [`${numberFormat(Number(value ?? 0))} kg`, name]}
                        contentStyle={{ borderRadius: "8px" }}
                        labelStyle={{ fontWeight: 500 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex-1 min-w-[170px] max-w-md w-full">
                <ul className="flex flex-col gap-2">
                  {categoriesBreakdown.map((cat, i) => {
                    const max = categoriesBreakdown[0]?.total || 1;
                    return (
                      <li key={cat.name} className="flex items-center gap-3">
                        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORIES_COLORS[i % CATEGORIES_COLORS.length] }}></span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{cat.name}</span>
                            <span className="text-xs text-gray-500 ml-4">{numberFormat(cat.total)} kg</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 mt-1.5">
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${Math.max(8, (cat.total / max) * 100)}%`, background: CATEGORIES_COLORS[i % CATEGORIES_COLORS.length], transition: "width 0.4s" }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center w-full py-12">No waste data yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}