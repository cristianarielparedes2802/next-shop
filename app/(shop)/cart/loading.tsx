import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7 space-y-6">
        <Skeleton className="h-8 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-6 border-b">
            <Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
              <div className="mt-auto flex justify-between">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 lg:col-span-5 lg:mt-0">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
