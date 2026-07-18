import { Metadata } from "next";
import Link from "next/link";
import { Package, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My Orders | My Account",
};

const MOCK_ORDERS = [
  {
    id: "ord-1",
    orderNumber: "NC-202401-001",
    date: "Jan 1, 2024",
    total: 159900,
    status: "Delivered",
    itemsCount: 1,
  },
  {
    id: "ord-2",
    orderNumber: "NC-202312-045",
    date: "Dec 15, 2023",
    total: 34500,
    status: "Shipped",
    itemsCount: 2,
  },
  {
    id: "ord-3",
    orderNumber: "NC-202311-089",
    date: "Nov 10, 2023",
    total: 4500,
    status: "Cancelled",
    itemsCount: 1,
  }
];

const getStatusColor = (status: string) => {
  switch(status.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">My Orders</h2>
        <p className="text-muted-foreground">
          View your order history and track recent purchases.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="border rounded-2xl p-6 bg-card hover:border-primary/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b">
              <div>
                <p className="text-sm font-semibold mb-1">Order {order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">Placed on {order.date}</p>
              </div>
              <div className="flex flex-col md:items-end gap-2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full w-fit ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{order.itemsCount} {order.itemsCount === 1 ? 'Item' : 'Items'}</p>
                  <p className="text-sm font-bold mt-1">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/orders/${order.orderNumber}`}>
                    View Details
                  </Link>
                </Button>
                {order.status === 'Delivered' && (
                  <Button variant="secondary" size="sm">
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
