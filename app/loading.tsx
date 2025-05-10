export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  )
}
