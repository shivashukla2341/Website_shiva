import { Metadata } from "next";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard Overview | Admin",
};

const STATS = [
  {
    title: "Total Revenue",
    value: "₹1,245,600",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign
  },
  {
    title: "Total Orders",
    value: "845",
    change: "+5.2%",
    trend: "up",
    icon: ShoppingBag
  },
  {
    title: "Active Customers",
    value: "1,204",
    change: "-2.1%",
    trend: "down",
    icon: Users
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+1.1%",
    trend: "up",
    icon: TrendingUp
  }
];

const RECENT_ORDERS = [
  { id: "NC-202401-089", customer: "Rahul Sharma", total: "₹159,900", status: "Processing", date: "Just now" },
  { id: "NC-202401-088", customer: "Priya Singh", total: "₹45,000", status: "Shipped", date: "2 hours ago" },
  { id: "NC-202401-087", customer: "Amit Patel", total: "₹2,500", status: "Delivered", date: "5 hours ago" },
  { id: "NC-202401-086", customer: "Sneha Reddy", total: "₹12,400", status: "Processing", date: "Yesterday" },
  { id: "NC-202401-085", customer: "Vikram Malhotra", total: "₹89,900", status: "Delivered", date: "Yesterday" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening with your store today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-card border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-muted-foreground">{stat.title}</h3>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-card border rounded-2xl p-6 flex flex-col h-[400px]">
          <h3 className="font-bold text-lg mb-6">Revenue Overview</h3>
          <div className="flex-1 bg-muted/30 rounded-xl border border-dashed flex items-center justify-center">
            <span className="text-muted-foreground font-medium flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Chart Component goes here (Recharts)
            </span>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <Button variant="link" className="text-primary px-0">View All</Button>
          </div>
          
          <div className="space-y-5">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{order.customer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.id} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{order.total}</p>
                  <span className={`inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
