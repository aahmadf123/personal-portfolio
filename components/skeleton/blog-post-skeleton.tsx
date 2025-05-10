import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function BlogPostSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Featured image skeleton */}
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />

      <CardHeader className="p-4 pb-2">
        {/* Title skeleton */}
        <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2" />

        {/* Metadata skeleton */}
        <div className="flex items-center gap-4 mt-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Read more button skeleton */}
        <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      </CardFooter>
    </Card>
  )
}

export function BlogPostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <BlogPostSkeleton key={i} />
        ))}
    </div>
  )
}
