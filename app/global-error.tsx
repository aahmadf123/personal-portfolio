"use client";

import React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a1218] text-white flex items-center justify-center">
        <div className="container px-4 md:px-6 py-16 text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-6">500</h1>
          <h2 className="text-2xl font-semibold mb-4">Server Error</h2>
          <p className="text-gray-400 mb-8">
            {error.message || "Something went wrong on our servers."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
            >
              Return Home
            </Link>
          </div>
          {error.digest && (
            <p className="mt-8 text-sm text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
