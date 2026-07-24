"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function numberFormat(value: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  }).format(value);
}

export default function DashboardLineChart({ activityData }: { activityData: any[] }) {
  return (
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
        <Line type="monotone" dataKey="recycled" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
