"use client";

import React from "react";
import {
  Users,
  Truck,
  Leaf,
  CircleDollarSign,
  Eye,
  Check,
} from "lucide-react";
import clsx from "clsx";

// Helper for today (Indonesian date)
function formatDateID(date: Date) {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const summary = [
  {
    label: "Total Users",
    value: "1,240",
    icon: <Users className="w-7 h-7 text-blue-500 bg-blue-50 rounded-full p-1.5" />,
  },
  {
    label: "Total EcoPick Requests",
    value: "45 Pending",
    icon: <Truck className="w-7 h-7 text-amber-500 bg-amber-50 rounded-full p-1.5" />,
  },
  {
    label: "Total Waste Collected",
    value: "250 Kg",
    icon: <Leaf className="w-7 h-7 text-green-600 bg-green-50 rounded-full p-1.5" />,
  },
  {
    label: "GreenCoin Issued",
    value: "50,000 GC",
    icon: <CircleDollarSign className="w-7 h-7 text-green-500 bg-green-100 rounded-full p-1.5" />,
  },
];

const requests = [
  {
    id: "REQ-00123",
    user: "Andi Wijaya",
    address: "Jl. Diponegoro 12, Surabaya",
    status: "Pending",
  },
  {
    id: "REQ-00124",
    user: "Dewi Kusuma",
    address: "Jl. Pemuda 88, Surabaya",
    status: "Completed",
  },
  {
    id: "REQ-00125",
    user: "Budi Santoso",
    address: "Jl. Pucang Anom 5, Surabaya",
    status: "Pending",
  },
];

// Badge component
function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block",
        status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : status === "Completed"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const today = formatDateID(new Date());

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">Admin Overview</h1>
          <div className="text-gray-500 text-sm">{today}</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {summary.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl shadow-sm flex items-center gap-4 px-6 py-6"
          >
            <div>{s.icon}</div>
            <div>
              <div className="text-gray-600 text-sm font-medium">{s.label}</div>
              <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm px-6 py-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent EcoPick Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-xs uppercase text-gray-600 bg-gray-50 border-b">
                <th className="py-3 px-4 text-left font-semibold">Request ID</th>
                <th className="py-3 px-4 text-left font-semibold">User</th>
                <th className="py-3 px-4 text-left font-semibold">Alamat</th>
                <th className="py-3 px-4 text-left font-semibold">Status</th>
                <th className="py-3 px-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-[15px] text-blue-700">{r.id}</td>
                  <td className="py-3 px-4">{r.user}</td>
                  <td className="py-3 px-4">{r.address}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg font-semibold gap-1 transition"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    {r.status === "Pending" && (
                      <button
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-semibold gap-1 transition"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}