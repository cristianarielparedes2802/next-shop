"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function SubmitButton({ inStock }: { inStock: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={!inStock || pending}
      aria-disabled={!inStock || pending}
    >
      {pending ? "Adding..." : inStock ? "Add to cart" : "Out of stock"}
    </Button>
  );
}

export function AddToCartForm({
  action,
  inStock,
}: {
  action: (formData: FormData) => Promise<unknown>;
  inStock: boolean;
}) {
  async function voidAction(formData: FormData): Promise<void> {
    await action(formData);
  }
  return (
    <form action={voidAction}>
      <SubmitButton inStock={inStock} />
    </form>
  );
}
