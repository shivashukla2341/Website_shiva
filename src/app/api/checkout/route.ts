import { apiError, apiSuccess, apiValidationError } from "@/lib/api/response";
import { getCurrentUser } from "@/lib/security/authorize";
import { CheckoutError, createOrderFromCheckout } from "@/lib/orders/create-order";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("You must be signed in to check out", 401);

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return apiValidationError(parsed.error);

  try {
    const order = await createOrderFromCheckout(user.id, parsed.data);
    return apiSuccess({ orderId: order.id, orderNumber: order.order_number }, 201);
  } catch (error) {
    if (error instanceof CheckoutError) return apiError(error.message, 422);
    console.error("checkout failed", error);
    return apiError("Something went wrong placing your order", 500);
  }
}
