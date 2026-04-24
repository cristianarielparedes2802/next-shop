import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <Skeleton className="aspect-square w-full rounded-4xl" />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-48 rounded-4xl" />
      </div>
    </div>
  );
}
