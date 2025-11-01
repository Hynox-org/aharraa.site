import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function CheckoutEmptyState() {
  return (
    <div className="text-center py-16">
      <AlertCircle className="w-24 h-24 mx-auto mb-6 opacity-30 text-red-500" />
      <h1 className="text-3xl font-black mb-4" style={{ color: "#0B132B" }}>
        Your cart is empty!
      </h1>
      <p className="text-lg text-neutral-600 mb-8">
        Please add items to your cart before proceeding to checkout.
      </p>
      <Button
        asChild
        className="mt-8 px-8 py-4 text-lg font-bold rounded-xl"
        style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}
      >
        <Link href="/pricing">Start Shopping</Link>
      </Button>
    </div>
  );
}
