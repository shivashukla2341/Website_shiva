// =============================================================================
// NEXCART — ZOD VALIDATION SCHEMAS
// =============================================================================

import { z } from "zod";

// ─── Common ─────────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const idSchema = z.string().uuid("Invalid ID format");

// ─── Auth Schemas ────────────────────────────────────────────────────────────

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms and conditions" }),
    } as any),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Profile Schemas ─────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2).max(50).regex(/^[a-zA-Z\s]+$/),
  lastName: z.string().min(2).max(50).regex(/^[a-zA-Z\s]+$/),
  displayName: z.string().min(2).max(50).optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  dateOfBirth: z.string().date().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number"
    )
    .optional()
    .or(z.literal("")),
});

// ─── Address Schemas ─────────────────────────────────────────────────────────

export const addressSchema = z.object({
  label: z.enum(["home", "work", "other"]).default("home"),
  firstName: z.string().min(2, "First name required").max(50),
  lastName: z.string().min(2, "Last name required").max(50),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  addressLine1: z.string().min(5, "Address required").max(200),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  landmark: z.string().max(100).optional().or(z.literal("")),
  city: z.string().min(2, "City required").max(100),
  state: z.string().min(2, "State required").max(100),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

// ─── Product Schemas ─────────────────────────────────────────────────────────

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU required").max(100),
  barcode: z.string().max(100).optional().or(z.literal("")),
  name: z.string().min(1, "Variant name required").max(200),
  options: z.record(z.string(), z.string()),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional(),
  costPrice: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  weightUnit: z.enum(["g", "kg", "lb", "oz"]).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  trackInventory: z.boolean().default(true),
  quantity: z.coerce.number().int().min(0).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  allowBackorder: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name required").max(500),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  description: z.string().min(10, "Description required"),
  categoryId: z.string().uuid("Invalid category"),
  brandId: z.string().uuid("Invalid brand").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "active", "inactive", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  taxRate: z.coerce.number().min(0).max(100).default(18),
  taxInclusive: z.boolean().default(false),
  weight: z.coerce.number().positive().optional(),
  weightUnit: z.enum(["g", "kg", "lb", "oz"]).optional(),
  hasVariants: z.boolean().default(false),
  variants: z.array(productVariantSchema).min(1, "At least one variant required"),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  metaKeywords: z.array(z.string()).default([]),
});

// ─── Review Schemas ──────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1, "Rating required").max(5),
  title: z.string().max(200).optional().or(z.literal("")),
  body: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

export const questionSchema = z.object({
  productId: z.string().uuid(),
  question: z.string().min(10, "Question must be at least 10 characters").max(500),
});

export const answerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.string().min(5, "Answer must be at least 5 characters").max(1000),
});

// ─── Order Schemas ───────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  shippingAddressId: z.string().uuid("Please select a delivery address"),
  billingAddressId: z.string().uuid().optional(),
  useSameForBilling: z.boolean().default(true),
  paymentMethod: z.enum(["razorpay", "stripe", "cod"]),
  couponCode: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    )
    .optional()
    .or(z.literal("")),
});

// ─── Coupon Schemas ──────────────────────────────────────────────────────────

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30, "Coupon code must be less than 30 characters")
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Coupon code can only contain letters, numbers, hyphens, and underscores"),
  description: z.string().max(500).optional(),
  type: z.enum(["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"]),
  value: z.coerce.number().positive("Discount value must be positive"),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscountAmount: z.coerce.number().positive().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  usageLimitPerUser: z.coerce.number().int().positive().optional(),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  categoryIds: z.array(z.string().uuid()).optional(),
  productIds: z.array(z.string().uuid()).optional(),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, "Please enter a coupon code").toUpperCase(),
});

// ─── Contact Schemas ─────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, "Name required").max(100),
  email: z.string().email("Valid email required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Valid phone required")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(5, "Subject required").max(200),
  message: z.string().min(20, "Message must be at least 20 characters").max(2000),
  category: z
    .enum(["general", "order", "product", "payment", "return", "technical", "other"])
    .default("general"),
});

// ─── Newsletter Schema ───────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.string().email("Valid email required").toLowerCase().trim(),
  name: z.string().max(100).optional(),
});

// ─── Support Ticket Schema ───────────────────────────────────────────────────

export const supportTicketSchema = z.object({
  orderId: z.string().uuid().optional().or(z.literal("")),
  subject: z.string().min(5, "Subject required").max(200),
  message: z.string().min(20, "Message required").max(2000),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

// ─── Blog Schemas ────────────────────────────────────────────────────────────

export const blogPostSchema = z.object({
  title: z.string().min(5, "Title required").max(300),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(50, "Content required"),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  publishedAt: z.string().datetime().optional(),
});

// ─── Return Request Schema ───────────────────────────────────────────────────

export const returnRequestSchema = z.object({
  orderId: z.string().uuid(),
  items: z.array(
    z.object({
      orderItemId: z.string().uuid(),
      quantity: z.number().int().positive(),
      reason: z.enum([
        "damaged",
        "wrong_item",
        "quality_issue",
        "not_as_described",
        "changed_mind",
        "other",
      ]),
    })
  ).min(1, "Select at least one item to return"),
  reason: z.enum([
    "damaged",
    "wrong_item",
    "quality_issue",
    "not_as_described",
    "changed_mind",
    "other",
  ]),
  description: z.string().max(1000).optional(),
});

// ─── Category Schema ─────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, "Category name required").max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().uuid().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

// ─── Brand Schema ────────────────────────────────────────────────────────────

export const brandSchema = z.object({
  name: z.string().min(2, "Brand name required").max(100),
  description: z.string().max(500).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

// ─── Type Inference ──────────────────────────────────────────────────────────

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type SupportTicketInput = z.infer<typeof supportTicketSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ReturnRequestInput = z.infer<typeof returnRequestSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
