"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { RefreshCw } from "lucide-react"

export function CacheControl() {
  const [isLoading, setIsLoading] = useState(false)

  const clearProjectsCache = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/projects/clear-cache")

      if (!response.ok) {
        throw new Error("Failed to clear projects cache")
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Projects cache cleared successfully. Refresh the page to see changes.",
        })
      } else {
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("Error clearing projects cache:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clear projects cache",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cache Control</h2>
      <div className="flex flex-col gap-2">
        <Button onClick={clearProjectsCache} disabled={isLoading} variant="outline" className="flex items-center gap-2">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Clearing Projects Cache...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Clear Projects Cache
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          Use this button if you've updated project data in the database but don't see the changes on the website.
        </p>
      </div>
    </div>
  )
}
