import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    priceInCents: number;
    imageUrl: string;
    stock: number;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`View ${product.name}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-4xl"
    >
      <Card className="h-full transition-shadow group-hover:shadow-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={600}
          className="w-full object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <CardContent className="flex flex-col gap-1 pt-4">
          <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-2">
          <span className="font-semibold text-base">
            {formatPrice(product.priceInCents)}
          </span>
          {outOfStock && (
            <span className="text-xs text-muted-foreground">Out of stock</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
