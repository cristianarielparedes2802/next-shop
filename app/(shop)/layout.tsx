import type { ReactNode } from "react";
import Link from "next/link";
import { CartIcon } from "@/components/shop/cart-icon";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            NextShop
          </Link>
          <CartIcon />
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        NextShop — Portfolio
      </footer>
    </div>
  );
}
