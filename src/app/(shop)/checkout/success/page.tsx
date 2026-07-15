import { Suspense } from "react";

import { OrderSuccess } from "@/components/checkout/order-success";

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <OrderSuccess />
    </Suspense>
  );
}
