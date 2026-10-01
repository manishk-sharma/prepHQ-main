interface ProgressRingProps {
  value: number;
  label: string;
  color?: string;
  size?: number;
}

export function ProgressRing({ value, label, color = "#8b5cf6", size = 64 }: ProgressRingProps) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <span className="text-foreground font-display font-bold text-sm">{value}%</span>
      <span className="text-muted-foreground text-[10px]">{label}</span>
    </div>
  );
}
