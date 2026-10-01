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
  { name: "Mon", a: 100, b: 60, c: 80 },
  { name: "Tue", a: 180, b: 90, c: 120 },
  { name: "Wed", a: 150, b: 120, c: 100 },
  { name: "Thu", a: 250, b: 80, c: 160 },
  { name: "Fri", a: 200, b: 140, c: 130 },
  { name: "Sat", a: 300, b: 110, c: 190 },
  { name: "Sun", a: 280, b: 160, c: 210 },
];

export function WaveChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="wPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="wPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="wCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
          }}
        />
        <Area type="monotone" dataKey="a" stroke="#8b5cf6" strokeWidth={2} fill="url(#wPurple)" />
        <Area type="monotone" dataKey="b" stroke="#ec4899" strokeWidth={2} fill="url(#wPink)" />
        <Area type="monotone" dataKey="c" stroke="#06b6d4" strokeWidth={2} fill="url(#wCyan)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
