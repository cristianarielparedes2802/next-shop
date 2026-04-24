import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { updateQuantity, removeFromCart } from "@/actions/cart";

type CartItemProps = {
  productId: string;
  quantity: number;
  product: {
    name: string;
    priceInCents: number;
    imageUrl: string;
    stock: number;
  };
};

export function CartItem({ productId, quantity, product }: CartItemProps) {
  async function decrease() {
    "use server";
    await updateQuantity(productId, quantity - 1);
  }
  async function increase() {
    "use server";
    await updateQuantity(productId, quantity + 1);
  }
  async function remove() {
    "use server";
    await removeFromCart(productId);
  }

  const lineTotal = product.priceInCents * quantity;
  const atMax = quantity >= Math.min(99, product.stock);

  return (
    <li className="flex gap-4 py-6">
      <div className="size-20 shrink-0 overflow-hidden rounded-xl sm:size-24">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={96}
          height={96}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium leading-tight">{product.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.priceInCents)} each
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <form action={decrease}>
              <Button
                type="submit"
                size="icon"
                variant="outline"
                className="size-7"
                aria-label="Decrease quantity"
              >
                <Minus className="size-3" aria-hidden="true" />
              </Button>
            </form>
            <span className="w-8 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <form action={increase}>
              <Button
                type="submit"
                size="icon"
                variant="outline"
                className="size-7"
                disabled={atMax}
                aria-label="Increase quantity"
              >
                <Plus className="size-3" aria-hidden="true" />
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">{formatPrice(lineTotal)}</span>
            <form action={remove}>
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="size-7 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${product.name} from cart`}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </li>
  );
}
