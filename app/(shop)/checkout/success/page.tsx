import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { buttonVariants } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/shop/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Order confirmed | NextShop",
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/cart");

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") redirect("/cart");

  return (
    <>
      <ClearCartOnMount />
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <CheckCircle className="size-16 text-green-500" aria-hidden="true" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Thank you for your purchase!
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Your payment was processed successfully. You will receive a
            confirmation shortly.
          </p>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          Reference: {session_id.slice(-8).toUpperCase()}
        </p>
        <Link href="/products" className={buttonVariants()}>
          Continue shopping
        </Link>
      </div>
    </>
  );
}
