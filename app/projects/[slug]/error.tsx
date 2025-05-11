"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Project page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Error Loading Project Details
        </h1>
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We encountered an error while trying to load this project. This
            could be due to a network issue or the project may not exist.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Error: {error?.message || "Unknown error"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/projects"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
