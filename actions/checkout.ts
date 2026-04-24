"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { getCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type { ActionResult } from "@/lib/types";

export async function createCheckoutSession(
  _formData: FormData,
): Promise<ActionResult> {
  const cart = await getCart();
  if (cart.length === 0) {
    return { success: false, error: "Your cart is empty" };
  }

  const productIds = cart.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems = cart.flatMap((item) => {
    const product = productMap.get(item.productId);
    if (!product || product.stock === 0) return [];
    return [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: product.priceInCents,
        },
        quantity: Math.min(item.quantity, product.stock),
      },
    ];
  });

  if (lineItems.length === 0) {
    return { success: false, error: "No products available in stock" };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      cartItems: JSON.stringify(
        cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      ),
    },
  });

  redirect(session.url!);
}
