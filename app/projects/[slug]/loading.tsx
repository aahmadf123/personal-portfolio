export default function ProjectDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Project title */}
      <div className="h-12 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mx-auto" />

      {/* Project image */}
      <div className="aspect-video max-w-4xl mx-auto bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

      {/* Project metadata */}
      <div className="max-w-4xl mx-auto flex gap-4 justify-center">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      </div>

      {/* Project content */}
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

      {/* Related projects */}
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
