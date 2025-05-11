"use client";

import React from "react";
import Link from "next/link";

export default function ResearchProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Failed to load research project
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {error.message || "There was an error loading this research project."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
          >
            Try again
          </button>
          <Link
            href="/research"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md transition-colors"
          >
            Back to research projects
          </Link>
        </div>
      </div>
    </div>
  );
}
