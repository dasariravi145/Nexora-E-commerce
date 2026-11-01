import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/site-container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Shopping Bag & Hardware Assessment",
  description:
    "Review staged hardware specimens, manage quantities, and evaluate accurate INR demo pricing from the centralized NEXORA 30-product electronics catalogue.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Shopping Bag & Hardware Assessment | NEXORA",
    description:
      "Review staged hardware specimens, manage quantities, and evaluate accurate INR demo pricing from the centralized NEXORA 30-product electronics catalogue.",
  },
};

export default function CartPage() {
  return (
    <div className="py-8 sm:py-14 md:py-16">
      <SiteContainer size="xl">
        <CartView />
      </SiteContainer>
    </div>
  );
}
