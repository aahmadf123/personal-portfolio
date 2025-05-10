"use client"

import type React from "react"

import { Spinner } from "@/components/ui/spinner"

interface LoadingStateWrapperProps {
  isLoading: boolean
  error?: string | null
  isEmpty?: boolean
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
}

export function LoadingStateWrapper({
  isLoading,
  error,
  isEmpty,
  children,
  loadingComponent,
  errorComponent,
  emptyComponent,
}: LoadingStateWrapperProps) {
  // Show loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }

    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>
    }

    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200 text-center">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  // Show empty state
  if (isEmpty) {
    if (emptyComponent) {
      return <>{emptyComponent}</>
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No items found</p>
      </div>
    )
  }

  // Show content
  return <>{children}</>
}
