export default function AIAssistantLoading() {
  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="text-center space-y-4">
          <div className="h-10 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-md mx-auto"></div>
          <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded-md mx-auto"></div>
          <div className="h-6 w-5/6 bg-gray-300 dark:bg-gray-700 rounded-md mx-auto"></div>
        </div>

        <div className="border border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-gray-950 rounded-lg">
          <div className="p-6 space-y-4">
            <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 p-4 rounded-lg border border-gray-800"
                >
                  <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-md mb-3"></div>
                  <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded-md mt-2"></div>
                </div>
              ))}
            </div>

            <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30 mt-8">
              <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-md"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-24 bg-blue-900/10 rounded-lg border border-blue-500/20"></div>
      </div>
    </div>
  );
}
