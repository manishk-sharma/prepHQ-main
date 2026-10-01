import { type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "purple" | "pink" | "blue";
}

const glowMap = {
  purple: "neon-glow-purple",
  pink: "neon-glow-pink",
  blue: "neon-glow-blue",
};

const accentMap = {
  purple: "text-neon-purple",
  pink: "text-neon-pink",
  blue: "text-neon-blue",
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "purple",
}: MetricCardProps) {
  return (
    <div
      className={`glass rounded p-3 hover-lift cursor-pointer ${glowMap[variant]}`}
    >
      <div className="d-flex justify-content-between align-items-start">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-muted small text-uppercase mb-1" style={{ letterSpacing: "1px" }}>
            {title}
          </p>

          <h4 className={`fw-bold mb-1 ${accentMap[variant]}`}>
            {value}
          </h4>

          {subtitle && (
            <p className="text-muted small mb-1">{subtitle}</p>
          )}

          {trend && (
            <p
              className={`small fw-semibold mb-0 ${
                trend.positive ? "text-success" : "text-danger"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>

        {/* RIGHT ICON */}
        {Icon && (
          <div className="icon-box d-flex align-items-center justify-content-center">
            <Icon className={`${accentMap[variant]}`} size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
