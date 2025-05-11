export default function ProjectLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="inline-flex items-center h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>

      {/* Project header skeleton */}
      <div className="mb-8">
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
        <div className="flex space-x-4 mb-6">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>

      {/* Main image skeleton */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>

      {/* Project content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="h-7 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2 mb-6">
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
