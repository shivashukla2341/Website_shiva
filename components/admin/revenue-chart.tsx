"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_DATA = [
  { date: "Jun 18", revenue: 42000, orders: 89 },
  { date: "Jun 19", revenue: 58000, orders: 124 },
  { date: "Jun 20", revenue: 38000, orders: 78 },
  { date: "Jun 21", revenue: 71000, orders: 156 },
  { date: "Jun 22", revenue: 55000, orders: 112 },
  { date: "Jun 23", revenue: 63000, orders: 134 },
  { date: "Jun 24", revenue: 82000, orders: 178 },
  { date: "Jun 25", revenue: 47000, orders: 96 },
  { date: "Jun 26", revenue: 91000, orders: 201 },
  { date: "Jun 27", revenue: 68000, orders: 148 },
  { date: "Jun 28", revenue: 74000, orders: 162 },
  { date: "Jun 29", revenue: 56000, orders: 119 },
  { date: "Jun 30", revenue: 88000, orders: 193 },
  { date: "Jul 1", revenue: 95000, orders: 210 },
];

export function RevenueChart() {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-primary" />Revenue</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MOCK_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(252,75%,58%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(252,75%,58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(252,75%,58%)" strokeWidth={2} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
