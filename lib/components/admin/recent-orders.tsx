"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLE: Record<string, string> = {
  delivered: "bg-green-50 text-green-700 border-green-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const RECENT_ORDERS = [
  { number: "NC-20240717-0001", customer: "Priya Sharma", total: 24999, status: "delivered", date: "Jul 17, 2024" },
  { number: "NC-20240717-0002", customer: "Rahul Gupta", total: 8499, status: "confirmed", date: "Jul 17, 2024" },
  { number: "NC-20240717-0003", customer: "Anjali Singh", total: 134999, status: "processing", date: "Jul 17, 2024" },
  { number: "NC-20240717-0004", customer: "Vikram Patel", total: 3499, status: "pending", date: "Jul 17, 2024" },
  { number: "NC-20240717-0005", customer: "Meera Nair", total: 62999, status: "confirmed", date: "Jul 17, 2024" },
];

export function RecentOrders() {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          <a href="/admin/orders" className="text-xs text-primary hover:underline">View all →</a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground text-xs">Order</th>
                <th className="pb-3 text-left font-medium text-muted-foreground text-xs">Customer</th>
                <th className="pb-3 text-right font-medium text-muted-foreground text-xs">Amount</th>
                <th className="pb-3 text-center font-medium text-muted-foreground text-xs">Status</th>
                <th className="pb-3 text-right font-medium text-muted-foreground text-xs">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.number} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-mono text-xs text-primary">{order.number}</td>
                  <td className="py-3 font-medium">{order.customer}</td>
                  <td className="py-3 text-right font-semibold">₹{order.total.toLocaleString("en-IN")}</td>
                  <td className="py-3 text-center">
                    <Badge className={`text-xs capitalize border ${STATUS_STYLE[order.status] ?? ""}`} variant="outline">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right text-muted-foreground text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
