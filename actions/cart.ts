"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteCart, getCart, MAX_ITEMS, MAX_QTY, saveCart } from "@/lib/cart";
import type { ActionResult } from "@/lib/types";

export async function addToCart(
  productId: string,
  _formData: FormData,
): Promise<ActionResult> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });
  if (!product) return { success: false, error: "Product not found" };
  if (product.stock === 0) return { success: false, error: "Out of stock" };

  const cart = await getCart();
  const existing = cart.find((i) => i.productId === productId);

  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + 1,
      MAX_QTY,
      product.stock,
    );
  } else {
    if (cart.length >= MAX_ITEMS) {
      return {
        success: false,
        error: "Cart is full (max. 20 products)",
      };
    }
    cart.push({ productId, quantity: 1 });
  }

  await saveCart(cart);
  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function updateQuantity(
  productId: string,
  quantity: number,
): Promise<ActionResult> {
  const cart = await getCart();

  if (quantity <= 0) {
    await saveCart(cart.filter((i) => i.productId !== productId));
  } else {
    const item = cart.find((i) => i.productId === productId);
    if (!item)
      return { success: false, error: "Product not in cart" };
    item.quantity = Math.min(quantity, MAX_QTY);
    await saveCart(cart);
  }

  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function removeFromCart(
  productId: string,
): Promise<ActionResult> {
  const cart = await getCart();
  await saveCart(cart.filter((i) => i.productId !== productId));
  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}

export async function clearCart(): Promise<ActionResult> {
  await deleteCart();
  revalidatePath("/cart");
  revalidatePath("/", "layout");
  return { success: true, data: undefined };
}
