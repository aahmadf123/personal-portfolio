"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { revalidateAll } from "@/app/actions/revalidate-actions"
import Link from "next/link"

export function ContentRevalidationCard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const handleRefreshAll = async () => {
    setIsRefreshing(true)

    try {
      const result = await revalidateAll()

      if (result.success) {
        setLastRefreshed(new Date())
        toast({
          title: "Content refreshed",
          description: "All website content has been refreshed successfully.",
        })
      } else {
        toast({
          title: "Refresh failed",
          description: result.message || "Failed to refresh content.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Content Revalidation</CardTitle>
        <CardDescription>Refresh website content to show the latest data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-12 flex items-center">
          {lastRefreshed ? (
            <p className="text-sm text-muted-foreground">Last refreshed: {lastRefreshed.toLocaleTimeString()}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Refresh content to show the latest database changes</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" disabled={isRefreshing} onClick={handleRefreshAll}>
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </>
          )}
        </Button>
        <Link href="/admin/content-revalidation">
          <Button variant="ghost" size="sm">
            <span>Manage Content</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
