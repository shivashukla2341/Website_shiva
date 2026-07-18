// =============================================================================
// NEXCART — COMPLETE TYPESCRIPT TYPES
// =============================================================================

// ─── Primitives ────────────────────────────────────────────────────────────

export type ID = string;
export type Timestamp = string; // ISO 8601

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "customer" | "seller" | "admin" | "super_admin";

export interface User {
  id: ID;
  email: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Profile {
  id: ID;
  userId: ID;
  firstName: string;
  lastName: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  gstNumber?: string;
  panNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Address {
  id: ID;
  userId: ID;
  label: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Category & Brand ───────────────────────────────────────────────────────

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: ID;
  parent?: Category;
  children?: Category[];
  level: number;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  _count?: { products: number };
}

export interface Brand {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  _count?: { products: number };
}

// ─── Product ────────────────────────────────────────────────────────────────

export type ProductStatus = "draft" | "active" | "inactive" | "archived";

export interface ProductVariant {
  id: ID;
  productId: ID;
  sku: string;
  barcode?: string;
  name: string;
  options: Record<string, string>; // { color: "Red", size: "XL" }
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  weightUnit?: "g" | "kg" | "lb" | "oz";
  imageUrl?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  inventory?: Inventory;
}

export interface ProductImage {
  id: ID;
  productId: ID;
  url: string;
  altText?: string;
  sortOrder: number;
  isDefault: boolean;
}

export interface ProductVideo {
  id: ID;
  productId: ID;
  url: string;
  thumbnailUrl?: string;
  title?: string;
  sortOrder: number;
}

export interface Inventory {
  id: ID;
  variantId: ID;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number; // quantity - reservedQuantity
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  warehouseLocation?: string;
  updatedAt: Timestamp;
}

export interface Product {
  id: ID;
  slug: string;
  sku?: string;
  name: string;
  shortDescription?: string;
  description: string;
  categoryId: ID;
  category?: Category;
  brandId?: ID;
  brand?: Brand;
  tags: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  price: number; // base price (smallest variant)
  compareAtPrice?: number;
  costPrice?: number;
  taxRate: number;
  taxInclusive: boolean;
  weight?: number;
  weightUnit?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "in";
  };
  hasVariants: boolean;
  variants?: ProductVariant[];
  images?: ProductImage[];
  videos?: ProductVideo[];
  averageRating: number;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Virtual fields
  discountPercent?: number;
  isInStock?: boolean;
  isLowStock?: boolean;
}

// ─── Review ─────────────────────────────────────────────────────────────────

export interface Review {
  id: ID;
  productId: ID;
  userId: ID;
  profile?: Pick<Profile, "displayName" | "avatarUrl">;
  orderId?: ID;
  rating: number; // 1-5
  title?: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Question {
  id: ID;
  productId: ID;
  userId: ID;
  profile?: Pick<Profile, "displayName" | "avatarUrl">;
  question: string;
  isAnswered: boolean;
  answers?: Answer[];
  createdAt: Timestamp;
}

export interface Answer {
  id: ID;
  questionId: ID;
  userId: ID;
  profile?: Pick<Profile, "displayName" | "avatarUrl">;
  isSellerResponse: boolean;
  answer: string;
  createdAt: Timestamp;
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface CartItem {
  id: ID;
  cartId: ID;
  productId: ID;
  product?: Product;
  variantId?: ID;
  variant?: ProductVariant;
  quantity: number;
  price: number; // price at time of adding
  addedAt: Timestamp;
}

export interface Cart {
  id: ID;
  userId?: ID;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  couponCode?: string;
  coupon?: Coupon;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Wishlist ───────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: ID;
  userId: ID;
  productId: ID;
  product?: Product;
  addedAt: Timestamp;
}

// ─── Coupon ─────────────────────────────────────────────────────────────────

export type CouponType =
  | "percentage"
  | "fixed_amount"
  | "free_shipping"
  | "buy_x_get_y";

export interface Coupon {
  id: ID;
  code: string;
  description?: string;
  type: CouponType;
  value: number; // percentage or amount
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  usedCount: number;
  categoryIds?: string[];
  productIds?: string[];
  userIds?: string[]; // restrict to specific users
  startsAt: Timestamp;
  expiresAt?: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Order ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
export type PaymentMethod = "razorpay" | "stripe" | "cod" | "wallet" | "upi";

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  product?: Pick<Product, "name" | "slug" | "images">;
  variantId?: ID;
  variant?: Pick<ProductVariant, "name" | "options" | "sku">;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  tax: number;
  discount: number;
  subtotal: number;
  canReturn: boolean;
  canCancel: boolean;
}

export interface OrderTracking {
  id: ID;
  orderId: ID;
  status: OrderStatus;
  title: string;
  description?: string;
  location?: string;
  timestamp: Timestamp;
}

export interface Order {
  id: ID;
  orderNumber: string; // Human-readable: NC-20240101-001
  userId: ID;
  profile?: Pick<Profile, "firstName" | "lastName">;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  shippingAddress: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;
  billingAddress?: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  notes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Timestamp;
  deliveredAt?: Timestamp;
  cancelledAt?: Timestamp;
  cancelReason?: string;
  tracking?: OrderTracking[];
  invoiceUrl?: string;
  gstNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Payment ────────────────────────────────────────────────────────────────

export interface Payment {
  id: ID;
  orderId: ID;
  userId: ID;
  method: PaymentMethod;
  gateway: "razorpay" | "stripe" | "cod";
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Refund & Return ────────────────────────────────────────────────────────

export type ReturnReason =
  | "damaged"
  | "wrong_item"
  | "quality_issue"
  | "not_as_described"
  | "changed_mind"
  | "other";

export interface ReturnRequest {
  id: ID;
  orderId: ID;
  userId: ID;
  items: { orderItemId: ID; quantity: number; reason: ReturnReason }[];
  reason: ReturnReason;
  description?: string;
  images?: string[];
  status: "pending" | "approved" | "rejected" | "picked_up" | "processed";
  refundAmount?: number;
  resolvedAt?: Timestamp;
  createdAt: Timestamp;
}

// ─── Notification ───────────────────────────────────────────────────────────

export type NotificationType =
  | "order_placed"
  | "order_shipped"
  | "order_delivered"
  | "order_cancelled"
  | "payment_success"
  | "payment_failed"
  | "review_reply"
  | "product_back_in_stock"
  | "price_drop"
  | "promotional"
  | "system";

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  body: string;
  imageUrl?: string;
  actionUrl?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp;
}

// ─── Blog ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: ID;
  slug: string;
  title: string;
  excerpt?: string;
  content: string; // HTML/MDX
  coverImageUrl?: string;
  authorId: ID;
  author?: Pick<Profile, "displayName" | "avatarUrl">;
  categoryId?: ID;
  category?: { name: string; slug: string };
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: Timestamp;
  readTimeMinutes: number;
  viewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Support ────────────────────────────────────────────────────────────────

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicket {
  id: ID;
  ticketNumber: string;
  userId: ID;
  orderId?: ID;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: TicketMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TicketMessage {
  id: ID;
  ticketId: ID;
  senderId: ID;
  isAgent: boolean;
  message: string;
  attachments?: string[];
  createdAt: Timestamp;
}

// ─── Offer / Flash Sale ─────────────────────────────────────────────────────

export interface Offer {
  id: ID;
  title: string;
  description?: string;
  bannerUrl?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  startsAt: Timestamp;
  endsAt: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Affiliate ──────────────────────────────────────────────────────────────

export interface Affiliate {
  id: ID;
  userId: ID;
  referralCode: string;
  commissionRate: number; // percentage
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalClicks: number;
  totalConversions: number;
  bankDetails?: Record<string, string>;
  status: "pending" | "approved" | "rejected" | "suspended";
  createdAt: Timestamp;
}

// ─── Search / Filter ────────────────────────────────────────────────────────

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  brandIds?: string[];
  brandSlugs?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  hasDiscount?: boolean;
  sortBy?:
    | "newest"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "popular"
    | "best_seller"
    | "relevance";
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  conversionRate: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  revenueByCategory: { name: string; revenue: number; count: number }[];
  topProducts: { id: string; name: string; revenue: number; sold: number }[];
  paymentMethodBreakdown: { method: string; count: number; amount: number }[];
}

// ─── Settings ───────────────────────────────────────────────────────────────

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  taxRate: number;
  taxInclusive: boolean;
  freeShippingThreshold: number;
  defaultShippingCharge: number;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  maxCartItems: number;
  logoUrl?: string;
  faviconUrl?: string;
  socialLinks: Record<string, string>;
}
