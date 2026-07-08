"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ArrowLeftRight,
  Recycle,
  Truck,
  Wallet2,
  X as XIcon,
  Plus,
  Minus,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import clsx from "clsx";

// Utility for thousand separator
function formatGC(num: number) {
  return num.toLocaleString("id-ID");
}
function formatRupiah(num: number) {
  return (
    "Rp" +
    (num || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 }) +
    ",00"
  );
}

// Format date to "June 12, 2024" or "June 12, 2024 • 12:30 PM"
function formatDate(dateStr: string | Date) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return (
    date.toLocaleDateString("en-US", opts) +
    " \u2022 " + // bullet
    date.toLocaleTimeString("en-US", timeOpts)
  );
}

// Find EWallet label
function ewalletLabel(val: string | undefined) {
  if (!val) return "";
  const ew = EWALLETS.find(e => e.value === val.toLowerCase());
  return ew ? ew.label : val;
}

const EWALLETS = [
  { label: "DANA", value: "dana" },
  { label: "GoPay", value: "gopay" },
  { label: "OVO", value: "ovo" },
  { label: "ShopeePay", value: "shopeepay" },
];

const MIN_WITHDRAW = 500;

export default function GreenCoinPage() {
  const supabase: SupabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const [balance, setBalance] = useState<number>(0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedEwallet, setSelectedEwallet] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // User state
  const [userId, setUserId] = useState<string | null>(null);

  // Transaction history state and filter
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "earned" | "spent">("all");

  // Fetch balance & user ID on mount
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User tidak terdeteksi atau belum login:", error?.message);
        return;
      }

      setUserId(user.id);
      // console.log("ID User Login:", user.id);

      const { data, error: profErr } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", user.id)
        .single();

      if (profErr) {
        console.error("Gagal ambil saldo Supabase:", profErr.message);
        return;
      }

      if (data && typeof data.total_points !== "undefined") {
        setBalance(Number(data.total_points) || 0);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch transaction history for logged-in user
  useEffect(() => {
    async function fetchHistory(uid: string) {
      setHistoryLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) {
        // You may want to show toast/etc
        setHistoryData([]);
        setHistoryLoading(false);
        return;
      }

      setHistoryData(Array.isArray(data) ? data : []);
      setHistoryLoading(false);
    }
    if (userId) {
      fetchHistory(userId);
    } else {
      setHistoryData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // For "All" button in withdrawal
  function handleSelectAllAmount() {
    setAmount(balance ? String(balance) : "0");
  }

  const amountNumber = useMemo(() => {
    // sanitize amount (allow only numbers)
    return Number(amount.replace(/[^0-9]/g, ""));
  }, [amount]);
  const amountIsValid =
    amountNumber >= MIN_WITHDRAW && amountNumber <= balance;

  // Form is valid if filled
  const formIsFilled =
    selectedEwallet &&
    phone.trim().length > 0 &&
    accountName.trim().length > 0 &&
    amountNumber > 0;

  // Confirm button enabled logic
  const canSubmit =
    !loading && amountIsValid && formIsFilled;

  // LOGIKA HANDLE SUBMIT DIPERBARUI SESUAI INSTRUKSI
  async function handleWithdrawSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Ambil user terbaru (dari supabase.auth.getUser)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User tidak terdeteksi atau belum login.");
        return;
      }

      // 2. Validasi amount
      if (!canSubmit) return;
      if (amountNumber < MIN_WITHDRAW) {
        alert(`Minimal withdraw adalah ${MIN_WITHDRAW} GC`);
        return;
      }
      if (amountNumber > balance) {
        alert("Saldo tidak mencukupi untuk withdraw");
        return;
      }

      // 3. Update saldo di database (potong saldo di tabel profiles).
      //    Gunakan atomic update, pastikan eq('id', user.id)
      const newBalance = balance - amountNumber;

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ total_points: newBalance })
        .eq("id", user.id);

      if (updateErr) {
        alert(
          updateErr?.message ||
            "Gagal memperbarui saldo. Silakan coba lagi."
        );
        return;
      }

      // 4. Setelah saldo sukses terpotong, insert transaksi withdraw ke tabel transactions
      const { error: insertErr } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdraw",
        status: "pending",
        total_points: amountNumber,
        notes: `Via ${EWALLETS.find((e) => e.value === selectedEwallet)?.label} - ${phone}`,
        created_at: new Date().toISOString(),
      });

      if (insertErr) {
        alert(
          insertErr?.message ||
            "Gagal mencatat transaksi withdraw, silakan kontak admin."
        );
        return;
      }

      // 5. Update state balance agar di UI langsung sinkron dengan database
      setBalance((prev) => prev - amountNumber);
      setIsWithdrawModalOpen(false);
      setPhone("");
      setAccountName("");
      setAmount("");
      setSelectedEwallet(null);

      // 6. Refresh transaction history
      if (user.id) {
        // Optional: refetch after slight delay to give backend time to insert
        setTimeout(async () => {
          const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (!error && Array.isArray(data)) {
            setHistoryData(data);
          }
        }, 800);
      }

      alert("Permintaan pencairan berhasil dikirim");
    } catch (err: any) {
      alert(
        err?.message ||
          "Gagal melakukan pencairan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  // -------- FILTER LOGIC --------
  const filteredHistory = useMemo(() => {
    if (!historyData) return [];
    if (activeFilter === "all") {
      return historyData;
    } else if (activeFilter === "earned") {
      // Only show ecopick or ecodrop and status completed
      return historyData.filter(
        (tx) =>
          (tx.type === "ecopick" || tx.type === "ecodrop") &&
          tx.status === "completed"
      );
    } else if (activeFilter === "spent") {
      // Only show withdraw
      return historyData.filter((tx) => tx.type === "withdraw");
    }
    return historyData;
  }, [historyData, activeFilter]);

  // ---------- ICON & STATUS UTILS ----------
  function getTxIcon(tx: any) {
    if (tx.type === "ecopick") {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
          <Truck className="w-7 h-7 text-green-400" />
        </div>
      );
    }
    if (tx.type === "ecodrop") {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
          <Recycle className="w-7 h-7 text-green-400" />
        </div>
      );
    }
    if (tx.type === "withdraw") {
      return (
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
          <Wallet2 className="w-7 h-7 text-gray-400" />
        </div>
      );
    }
    // fallback
    return (
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
        <Wallet2 className="w-7 h-7 text-gray-400" />
      </div>
    );
  }

  function getTxAmountAndColor(tx: any) {
    if (tx.type === "withdraw") {
      return {
        displayGC: `- ${formatGC(tx.total_points || 0)} GC`,
        color: "text-red-600 font-bold",
        icon: <ArrowUpRight className="w-5 h-5 inline mr-1 text-red-600" />,
      };
    } else if (tx.type === "ecopick" || tx.type === "ecodrop") {
      return {
        displayGC: `+ ${formatGC(tx.total_points || 0)} GC`,
        color: "text-green-600 font-bold",
        icon: <ArrowDownLeft className="w-5 h-5 inline mr-1 text-green-600" />,
      };
    }
    // fallback
    return {
      displayGC: formatGC(tx.total_points || 0) + " GC",
      color: "text-gray-600 font-bold",
      icon: null,
    };
  }

  function getTxTitle(tx: any) {
    if (tx.type === "ecopick" || tx.type === "ecodrop") {
      // Use category name if available (e.g. tx.category_name)
      if (tx.category_name) return tx.category_name;
      // fallback
      return tx.type === "ecopick" ? "EcoPick" : "EcoDrop";
    }
    if (tx.type === "withdraw") {
      // Extract Ewallet name from notes if possible
      if (typeof tx.notes === "string" && tx.notes.startsWith("Via ")) {
        return tx.notes;
      }
      return "Withdraw";
    }
    return tx.type || "Transaction";
  }

  // Badge UI by status (pending/completed/cancelled)
  function getTxBadge(tx: any) {
    if (tx.status === "completed")
      return (
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 whitespace-nowrap">
          Completed
        </span>
      );
    if (tx.status === "pending")
      return (
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 whitespace-nowrap">
          Pending
        </span>
      );
    if (tx.status === "cancelled" || tx.status === "canceled")
      return (
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 whitespace-nowrap">
          Cancelled
        </span>
      );
    // fallback
    return (
      <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-400 whitespace-nowrap">
        {tx.status}
      </span>
    );
  }

  return (
    <main className="p-3 sm:p-4 md:p-8 bg-gray-50 min-h-screen flex flex-col">
      {/* Total Balance Card */}
      <div className="bg-green-600 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 md:gap-8">
        {/* Left: Icon & Balance */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Wallet2 className="w-8 h-8 text-white/80" />
            <span className="uppercase tracking-wider text-sm font-semibold text-white/80">
              TOTAL BALANCE
            </span>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
            {formatGC(balance)}{" "}
            <span className="font-light text-3xl align-top">GC</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-white/90 text-sm">
              ≈ {formatRupiah(balance * 100)}
            </span>
          </div>
        </div>
        {/* Right: Withdraw Button */}
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold text-base sm:text-lg shadow transition"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            <ArrowLeftRight className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form
            className="relative rounded-2xl bg-white w-full max-w-[430px] mx-3 px-4 py-5 sm:px-7 sm:py-7 shadow-2xl flex flex-col"
            onSubmit={handleWithdrawSubmit}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Withdraw</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Convert your GreenCoin into e-wallet balance quickly and securely.
                </p>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 absolute right-5 top-5"
                onClick={() => setIsWithdrawModalOpen(false)}
                tabIndex={0}
                aria-label="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Balance info gray card */}
            <div className="flex items-center bg-gray-50 rounded-xl p-4 mb-6 mt-3 border border-gray-100">
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800">
                  {formatGC(balance)} GC
                  <span className="text-sm font-light text-gray-500 ml-2">
                    ≈ {formatRupiah(balance * 100)}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Minimum withdrawal <span className="font-semibold text-green-600">{MIN_WITHDRAW} GC</span>
                </div>
              </div>
              <Wallet2 className="w-9 h-9 text-green-500 ml-2" />
            </div>

            {/* E-Wallet Selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                Select E-Wallet
              </label>
              <div className="grid grid-cols-2 sm:flex gap-2">
                {EWALLETS.map((ew) => (
                  <button
                    type="button"
                    key={ew.value}
                    className={clsx(
                      "flex-1 py-3 rounded-xl border font-semibold text-center transition focus:outline-none",
                      selectedEwallet === ew.value
                        ? "border-green-600 text-green-700 font-bold bg-green-50"
                        : "border-gray-200 text-gray-400 bg-white hover:border-green-300"
                    )}
                    onClick={() => setSelectedEwallet(ew.value)}
                  >
                    {ew.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div className="mb-5">
              {/* Phone Number */}
              <div className="relative mb-4">
                <input
                  type="number"
                  className={clsx(
                    "w-full py-4 px-4 border-2 rounded-xl focus:border-green-600 focus:ring-1 focus:ring-green-100 text-gray-800 transition bg-white peer",
                    "outline-none appearance-none",
                  )}
                  required
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  id="withdraw-phone"
                  placeholder=" "
                />
                <label
                  htmlFor="withdraw-phone"
                  className={clsx(
                    "absolute left-4 top-1 text-xs text-gray-500 z-10 transition-all duration-200 pointer-events-none",
                    phone.length > 0
                      ? "scale-90 -translate-y-3 bg-white px-1"
                      : "top-4 scale-100"
                  )}
                  style={{ background: "white" }}
                >
                  PHONE NUMBER
                </label>
              </div>
              {/* Account Name */}
              <div className="relative">
                <input
                  type="text"
                  className={clsx(
                    "w-full py-4 px-4 border-2 rounded-xl focus:border-green-600 focus:ring-1 focus:ring-green-100 text-gray-800 transition bg-white peer",
                    "outline-none appearance-none",
                  )}
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  id="withdraw-account"
                  placeholder=" "
                />
                <label
                  htmlFor="withdraw-account"
                  className={clsx(
                    "absolute left-4 top-1 text-xs text-gray-500 z-10 transition-all duration-200 pointer-events-none",
                    accountName.length > 0
                      ? "scale-90 -translate-y-3 bg-white px-1"
                      : "top-4 scale-100"
                  )}
                  style={{ background: "white" }}
                >
                  ACCOUNT NAME
                </label>
              </div>
            </div>

            {/* Withdrawal Amount */}
            <div className="mb-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">
                Withdrawal Amount
              </label>
              <div className="relative flex items-center bg-gray-50 rounded-xl border border-gray-200 px-3 py-4 mb-2">
                <span className="font-bold text-green-700 text-lg mr-2">GC</span>
                <input
                  type="number"
                  min={MIN_WITHDRAW}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-2xl font-bold text-gray-900 outline-none px-1"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, "");
                    if (Number(val) > balance) val = String(balance);
                    setAmount(val);
                  }}
                />
                <span className="ml-2 font-medium text-gray-400 text-xs">
                  {formatRupiah(amountNumber * 100)}
                </span>
              </div>
              {/* Quick Select */}
              <div className="flex flex-wrap gap-2 mt-1">
                {[500, 1000, 2000].map((preset) => (
                  <button
                    type="button"
                    tabIndex={0}
                    key={preset}
                    className={clsx(
                      "px-4 py-1 rounded-full border text-sm transition",
                      Number(amount) === preset
                        ? "border-green-600 text-green-700 bg-green-50 font-semibold"
                        : "border-gray-300 text-gray-600 hover:border-green-300"
                    )}
                    onClick={() => setAmount(String(preset))}
                  >
                    {formatGC(preset)} GC
                  </button>
                ))}
                <button
                  type="button"
                  tabIndex={0}
                  className={clsx(
                    "px-4 py-1 rounded-full border text-sm transition",
                    Number(amount) === balance && balance > 0
                      ? "border-green-600 text-green-700 bg-green-50 font-semibold"
                      : "border-gray-300 text-gray-600 hover:border-green-300"
                  )}
                  onClick={handleSelectAllAmount}
                  disabled={balance === 0}
                >
                  All
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-1">
              <button
                type="submit"
                className={clsx(
                  "w-full py-3 rounded-xl font-semibold transition mb-1",
                  canSubmit
                    ? "bg-green-600 hover:bg-green-700 text-white shadow"
                    : "bg-green-200 text-white cursor-not-allowed"
                )}
                disabled={!canSubmit}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
              <button
                type="button"
                className="w-full py-2 text-center text-sm font-semibold text-green-700 hover:underline bg-transparent rounded-xl mt-0.5"
                onClick={() => setIsWithdrawModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History Header */}
      <div className="mb-2 mt-2">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Transaction History
        </h2>
      </div>
      {/* Tabs Navigation */}
      <div className="relative flex flex-row items-end border-b border-gray-200 mb-2 overflow-x-auto">
        <button
          className={clsx(
            "px-4 py-2 font-semibold -mb-[1px] focus:outline-none",
            activeFilter === "all"
              ? "text-green-700 border-b-4 border-green-600"
              : "text-gray-400 hover:text-green-700",
          )}
          onClick={() => setActiveFilter("all")}
        >
          All Transactions
        </button>
        <button
          className={clsx(
            "px-4 py-2 font-semibold -mb-[1px] focus:outline-none",
            activeFilter === "earned"
              ? "text-green-700 border-b-4 border-green-600"
              : "text-gray-400 hover:text-green-700"
          )}
          onClick={() => setActiveFilter("earned")}
        >
          Earned
        </button>
        <button
          className={clsx(
            "px-4 py-2 font-semibold -mb-[1px] focus:outline-none",
            activeFilter === "spent"
              ? "text-green-700 border-b-4 border-green-600"
              : "text-gray-400 hover:text-green-700"
          )}
          onClick={() => setActiveFilter("spent")}
        >
          Spent
        </button>
      </div>

      {/* Transaction List (real) */}
      <div className="bg-white rounded-2xl shadow-sm flex flex-col p-2 mt-6 min-h-[250px]">
        {historyLoading ? (
          <div className="py-10 text-gray-400 text-center">Loading transactions...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-10 text-gray-400 text-center">
            {activeFilter === "all"
              ? "No transactions found."
              : activeFilter === "earned"
              ? "No earned transactions yet."
              : "No spent transactions yet."
            }
          </div>
        ) : (
          filteredHistory.map((tx, idx) => {
            const { displayGC, color, icon } = getTxAmountAndColor(tx);
            return (
              <div
                key={tx.id || idx}
                className={clsx(
                  "flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-3 sm:py-4",
                  idx !== filteredHistory.length - 1 && "border-b border-gray-100"
                )}
              >
                {/* Icon */}
                {getTxIcon(tx)}
                {/* Main info */}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {getTxTitle(tx)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(tx.created_at)}
                  </div>
                </div>
                {/* Amount & Badge */}
                <div className="flex flex-col items-end gap-2">
                  <span className={clsx(color)}>
                    {icon}
                    {displayGC}
                  </span>
                  {getTxBadge(tx)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}