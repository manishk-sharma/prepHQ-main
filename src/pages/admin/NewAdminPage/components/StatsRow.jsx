import React from "react";
import { DollarSign, Users, TrendingUp, ShoppingCart } from "lucide-react";
import { Sparkline } from "./charts/SparklineSet";
import { MetricCard } from "./MetricCard";

const stats = [
  { title: "Revenue", value: "$4,560", icon: DollarSign, variant: "purple", trend: { value: "12.5%", positive: true } },
  { title: "Users", value: "3,457", icon: Users, variant: "blue", trend: { value: "8.2%", positive: true } },
  { title: "Growth", value: "+23%", icon: TrendingUp, variant: "pink", trend: { value: "3.1%", positive: true } },
  { title: "Orders", value: "2,890", icon: ShoppingCart, variant: "purple", trend: { value: "5.4%", positive: false } },
];

export function StatsRow() {
  return (
    <div className="row g-3">
      {stats.map((s, i) => (
        <div key={s.title} className="col-12 col-sm-6 col-lg-3">
          <div className="d-flex flex-column gap-2">
            <MetricCard {...s} />

            <div className="glass rounded px-3 py-2">
              <Sparkline index={i} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;
