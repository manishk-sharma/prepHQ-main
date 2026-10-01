import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", sales: 120, returns: 30 },
  { name: "Tue", sales: 200, returns: 50 },
  { name: "Wed", sales: 150, returns: 20 },
  { name: "Thu", sales: 280, returns: 45 },
  { name: "Fri", sales: 190, returns: 35 },
  { name: "Sat", sales: 230, returns: 55 },
  { name: "Sun", sales: 170, returns: 25 },
];

export function BarComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: "#c084fc", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#c084fc", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "rgba(42, 27, 74, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "#fff",
          }}
        />
        <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="returns" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
