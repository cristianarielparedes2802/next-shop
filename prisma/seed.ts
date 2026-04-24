import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

const products = [
  {
    slug: "wireless-headphones",
    name: "Wireless Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and USB-C fast charging. Crystal-clear Hi-Fi sound.",
    priceInCents: 19999,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 10,
  },
  {
    slug: "running-shoes",
    name: "Running Shoes",
    description:
      "Lightweight performance running shoes with responsive foam cushioning and breathable mesh upper. Built for speed and comfort.",
    priceInCents: 8999,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 8,
  },
  {
    slug: "classic-watch",
    name: "Classic Watch",
    description:
      "Timeless quartz watch with a genuine leather strap and minimalist dial. Water-resistant to 50m. Elegance that lasts.",
    priceInCents: 15999,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 5,
  },
  {
    slug: "leather-backpack",
    name: "Leather Backpack",
    description:
      "Durable 30L backpack with water-resistant coating, ergonomic shoulder straps, and multiple organizer pockets. Ready for any adventure.",
    priceInCents: 12999,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 12,
  },
  {
    slug: "sunglasses",
    name: "Polarized Sunglasses",
    description:
      "UV400 polarized lenses with a lightweight acetate frame. Reduces glare and protects your eyes in style.",
    priceInCents: 7499,
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 15,
  },
  {
    slug: "coffee-maker",
    name: "Pour-Over Coffee Maker",
    description:
      "Precision pour-over coffee maker crafted from borosilicate glass. Brew a rich, smooth cup with full control over flavor extraction.",
    priceInCents: 4999,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 20,
  },
  {
    slug: "mechanical-keyboard",
    name: "Mechanical Keyboard",
    description:
      "Compact 75% layout with tactile switches, per-key RGB backlighting, and aluminum case. The ultimate typing experience.",
    priceInCents: 13999,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 7,
  },
  {
    slug: "premium-notebook",
    name: "Premium Notebook",
    description:
      "Hardcover notebook with 200 pages of 120 g/m² dotted paper and a fabric bookmark. Perfect for journaling, sketching, or planning.",
    priceInCents: 1499,
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&auto=format&q=80",
    stock: 30,
  },
];

async function main() {
  await db.product.deleteMany();
  await db.product.createMany({ data: products });
  console.log("✓ 8 products seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
