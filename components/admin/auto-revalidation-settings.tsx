"use client"

import { useState } from "react"
import { useAutoRevalidation } from "@/hooks/use-auto-revalidation"
import type { ContentType } from "@/lib/revalidation-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RefreshCwIcon as ReloadIcon, CheckIcon, TimerIcon, XIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function AutoRevalidationSettings() {
  const { settings, isRevalidating, toggleAutoRevalidation, updateInterval, triggerRevalidation } =
    useAutoRevalidation()

  const [editingInterval, setEditingInterval] = useState<ContentType | null>(null)
  const [tempInterval, setTempInterval] = useState<number>(60)

  // Format content type for display
  const formatContentType = (type: ContentType): string => {
    if (type === "case-studies") return "Case Studies"
    if (type === "all") return "All Content"
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Start editing an interval
  const startEditInterval = (contentType: ContentType) => {
    setEditingInterval(contentType)
    setTempInterval(settings.intervals[contentType])
  }

  // Save the edited interval
  const saveInterval = () => {
    if (editingInterval) {
      updateInterval(editingInterval, tempInterval)
      setEditingInterval(null)
    }
  }

  // Cancel editing
  const cancelEditInterval = () => {
    setEditingInterval(null)
  }

  // Format the last revalidated time
  const formatLastRevalidated = (timestamp: string | null): string => {
    if (!timestamp) return "Never"
    return `${formatDistanceToNow(new Date(timestamp))} ago`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Automatic Content Revalidation</span>
          <Switch
            checked={settings.enabled}
            onCheckedChange={toggleAutoRevalidation}
            aria-label="Toggle automatic revalidation"
          />
        </CardTitle>
        <CardDescription>Configure how often your content is automatically refreshed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(Object.keys(settings.intervals) as ContentType[]).map((contentType) => (
            <div key={contentType} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{formatContentType(contentType)}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerRevalidation(contentType)}
                  disabled={isRevalidating[contentType]}
                >
                  {isRevalidating[contentType] ? (
                    <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ReloadIcon className="h-4 w-4 mr-2" />
                  )}
                  Refresh Now
                </Button>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <TimerIcon className="h-4 w-4 mr-2" />
                  Last refreshed: {formatLastRevalidated(settings.lastRevalidated[contentType])}
                </div>
              </div>

              {editingInterval === contentType ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Refresh interval: {tempInterval} minutes</span>
                    </div>
                    <Slider
                      value={[tempInterval]}
                      min={5}
                      max={1440}
                      step={5}
                      onValueChange={(value) => setTempInterval(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5m</span>
                      <span>1h</span>
                      <span>6h</span>
                      <span>24h</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={saveInterval}>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditInterval}>
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Refreshes every {settings.intervals[contentType]} minutes</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditInterval(contentType)}
                    disabled={!settings.enabled}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {settings.enabled
            ? "Automatic revalidation is enabled. Your content will refresh based on the intervals above."
            : "Automatic revalidation is disabled. You'll need to manually refresh your content."}
        </div>
      </CardFooter>
    </Card>
  )
}
