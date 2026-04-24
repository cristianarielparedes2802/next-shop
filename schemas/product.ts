import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  priceInCents: z.int().positive(),
  imageUrl: z.url(),
  stock: z.int().min(0),
  createdAt: z.date(),
});

export const ProductInputSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductInput = z.infer<typeof ProductInputSchema>;
