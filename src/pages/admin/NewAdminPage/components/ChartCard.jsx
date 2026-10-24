import React from "react";

export function ChartCard({ title, subtitle, children, className = "" }) {
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

export default ChartCard;
