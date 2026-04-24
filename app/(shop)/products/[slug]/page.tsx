import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { addToCart } from "@/actions/cart";
import { AddToCartForm } from "@/components/shop/add-to-cart-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} | NextShop`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="overflow-hidden rounded-4xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={600}
          className="w-full object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold">
            {formatPrice(product.priceInCents)}
          </p>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>

        <p className="text-sm">
          {inStock ? (
            <span className="text-green-600 font-medium">
              In stock ({product.stock} available)
            </span>
          ) : (
            <span className="text-destructive font-medium">Out of stock</span>
          )}
        </p>

        <AddToCartForm
          action={addToCart.bind(null, product.id)}
          inStock={inStock}
        />
      </div>
    </div>
  );
}
