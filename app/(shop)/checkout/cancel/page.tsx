import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment cancelled | NextShop",
};

export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <XCircle className="size-16 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Payment cancelled</h1>
        <p className="text-muted-foreground max-w-sm">
          Your payment was cancelled. Your items are still saved in your cart.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/cart" className={buttonVariants()}>
          Back to cart
        </Link>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline" })}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
