"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
// Update the imports to use the new server actions
import {
  revalidateAll,
  revalidateBlog,
  revalidateProjects,
  revalidateResearchProjects,
  revalidateSkills,
} from "@/app/actions/revalidate-actions"
import type { ContentType } from "@/lib/revalidation-utils"

interface RefreshButtonProps {
  contentType?: ContentType
  onSuccess?: () => void
  onClick?: () => void
  label?: string
}

export function RefreshButton({ contentType = "all", onSuccess, onClick, label }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Replace the fetch call with direct server action calls
  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      let result

      switch (contentType) {
        case "projects":
          result = await revalidateProjects()
          break
        case "blog":
          result = await revalidateBlog()
          break
        case "skills":
          result = await revalidateSkills()
          break
        case "research-projects":
          result = await revalidateResearchProjects()
          break
        case "all":
        default:
          result = await revalidateAll()
          break
      }

      if (result.success) {
        toast({
          title: "Content refreshed",
          description: `${contentType} content has been refreshed successfully.`,
        })
        if (onSuccess) onSuccess()
      } else {
        toast({
          title: "Refresh failed",
          description: result.message || "Failed to refresh content.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error refreshing ${contentType}:`, error)
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
    <Button onClick={handleRefresh} variant="outline" size={label ? "default" : "icon"} disabled={isRefreshing}>
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""} ${label ? "mr-2" : ""}`} />
      {label}
    </Button>
  )
}
