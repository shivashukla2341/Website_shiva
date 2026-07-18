import { Metadata } from "next";
import Link from "next/link";
import { User, Package, MapPin, Settings, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My Account | NexCart",
  description: "Manage your account settings, orders, and addresses.",
};

const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/account", icon: User },
  { name: "My Orders", href: "/account/orders", icon: Package },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Notifications", href: "/account/notifications", icon: Bell },
  { name: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </nav>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
