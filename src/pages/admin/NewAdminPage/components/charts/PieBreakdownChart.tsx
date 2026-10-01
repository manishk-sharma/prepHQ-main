import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 25 },
  { name: "Referral", value: 20 },
  { name: "Social", value: 20 },
];

const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"];

export function PieBreakdownChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Tooltip
          contentStyle={{
            background: "rgba(42, 27, 74, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "#fff",
          }}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
