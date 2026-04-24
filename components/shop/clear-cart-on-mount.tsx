"use client";

import { useEffect } from "react";
import { clearCart } from "@/actions/cart";

export function ClearCartOnMount() {
  useEffect(() => {
    clearCart().catch(() => {});
  }, []);
  return null;
}
