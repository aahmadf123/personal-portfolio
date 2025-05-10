"use client"

import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import type { ActionResponse } from "@/lib/server-action-utils"

interface ActionResponseHandlerProps {
  response: ActionResponse | null
  onSuccess?: () => void
  onError?: () => void
  showToast?: boolean
}

export function ActionResponseHandler({ response, onSuccess, onError, showToast = true }: ActionResponseHandlerProps) {
  useEffect(() => {
    if (!response) return

    if (response.success) {
      if (showToast) {
        toast({
          title: "Success",
          description: response.message,
          variant: "default",
        })
      }
      onSuccess?.()
    } else {
      if (showToast) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        })
      }
      onError?.()

      // Log detailed error information to console in development
      if (process.env.NODE_ENV === "development" && response.error) {
        console.error("Server action error:", response.error)
      }
    }
  }, [response, onSuccess, onError, showToast])

  return null
}
