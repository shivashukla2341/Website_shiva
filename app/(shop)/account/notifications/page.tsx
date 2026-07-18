import { Metadata } from "next";
import { Bell, Package, Tag, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Notifications | My Account",
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Order Delivered",
    message: "Your order #NC-202401-001 has been delivered successfully.",
    time: "2 hours ago",
    type: "order",
    read: false,
  },
  {
    id: 2,
    title: "Flash Sale Alert",
    message: "The 24-hour electronics flash sale starts in 1 hour! Don't miss out.",
    time: "1 day ago",
    type: "promo",
    read: true,
  },
  {
    id: 3,
    title: "Payment Successful",
    message: "We've received your payment of ₹159,900 for order #NC-202401-001.",
    time: "3 days ago",
    type: "payment",
    read: true,
  }
];

const getIcon = (type: string) => {
  switch(type) {
    case 'order': return <Package className="w-5 h-5 text-blue-500" />;
    case 'promo': return <Tag className="w-5 h-5 text-yellow-500" />;
    case 'payment': return <CreditCard className="w-5 h-5 text-green-500" />;
    default: return <Bell className="w-5 h-5 text-primary" />;
  }
};

export default function NotificationsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Notifications</h2>
        <p className="text-muted-foreground">
          Manage your notification preferences and view recent alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Recent Alerts</h3>
            <button className="text-sm font-medium text-primary hover:underline">Mark all as read</button>
          </div>
          
          <div className="bg-card border rounded-2xl overflow-hidden divide-y">
            {MOCK_NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className={`p-4 sm:p-6 flex gap-4 transition-colors hover:bg-muted/30 ${!notif.read ? 'bg-primary/5' : ''}`}>
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-sm ${!notif.read ? 'font-bold' : 'font-semibold'}`}>{notif.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-card border rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-6">Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Updates</Label>
                  <p className="text-xs text-muted-foreground">Shipping and delivery alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Promotions</Label>
                  <p className="text-xs text-muted-foreground">Sales, discounts, and offers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Newsletters</Label>
                  <p className="text-xs text-muted-foreground">Weekly curated products</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive texts for deliveries</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
