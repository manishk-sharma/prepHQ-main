import { AreaChart, Area, ResponsiveContainer } from "recharts";

const sparkData = [
  [40, 30, 50, 45, 60, 55, 70],
  [20, 35, 25, 40, 30, 50, 45],
  [60, 50, 55, 40, 65, 55, 75],
];

const colors = ["#8b5cf6", "#ec4899", "#3b82f6"];

interface Props {
  index?: number;
}

export function Sparkline({ index = 0 }: Props) {
  const d = sparkData[index % sparkData.length].map((v, i) => ({ v, i }));
  const color = colors[index % colors.length];
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={d}>
        <defs>
          <linearGradient id={`sp-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sp-${index})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
