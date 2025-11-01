import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartEmptyState() {
  return (
    <div className="text-center py-16">
      <ShoppingCart className="w-24 h-24 mx-auto mb-6 opacity-30" style={{ color: "#0B132B" }} />
      <p className="text-xl font-medium" style={{ color: "#0B132B" }}>
        Your cart is empty.
      </p>
      <Button asChild className="mt-8 px-8 py-4 text-lg font-bold rounded-xl" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
        <Link href="/pricing">Start Shopping</Link>
      </Button>
    </div>
  );
}
