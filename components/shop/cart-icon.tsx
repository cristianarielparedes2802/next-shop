import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCart } from "@/lib/cart";

export async function CartIcon() {
  const cart = await getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      aria-label={`View cart${count > 0 ? ` (${count} items)` : ""}`}
      className="relative rounded-full p-2 hover:bg-muted transition-colors"
    >
      <ShoppingCart className="size-5" aria-hidden="true" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
