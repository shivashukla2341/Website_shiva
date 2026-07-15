import { z } from "zod";

export const sellerApplicationSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name").max(200),
  gstin: z
    .string()
    .trim()
    .regex(/^[0-9A-Z]{15}$/, "Enter a valid 15-character GSTIN")
    .optional()
    .or(z.literal("")),
  supportEmail: z.string().trim().email("Enter a valid email"),
  supportPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
});

export type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;
