"use client"

import { useRevalidation } from "@/contexts/revalidation-context"
import { TimerIcon, TimerOffIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AutoRevalidationIndicator() {
  const { settings } = useRevalidation()

  if (!settings) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center text-xs text-muted-foreground">
            {settings.enabled ? (
              <>
                <TimerIcon className="h-3 w-3 mr-1" />
                <span>Auto-refresh on</span>
              </>
            ) : (
              <>
                <TimerOffIcon className="h-3 w-3 mr-1" />
                <span>Auto-refresh off</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {settings.enabled
            ? "Automatic content revalidation is enabled"
            : "Automatic content revalidation is disabled"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
