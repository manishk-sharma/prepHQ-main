import { type ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, className = "" }: ChartCardProps) {
  return (
    <div className={`glass rounded-xl p-5 hover-lift ${className}`}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-foreground text-sm">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground text-xs mt-0.5">{subtitle}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
