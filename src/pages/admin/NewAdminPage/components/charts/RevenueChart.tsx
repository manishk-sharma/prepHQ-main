import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", revenue: 2400, profit: 1800 },
  { name: "Feb", revenue: 1398, profit: 1200 },
  { name: "Mar", revenue: 3800, profit: 2900 },
  { name: "Apr", revenue: 3908, profit: 2800 },
  { name: "May", revenue: 4800, profit: 3200 },
  { name: "Jun", revenue: 3800, profit: 2600 },
  { name: "Jul", revenue: 4300, profit: 3100 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: "#c084fc", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#c084fc", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "rgba(42, 27, 74, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "#fff",
            backdropFilter: "blur(10px)",
          }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradPurple)" />
        <Area type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={2} fill="url(#gradPink)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
