export type NavItem = {
  title: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { title: "Shop", href: "/category/electronics" },
  { title: "Categories", href: "/category" },
  { title: "Brands", href: "/brand" },
  { title: "Offers", href: "/offers" },
  { title: "Blog", href: "/blog" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Blog", href: "/blog" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Sell With Us",
    links: [
      { title: "Become a Seller", href: "/become-seller" },
      { title: "Affiliate Program", href: "/affiliate-program" },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "FAQ", href: "/faq" },
      { title: "Shipping Policy", href: "/shipping-policy" },
      { title: "Refund Policy", href: "/refund-policy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Account",
    links: [
      { title: "My Orders", href: "/account/orders" },
      { title: "Wishlist", href: "/wishlist" },
      { title: "Track Order", href: "/account/orders" },
      { title: "Support Tickets", href: "/account/support" },
    ],
  },
];

export const accountNav: NavItem[] = [
  { title: "Overview", href: "/account" },
  { title: "Profile", href: "/account/profile" },
  { title: "Orders", href: "/account/orders" },
  { title: "Wishlist", href: "/account/wishlist" },
  { title: "Addresses", href: "/account/addresses" },
  { title: "Payments", href: "/account/payments" },
  { title: "Notifications", href: "/account/notifications" },
  { title: "Support", href: "/account/support" },
  { title: "Downloads", href: "/account/downloads" },
  { title: "Settings", href: "/account/settings" },
];

export const adminNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard" },
      { title: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { title: "Products", href: "/admin/products" },
      { title: "Categories", href: "/admin/categories" },
      { title: "Brands", href: "/admin/brands" },
      { title: "Inventory", href: "/admin/inventory" },
    ],
  },
  {
    title: "Sales",
    items: [
      { title: "Orders", href: "/admin/orders" },
      { title: "Customers", href: "/admin/customers" },
      { title: "Coupons", href: "/admin/coupons" },
      { title: "Offers", href: "/admin/offers" },
      { title: "Shipping", href: "/admin/shipping" },
      { title: "Payments", href: "/admin/payments" },
    ],
  },
  {
    title: "People",
    items: [
      { title: "Users", href: "/admin/users" },
      { title: "Roles", href: "/admin/roles" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Blog", href: "/admin/blog" },
      { title: "Pages", href: "/admin/pages" },
      { title: "SEO", href: "/admin/seo" },
      { title: "Email Templates", href: "/admin/email-templates" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Notifications", href: "/admin/notifications" },
      { title: "Logs", href: "/admin/logs" },
      { title: "Settings", href: "/admin/settings" },
    ],
  },
];
