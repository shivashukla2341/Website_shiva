import { Metadata } from "next";
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Manage Coupons | Admin",
};

const MOCK_COUPONS = [
  { id: "1", code: "SUMMER20", discount: "20%", type: "Percentage", uses: 45, maxUses: 100, expiry: "2024-08-31", status: "Active" },
  { id: "2", code: "WELCOME500", discount: "₹500", type: "Fixed Amount", uses: 120, maxUses: "Unlimited", expiry: "2024-12-31", status: "Active" },
  { id: "3", code: "FLASH50", discount: "50%", type: "Percentage", uses: 50, maxUses: 50, expiry: "2023-11-30", status: "Expired" },
  { id: "4", code: "FREESHIP", discount: "Free Shipping", type: "Shipping", uses: 12, maxUses: 500, expiry: "2024-06-30", status: "Active" },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons & Offers</h1>
          <p className="text-muted-foreground mt-1">Create and manage discount codes.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/20">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search coupons by code..." className="pl-9 bg-background" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_COUPONS.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" /> {coupon.code}
                  </td>
                  <td className="px-6 py-4 font-bold">{coupon.discount}</td>
                  <td className="px-6 py-4">{coupon.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{coupon.uses} / {coupon.maxUses}</td>
                  <td className="px-6 py-4">{coupon.expiry}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      coupon.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
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
