import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "Products | NextShop",
  description: "Discover our curated selection of products.",
};

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        All Products
      </h1>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products available.</p>
      ) : (
        <ul
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Product catalog"
        >
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
