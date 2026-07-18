"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TOP_PRODUCTS = [
  { name: "Sony WH-1000XM5", revenue: 124750, sold: 50, trend: "+12%" },
  { name: "iPhone 15 Pro Max", revenue: 539996, sold: 4, trend: "+5%" },
  { name: "MacBook Pro M3", revenue: 399998, sold: 2, trend: "+3%" },
  { name: "Nike Air Max 270", revenue: 64995, sold: 5, trend: "+18%" },
  { name: "AirPods Pro 2", revenue: 99996, sold: 4, trend: "+7%" },
];

export function TopProducts() {
  return (
    <Card className="border-0 shadow-card h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.sold} sold · ₹{p.revenue.toLocaleString("en-IN")}</p>
              </div>
              <Badge variant="secondary" className="text-green-600 bg-green-50 text-xs shrink-0">
                {p.trend}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
