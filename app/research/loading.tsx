import { Skeleton } from "@/components/ui/skeleton"

export default function ResearchProjectsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto mt-2" />
        </div>

        {/* Projects count */}
        <div className="flex items-center justify-center mb-8">
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Projects list */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                {/* Timeline info */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>

                {/* View details link */}
                <div className="mt-4">
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
