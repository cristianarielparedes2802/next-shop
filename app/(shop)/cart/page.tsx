import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/components/shop/cart-item";
import { clearCart } from "@/actions/cart";
import { createCheckoutSession } from "@/actions/checkout";

export const metadata: Metadata = {
  title: "Cart | NextShop",
};

export default async function CartPage() {
  const cart = await getCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground max-w-sm">
          You haven&apos;t added any products yet.
        </p>
        <Link href="/products" className={buttonVariants()}>
          View products
        </Link>
      </div>
    );
  }

  const productIds = cart.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const validItems = cart.filter((item) => productMap.has(item.productId));
  const subtotal = validItems.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.priceInCents * item.quantity;
  }, 0);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <section className="lg:col-span-7" aria-label="Items in your cart">
        <h1 className="text-2xl font-bold tracking-tight">Cart</h1>

        <ul className="mt-2 divide-y" role="list">
          {validItems.map((item) => {
            const product = productMap.get(item.productId)!;
            return (
              <CartItem
                key={item.productId}
                productId={item.productId}
                quantity={item.quantity}
                product={product}
              />
            );
          })}
        </ul>

        <form
          action={async () => {
            "use server";
            await clearCart();
          }}
          className="mt-4"
        >
          <button
            type="submit"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-destructive transition-colors"
          >
            Clear cart
          </button>
        </form>
      </section>

      <aside
        className="mt-10 lg:col-span-5 lg:mt-0"
        aria-label="Order summary"
      >
        <div className="rounded-2xl border bg-muted/30 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="space-y-2 text-sm">
            {validItems.map((item) => {
              const product = productMap.get(item.productId)!;
              return (
                <div key={item.productId} className="flex justify-between gap-4">
                  <span className="text-muted-foreground truncate">
                    {product.name}{" "}
                    <span className="font-medium text-foreground">
                      ×{item.quantity}
                    </span>
                  </span>
                  <span className="tabular-nums shrink-0">
                    {formatPrice(product.priceInCents * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              await createCheckoutSession(formData);
            }}
          >
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Proceed to checkout
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
