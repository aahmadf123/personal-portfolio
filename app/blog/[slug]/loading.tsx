export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Post header */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

        {/* Post metadata */}
        <div className="flex gap-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Featured image */}
      <div className="aspect-video max-w-4xl mx-auto bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

      {/* Post content */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-6 w-4/6 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

        <div className="py-2"></div>

        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-6 w-3/6 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 max-w-4xl mx-auto">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>

      {/* Related posts */}
      <div className="mt-12">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mx-auto mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse aspect-video" />
            ))}
        </div>
      </div>
    </div>
  )
}
