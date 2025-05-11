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
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#0a1218] text-white flex items-center justify-center">
          <div className="max-w-md w-full p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-6">
              {error.message || "An unexpected error occurred."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition-colors"
              >
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
