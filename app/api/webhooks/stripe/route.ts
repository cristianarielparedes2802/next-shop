import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutComplete(event.data.object);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(
  session: Stripe.Checkout.Session,
): Promise<void> {
  if (session.payment_status !== "paid") return;

  let cartItems: { productId: string; quantity: number }[] = [];
  try {
    cartItems = JSON.parse(session.metadata?.cartItems ?? "[]");
  } catch {
    cartItems = [];
  }

  await db.order.upsert({
    where: { stripeSessionId: session.id },
    update: { status: "PAID" },
    create: {
      stripeSessionId: session.id,
      totalInCents: session.amount_total ?? 0,
      status: "PAID",
      items: JSON.stringify(cartItems),
    },
  });

  if (cartItems.length > 0) {
    await db.$transaction(
      cartItems.map((item) =>
        db.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );
  }

  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
}
