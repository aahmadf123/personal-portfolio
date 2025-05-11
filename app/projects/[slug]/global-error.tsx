"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error in projects:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're sorry, but there was an error loading this project.
            </p>
            <div className="border-l-4 border-red-500 p-4 bg-red-50 dark:bg-red-900/20 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300">
                {error?.message || "An unexpected error occurred"}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              <a
                href="/projects"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Projects
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
