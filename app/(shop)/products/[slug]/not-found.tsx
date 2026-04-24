import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <h2 className="text-2xl font-bold tracking-tight">Product not found</h2>
      <p className="text-muted-foreground max-w-sm">
        The product you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Link href="/products" className={buttonVariants()}>
        View all products
      </Link>
    </div>
  );
}
