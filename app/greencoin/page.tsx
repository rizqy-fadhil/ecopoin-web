import { ArrowLeftRight, Download, Filter, Recycle, Truck, Wallet2 } from "lucide-react";

export default function GreenCoinPage() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen flex flex-col">
      {/* Total Balance Card */}
      <div className="bg-green-600 rounded-2xl p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
        {/* Left: Icon & Balance */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Wallet2 className="w-8 h-8 text-white/80" />
            <span className="uppercase tracking-wider text-sm font-semibold text-white/80">
              TOTAL BALANCE
            </span>
          </div>
          <div className="text-5xl font-bold mt-2">5,240 <span className="font-light text-3xl align-top">GC</span></div>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 text-xs rounded-full bg-green-800/40 text-white font-semibold mr-2">
              +12% this month
            </span>
            <span className="text-white/90 text-sm">≈ Rp 524.000,00</span>
          </div>
        </div>
        {/* Right: Withdraw Button */}
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center gap-2 bg-green-800 hover:bg-green-900 px-6 py-3 rounded-full text-white font-semibold text-lg shadow transition"
          >
            <ArrowLeftRight className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History Header */}
      <div className="flex justify-between items-center mb-2 mt-2">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Transaction History
        </h2>
        <div className="flex gap-4">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-green-100 text-green-700 transition"
            title="Filter"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-green-100 text-green-700 transition"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative flex flex-row items-end border-b border-gray-200 mb-2">
        <button className="px-4 py-2 font-semibold text-green-700 border-b-4 border-green-600 -mb-[1px] focus:outline-none">
          All Transactions
        </button>
        <button className="px-4 py-2 font-semibold text-gray-400 hover:text-green-700 transition focus:outline-none">
          Earned
        </button>
        <button className="px-4 py-2 font-semibold text-gray-400 hover:text-green-700 transition focus:outline-none">
          Spent
        </button>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm flex flex-col p-2 mt-6">
        {/* EcoDrop Item 1 */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 last:border-0">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <Recycle className="w-7 h-7 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">EcoDrop</div>
            <div className="text-xs text-gray-500 mt-1">June 12, 2024</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-gray-900 font-medium">5.2 kg</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
              Processing
            </span>
          </div>
        </div>

        {/* EcoPick Item */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 last:border-0">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <Truck className="w-7 h-7 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">EcoPick</div>
            <div className="text-xs text-gray-500 mt-1">
              June 10, 2024 &bull; 04:15 PM
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-green-600 font-bold">+ 150 GC</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
              Completed
            </span>
          </div>
        </div>

        {/* Withdraw Item */}
        <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 last:border-0">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
            <Wallet2 className="w-7 h-7 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Withdraw</div>
            <div className="text-xs text-gray-500 mt-1">
              June 08, 2024 &bull; 09:00 AM
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-red-600 font-bold">- 500 GC</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
              Redeemed
            </span>
          </div>
        </div>

        {/* EcoDrop Item 2 */}
        <div className="flex items-center gap-4 px-4 py-4 last:border-0">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <Recycle className="w-7 h-7 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">EcoDrop</div>
            <div className="text-xs text-gray-500 mt-1">
              June 05, 2024 &bull; 11:30 AM
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-green-600 font-bold">+ 80 GC</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
              Completed
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}