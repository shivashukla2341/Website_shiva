import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
});

export const addressSchema = z.object({
  type: z.enum(["shipping", "billing"]).default("shipping"),
  fullName: z.string().trim().min(2, "Enter a full name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Enter the address"),
  line2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter a city"),
  state: z.string().trim().min(2, "Enter a state"),
  postalCode: z.string().trim().min(3, "Enter a postal code"),
  country: z.string().trim().min(2).default("IN"),
  landmark: z.string().trim().optional().or(z.literal("")),
  isDefault: z.boolean().default(false),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
