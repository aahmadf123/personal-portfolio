"use client"

import { Suspense } from "react"
import Link from "next/link"

function ButtonContent() {
  // Even though we're not using useSearchParams here,
  // we're creating a separate component that could potentially use it
  // and wrapping it in Suspense
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Return Home
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Contact Support
      </Link>
    </div>
  )
}

export default function NotFoundClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ButtonContent />
    </Suspense>
  )
}
