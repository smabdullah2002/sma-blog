export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 ${className}`}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="border-b border-ink p-4 md:p-6 space-y-3">
      <Skeleton className="w-full aspect-[16/10]" />
      <div className="flex gap-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function PostGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`border-r border-ink ${i % 4 === 3 ? "border-r-0" : ""}`}>
          <PostCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
      <div className="md:col-span-8 md:border-r border-ink pr-0 md:pr-8 pb-8 md:pb-0 space-y-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="w-full aspect-[16/9]" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="md:col-span-4 pl-0 md:pl-8 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="border-t border-ink pt-6 space-y-3">
          <Skeleton className="h-3 w-28" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-1 w-12 mt-2" />
        <Skeleton className="h-8 w-72 mt-4" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-2 border-ink p-4 space-y-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-3 w-24 mb-4" />
        <div className="border-2 border-ink">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 border-b border-ink last:border-b-0 ${i % 2 === 0 ? "bg-bg" : "bg-neutral-100/50"}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="border-2 border-ink">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-4 py-3 border-b border-ink last:border-b-0 ${
            i % 2 === 0 ? "bg-bg" : "bg-neutral-100/50"
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-8 shrink-0" />
            <Skeleton className="h-3 w-10 shrink-0" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-ink p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="w-16 h-1" />
      <Skeleton className="w-full aspect-[16/9]" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
