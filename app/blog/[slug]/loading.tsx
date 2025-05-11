export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-[#0a1218] text-white">
      <div className="h-16 bg-[#0a1218] border-b border-gray-800"></div>

      <article className="py-16 md:py-24 animate-pulse">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button skeleton */}
            <div className="inline-flex items-center h-4 w-32 bg-gray-700 rounded mb-8"></div>

            {/* Category skeleton */}
            <div className="h-6 w-24 bg-gray-700 rounded-full mb-6"></div>

            {/* Title skeleton */}
            <div className="h-12 w-full bg-gray-700 rounded mb-6"></div>

            {/* Metadata skeleton */}
            <div className="flex items-center gap-4 h-4 mb-8">
              <div className="w-24 h-4 bg-gray-700 rounded"></div>
              <div className="w-20 h-4 bg-gray-700 rounded"></div>
            </div>

            {/* Author skeleton */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-700 rounded"></div>
                <div className="h-3 w-40 bg-gray-700 rounded"></div>
              </div>
            </div>

            {/* Image skeleton */}
            <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full bg-gray-700 rounded-lg mb-8"></div>

            {/* Content skeleton */}
            <div className="space-y-4 mb-12">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>

            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
