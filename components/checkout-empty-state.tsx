import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function CheckoutEmptyState() {
  return (
    <div className="text-center py-16">
      <AlertCircle className="w-24 h-24 mx-auto mb-6 opacity-30 text-gray-400" />
      <h1 className="text-3xl font-black mb-4 text-black">
        Your cart is empty!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Please add items to your cart before proceeding to checkout.
      </p>
      <Button
        asChild
        className="mt-8 px-8 py-4 text-lg font-bold rounded-xl bg-[#3CB371] hover:bg-[#2FA05E] text-white"
      >
        <Link href="/pricing">Start Shopping</Link>
      </Button>
    </div>
  );
}
