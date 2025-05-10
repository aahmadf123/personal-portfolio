export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />

      <div className="p-6 flex-grow flex flex-col">
        {/* Title skeleton */}
        <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-3/4 mb-3" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-4/5" />
        </div>

        {/* Metadata skeleton */}
        <div className="flex gap-3 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-20" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-20" />
        </div>

        {/* Progress bar skeleton */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-8" />
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-full" />
        </div>

        {/* Link skeleton */}
        <div className="mt-auto">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse w-32" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-16" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-20" />
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-14" />
        </div>
      </div>
    </div>
  )
}

export function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}
