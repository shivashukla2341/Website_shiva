import { Metadata } from "next";
import { Search, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Manage Orders | Admin",
};

const MOCK_ORDERS = [
  { id: "NC-202401-089", customer: "Rahul Sharma", date: "Jan 1, 2024", total: "₹159,900", items: 1, status: "Processing", payment: "Paid (Card)" },
  { id: "NC-202401-088", customer: "Priya Singh", date: "Jan 1, 2024", total: "₹45,000", items: 2, status: "Shipped", payment: "Paid (UPI)" },
  { id: "NC-202401-087", customer: "Amit Patel", date: "Dec 31, 2023", total: "₹2,500", items: 1, status: "Delivered", payment: "COD" },
  { id: "NC-202401-086", customer: "Sneha Reddy", date: "Dec 30, 2023", total: "₹12,400", items: 3, status: "Cancelled", payment: "Refunded" },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and fulfill customer orders.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by order ID or customer name..." className="pl-9 bg-background" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="bg-background gap-2"><Filter className="w-4 h-4" /> Filter Status</Button>
            <Button variant="outline" size="sm" className="bg-background">Export CSV</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{order.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-medium">{order.customer}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold">{order.payment}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{order.total} <span className="text-xs font-normal text-muted-foreground">({order.items} items)</span></td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="font-semibold text-primary">
                      <Eye className="w-4 h-4 mr-1.5" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <div>Showing 1 to 4 of 845 orders</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
