import { Metadata } from "next";
import Link from "next/link";
import { Package, MapPin, CreditCard, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard | My Account",
};

export default function AccountDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back, John!</h2>
        <p className="text-muted-foreground">
          From your account dashboard, you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Orders Card */}
        <div className="bg-card border rounded-2xl p-6 hover:border-primary transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Orders</h3>
          <p className="text-sm text-muted-foreground mb-4">Track, return, or buy things again.</p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
        </div>

        {/* Addresses Card */}
        <div className="bg-card border rounded-2xl p-6 hover:border-primary transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Addresses</h3>
          <p className="text-sm text-muted-foreground mb-4">Edit addresses for orders and gifts.</p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/account/addresses">Manage Addresses</Link>
          </Button>
        </div>

        {/* Wishlist Card */}
        <div className="bg-card border rounded-2xl p-6 hover:border-primary transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Wishlist</h3>
          <p className="text-sm text-muted-foreground mb-4">View your saved items and favorites.</p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/wishlist">View Wishlist</Link>
          </Button>
        </div>
      </div>
      
      {/* Recent Activity / Quick Look */}
      <div className="border rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-bold mb-4">Recent Order</h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl bg-muted/30">
          <div>
            <p className="font-semibold text-sm">Order #NC-202401-001</p>
            <p className="text-sm text-muted-foreground mt-1">Placed on Jan 1, 2024</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full">
              Delivered
            </span>
            <span className="font-bold">₹159,900</span>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/account/orders/NC-202401-001">View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
