import { cookies } from "next/headers";

export type CartItem = { productId: string; quantity: number };
export type Cart = CartItem[];

export const CART_COOKIE = "cart";
export const MAX_ITEMS = 20;
export const MAX_QTY = 99;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export function parseCart(value: string | undefined): Cart {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export async function getCart(): Promise<Cart> {
  const store = await cookies();
  return parseCart(store.get(CART_COOKIE)?.value);
}

export async function saveCart(cart: Cart): Promise<void> {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(CART_COOKIE, JSON.stringify(cart), { ...COOKIE_OPTIONS, secure });
}

export async function deleteCart(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}
