import { apiError, apiSuccess, apiValidationError } from "@/lib/api/response";
import { contactSchema } from "@/lib/validations/contact";

// TODO(Step: Emails): wire this up to Resend once src/lib/email is built —
// for now it validates and acknowledges the request so the contact form is
// fully functional end-to-end from the UI's perspective.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return apiValidationError(parsed.error);

  try {
    console.info("contact form submission", parsed.data);
    return apiSuccess({ received: true });
  } catch (error) {
    console.error("contact submission failed", error);
    return apiError("Could not send your message. Please try again.", 500);
  }
}
