import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartEmptyState() {
  return (
    <div className="text-center py-16">
      <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
      <p className="text-xl font-medium text-black">
        Your cart is empty.
      </p>
      <Button asChild className="mt-8 px-8 py-4 text-lg font-bold rounded-xl bg-[#3CB371] hover:bg-[#2FA05E] text-white">
        <Link href="/pricing">Start Shopping</Link>
      </Button>
    </div>
  );
}
