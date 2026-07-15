import { z } from "zod";

export const checkoutSchema = z.object({
  addressId: z.string().uuid("Select a valid delivery address"),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
  couponCode: z.string().trim().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
