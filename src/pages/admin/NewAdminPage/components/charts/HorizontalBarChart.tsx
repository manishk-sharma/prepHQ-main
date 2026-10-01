import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Product A", value: 4560 },
  { name: "Product B", value: 3790 },
  { name: "Product C", value: 2890 },
  { name: "Product D", value: 2305 },
];

export function HorizontalBarChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} layout="vertical" barSize={14}>
        <XAxis type="number" tick={{ fill: "#c084fc", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fill: "#c084fc", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(42, 27, 74, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "#fff",
          }}
        />
        <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 6, 6, 0]}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
