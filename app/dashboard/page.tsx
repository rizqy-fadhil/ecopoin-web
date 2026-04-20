  "use client";

  import {
    PiggyBank,
    Recycle,
    ScrollText,
    Leaf,
    TrendingUp,
    ShoppingCart,
    ArrowDownCircle,
  } from "lucide-react";
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";

  // Dummy data
  const summaryData = [
    {
      key: "greencoin",
      label: "GreenCoin Balance",
      value: "1,250 GC",
      icon: <PiggyBank className="text-green-700" size={28} />,
      bg: "bg-green-100",
    },
    {
      key: "waste",
      label: "Total Waste Recycled",
      value: "85.5 kg",
      icon: <Recycle className="text-blue-700" size={28} />,
      bg: "bg-blue-100",
    },
    {
      key: "transactions",
      label: "Total Transactions",
      value: "12",
      icon: <ScrollText className="text-purple-600" size={28} />,
      bg: "bg-purple-100",
    },
    {
      key: "co2",
      label: "CO2 Saved",
      value: "42 kg",
      icon: <Leaf className="text-orange-700" size={28} />,
      bg: "bg-orange-100",
    },
  ];

  const activityData = [
    { month: "Jan", recycled: 10 },
    { month: "Feb", recycled: 18 },
    { month: "Mar", recycled: 32 },
    { month: "Apr", recycled: 25 },
    { month: "May", recycled: 40 },
    { month: "Jun", recycled: 35 },
  ];

  const recentTransactions = [
    {
      type: "EcoDrop",
      icon: <TrendingUp className="text-green-700" size={20} />,
      date: "12 Jun 2024",
      value: "+150 GC",
      status: "Processing",
      badge: "bg-blue-100 text-blue-700",
    },
    {
      type: "EcoPick",
      icon: <ShoppingCart className="text-blue-600" size={20} />,
      date: "11 Jun 2024",
      value: "+5.2 kg",
      status: "Completed",
      badge: "bg-green-100 text-green-700",
    },
    {
      type: "Withdraw",
      icon: <ArrowDownCircle className="text-gray-500" size={20} />,
      date: "10 Jun 2024",
      value: "-700 GC",
      status: "Redeemed",
      badge: "bg-gray-100 text-gray-700",
    },
    {
      type: "EcoDrop",
      icon: <TrendingUp className="text-green-700" size={20} />,
      date: "08 Jun 2024",
      value: "+120 GC",
      status: "Completed",
      badge: "bg-green-100 text-green-700",
    },
  ];

  const categoriesData = [
    { category: "Plastic", value: 28 },
    { category: "Paper", value: 18 },
    { category: "Metal", value: 10 },
    { category: "Glass", value: 15 },
    { category: "Organic", value: 25 },
  ];

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

  function StatusBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
      <span className={`px-2 py-0.5 text-xs rounded font-medium ${className}`}>
        {children}
      </span>
    );
  }

  export default function Dashboard() {
    return (
      <main className="p-6 bg-gray-50/50 min-h-screen flex flex-col gap-6">
        {/* Baris 1: Summary Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {summaryData.map(({ key, ...card }) => (
              <SummaryCard key={key} {...card} />
            ))}
          </div>
        </section>

        {/* Baris 2: Activity Chart & Recent Transactions */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Recycling Activity */}
            <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800 text-lg">Recycling Activity</span>
              </div>
              <div className="w-full h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px' }}
                      labelStyle={{ fontWeight: 500 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="recycled"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Recent Transactions */}
            <div className="col-span-1 bg-white rounded-xl shadow-sm p-5 flex flex-col">
              <div className="font-semibold text-gray-800 text-lg mb-3">
                Recent Transactions
              </div>
              <ul className="flex-1 space-y-4">
                {recentTransactions.map((tx, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                      {tx.icon}
                    </span>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="font-medium text-gray-700 truncate">{tx.type}</div>
                      <div className="text-xs text-gray-400">{tx.date}</div>
                    </div>
                    <span className="font-semibold text-sm text-green-700 mr-2">
                      {tx.value}
                    </span>
                    <StatusBadge className={tx.badge}>{tx.status}</StatusBadge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Baris 3: Waste Categories */}
        <section>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800 text-lg">
                Waste Categories
              </span>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoriesData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px' }}
                    labelStyle={{ fontWeight: 500 }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    fill="#22c55e"
                    label={{ position: 'top', fontSize: 12, fill: '#166534' }}
                  >
                    {/* Bar chart can be customized for color gradient if needed */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    );
  }