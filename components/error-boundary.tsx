"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { SiteLogo } from "./site-logo"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by boundary:", error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <SiteLogo size={60} animated={false} />
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4 mt-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We encountered an error while rendering this section. Please try refreshing the page.
          </p>
          <button
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    )
  }

  return <>{children}</>
}
