export function DataTableSkeleton() {
  return (
    <div className="rounded-md border">
      {/* Table header */}
      <div className="border-b bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ml-auto" />
        </div>
      </div>

      {/* Table headers */}
      <div className="grid grid-cols-6 border-b p-4 bg-gray-50 dark:bg-gray-800">
        <div className="col-span-2 h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
      </div>

      {/* Table rows */}
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="grid grid-cols-6 p-4 border-b">
            <div className="col-span-2 h-5 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
            <div className="h-5 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
            <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
            </div>
          </div>
        ))}

      {/* Table footer */}
      <div className="p-4 flex items-center justify-end gap-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      </div>
    </div>
  )
}
