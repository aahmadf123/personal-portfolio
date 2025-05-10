"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-6xl font-bold mb-4">Something went wrong</h1>
          <p className="text-lg mb-8">
            We apologize for the inconvenience. Please try again or contact support if the issue persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Try again
            </button>
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
