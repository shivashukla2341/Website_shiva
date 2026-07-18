// =============================================================================
// NEXCART — SHOP LAYOUT (Header + Footer)
// =============================================================================

import { Navbar } from "@/components/shop/navbar";
import { Footer } from "@/components/shop/footer";
import { CartSidebar } from "@/components/shop/cart-sidebar";
import { AIChatSupport } from "@/components/shop/ai-chat-support";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar />
      <AIChatSupport />
    </div>
  );
}
