import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Enter a subject").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
