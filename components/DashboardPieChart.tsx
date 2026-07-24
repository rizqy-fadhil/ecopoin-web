"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CATEGORIES_COLORS = ["#16a34a", "#ca8a04", "#2563eb", "#dc2626", "#9333ea", "#0891b2"];

function numberFormat(value: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value);
}

export default function DashboardPieChart({ categoriesBreakdown }: { categoriesBreakdown: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <Pie
          data={categoriesBreakdown}
          dataKey="total"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={45}
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
  );
}
