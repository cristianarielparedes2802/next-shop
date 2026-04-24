import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-4xl">
      <Skeleton className="aspect-square w-full rounded-none rounded-t-4xl" />
      <div className="flex flex-col gap-2 px-6 py-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center justify-between px-6 pb-6">
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
