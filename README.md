# NextShop — Full-Stack E-Commerce Portfolio

A fully functional e-commerce demo built with the modern Next.js App Router stack. Features a statically generated product catalog, a persistent cookie-based cart, and a complete Stripe test-mode checkout and webhook flow — deployed on Vercel with a serverless PostgreSQL database.

**Live demo:** [https://next-shop-xi-olive.vercel.app](https://next-shop-xi-olive.vercel.app)

---

## Screenshots

![Product Catalog](screenshots/products.png)

![Cart](screenshots/cart.png)

> Use test card `4242 4242 4242 4242` · any future date · any CVC to complete a purchase.

---

## Key Features

- **SSG product catalog** — pages are statically generated at build time via `generateStaticParams`, with `revalidatePath` for on-demand revalidation after stock updates
- **Cookie-based cart** — persistent across page navigations, stored as an `httpOnly` cookie (no global state library)
- **Stripe Hosted Checkout** — full test-mode payment flow with redirect to Stripe and back
- **Webhook confirmation** — `checkout.session.completed` event creates an Order record and decrements product stock atomically
- **Loading and not-found states** — skeleton UIs and proper 404 pages for every route
- **Accessible UI** — semantic HTML, `aria-label` on interactive elements, focus-visible styles

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui (Base/Luma) |
| UI Primitives | @base-ui/react |
| Database ORM | Prisma v7 |
| Database | Neon Serverless PostgreSQL |
| Payments | Stripe (test mode) |
| Validation | Zod v4 |
| Deployment | Vercel |

---

## Technical Concepts Applied

- **App Router conventions** — layouts, loading, not-found, and page files per route segment
- **Server Actions** — all mutations (cart, checkout) use `"use server"` functions; no API routes for data mutations
- **`ActionResult<T>` pattern** — discriminated union `{ success: true; data: T } | { success: false; error: string }` for consistent error handling across all actions
- **Prisma v7 adapter pattern** — driver adapters (`@prisma/adapter-pg`) are required; no direct TCP connection
- **Zod v4 env validation** — all environment variables are parsed and typed at startup via `lib/env.ts`
- **Stateless cart** — cart state lives entirely in a signed `httpOnly` cookie; server reads it on every request with no hydration mismatch
- **Idempotent webhook handler** — `db.order.upsert` ensures duplicate Stripe events never create duplicate orders
- **`revalidatePath` after webhook** — product pages are revalidated server-side after stock is decremented

---

## Project Structure

```
next-shop/
├── actions/
│   ├── cart.ts              # addToCart, updateQuantity, removeFromCart, clearCart
│   └── checkout.ts          # createCheckoutSession → redirect to Stripe
├── app/
│   ├── (shop)/
│   │   ├── layout.tsx       # Sticky header with reactive cart icon
│   │   ├── products/        # SSG catalog and detail pages
│   │   ├── cart/            # Cart page
│   │   └── checkout/        # Success and cancel pages
│   ├── api/
│   │   └── webhooks/stripe/ # Stripe webhook route handler
│   └── page.tsx             # Root redirect → /products
├── components/
│   ├── shop/                # AddToCartButton, CartIcon, CartItem, ProductCard
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── cart.ts              # Cookie helpers (getCart, saveCart, deleteCart)
│   ├── db.ts                # Prisma singleton with pg adapter
│   ├── env.ts               # Zod-validated environment variables
│   ├── stripe.ts            # Stripe client singleton
│   └── types.ts             # ActionResult<T>
├── prisma/
│   ├── schema.prisma        # Product and Order models
│   └── seed.ts              # 8 demo products with Unsplash images
└── schemas/
    └── product.ts           # Zod product schema
```

---

## Installation and Setup

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) or compatible PostgreSQL database
- A [Stripe](https://stripe.com) account (test mode)

### 1. Clone and install
```bash
git clone https://github.com/cristianarielparedes2802/next-shop.git
cd next-shop
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set up the database
```bash
npx prisma db push   # create tables
npx prisma db seed   # insert 8 demo products
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Test Stripe webhook locally
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `.env` and restart the server.

**Test card:** `4242 4242 4242 4242` · any future date · any CVC.

---

## Developer Notes

- **No global state** — cart state is managed exclusively via `httpOnly` cookies and Server Actions; React context and state libraries are intentionally avoided
- **`better-sqlite3` → `pg`** — the project was developed locally with SQLite and migrated to PostgreSQL for the Vercel deployment without changing application logic
- **`postinstall: prisma generate`** — ensures the Prisma client is always generated after `npm install`, which is required for Vercel's build pipeline
- **Inline `"use server"` wrappers** — used in Server Components to adapt `ActionResult`-returning actions to the `void` return type expected by `<form action>`
- **`revalidatePath("/", "layout")`** — called after every cart mutation to ensure the cart badge in the sticky header reflects the current state

---

Developed by **Cristian Ariel Paredes**
