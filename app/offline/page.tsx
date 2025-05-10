"use client"

import Link from "next/link"
import { WifiOff, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <WifiOff size={48} className="text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">You're offline</h1>

        <p className="text-muted-foreground mb-6">
          It looks like you've lost your internet connection. Some features may be limited until you're back online.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>

          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Don't worry, any cached content will still be available while you're offline.
        </p>
      </div>
    </div>
  )
}
