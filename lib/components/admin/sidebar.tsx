"use client";

// =============================================================================
// NEXCART — ADMIN SIDEBAR
// =============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Users, Package, Tag, Percent,
  BarChart3, Settings, Bell, FileText, Mail, ChevronLeft,
  ChevronRight, Truck, CreditCard, HelpCircle, Image, Star,
  Building2, Globe, Shield, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Orders", icon: ShoppingBag, href: "/admin/orders", badge: "12" },
      { label: "Products", icon: Package, href: "/admin/products" },
      { label: "Inventory", icon: Layers, href: "/admin/inventory" },
      { label: "Categories", icon: Layers, href: "/admin/categories" },
      { label: "Brands", icon: Building2, href: "/admin/brands" },
      { label: "Coupons", icon: Tag, href: "/admin/coupons" },
      { label: "Offers", icon: Percent, href: "/admin/offers" },
    ],
  },
  {
    label: "Customers",
    items: [
      { label: "Customers", icon: Users, href: "/admin/customers" },
      { label: "Reviews", icon: Star, href: "/admin/reviews", badge: "3" },
      { label: "Support", icon: HelpCircle, href: "/admin/support", badge: "5" },
    ],
  },
  {
    label: "Payments",
    items: [
      { label: "Payments", icon: CreditCard, href: "/admin/payments" },
      { label: "Refunds", icon: Truck, href: "/admin/refunds" },
      { label: "Shipping", icon: Truck, href: "/admin/shipping" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog", icon: FileText, href: "/admin/blog" },
      { label: "Pages", icon: Globe, href: "/admin/pages" },
      { label: "Banners", icon: Image, href: "/admin/banners" },
      { label: "Email Templates", icon: Mail, href: "/admin/email-templates" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users & Roles", icon: Shield, href: "/admin/users" },
      { label: "Notifications", icon: Bell, href: "/admin/notifications" },
      { label: "Settings", icon: Settings, href: "/admin/settings" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-bg text-white font-black text-sm">
          N
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold gradient-text">NexCart</p>
            <p className="text-[10px] text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <div className="space-y-4 px-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "admin-sidebar-link",
                        isActive && "active",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="h-5 min-w-5 text-xs px-1.5">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center h-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
