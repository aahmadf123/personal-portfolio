"use client";

import React from "react";
import Link from "next/link";

export default function BlogPostError({
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
    <div className="min-h-screen bg-[#0a1218] text-white">
      <div className="container px-4 md:px-6 py-16 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Failed to load blog post</h1>
          <p className="text-muted-foreground mb-8">
            {error.message || "There was an error loading this blog post."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded transition-colors"
            >
              Try again
            </button>
            <Link
              href="/blog"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition-colors"
            >
              Back to blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
