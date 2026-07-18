import { Metadata } from "next";
import { Search, Mail, Ban, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Manage Customers | Admin",
};

const MOCK_CUSTOMERS = [
  { id: "usr_1", name: "Rahul Sharma", email: "rahul@example.com", joined: "Oct 2023", orders: 12, spent: "₹245,000", status: "Active" },
  { id: "usr_2", name: "Priya Singh", email: "priya@example.com", joined: "Nov 2023", orders: 3, spent: "₹45,000", status: "Active" },
  { id: "usr_3", name: "Amit Patel", email: "amit@example.com", joined: "Dec 2023", orders: 1, spent: "₹2,500", status: "Active" },
  { id: "usr_4", name: "Sneha Reddy", email: "sneha@example.com", joined: "Jan 2024", orders: 0, spent: "₹0", status: "Active" },
  { id: "usr_5", name: "Bad User", email: "scammer@example.com", joined: "Jan 2024", orders: 0, spent: "₹0", status: "Banned" },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">View and manage your user base.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search customers by name or email..." className="pl-9 bg-background" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="bg-background">Export CSV</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                  <td className="px-6 py-4">{customer.joined}</td>
                  <td className="px-6 py-4 font-medium">{customer.orders}</td>
                  <td className="px-6 py-4 font-bold">{customer.spent}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
