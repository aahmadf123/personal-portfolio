"use client"

import { useEffect, useState } from "react"
import { type ContentType, revalidateContent } from "@/lib/revalidation-utils"
import {
  getRevalidationSettings,
  needsRevalidation,
  updateLastRevalidated,
  type RevalidationSettings,
  saveRevalidationSettings,
} from "@/lib/revalidation-config"
import { useToast } from "@/hooks/use-toast"

// Hook for automatic content revalidation
export function useAutoRevalidation() {
  const [settings, setSettings] = useState<RevalidationSettings>(getRevalidationSettings)
  const [isRevalidating, setIsRevalidating] = useState<Record<ContentType, boolean>>({
    skills: false,
    projects: false,
    blog: false,
    "case-studies": false,
    timeline: false,
    all: false,
  })
  const { toast } = useToast()

  // Update settings in state and localStorage
  const updateSettings = (newSettings: RevalidationSettings) => {
    setSettings(newSettings)
    saveRevalidationSettings(newSettings)
  }

  // Toggle automatic revalidation
  const toggleAutoRevalidation = () => {
    const newSettings = { ...settings, enabled: !settings.enabled }
    updateSettings(newSettings)

    toast({
      title: newSettings.enabled ? "Automatic revalidation enabled" : "Automatic revalidation disabled",
      description: newSettings.enabled
        ? "Content will be automatically refreshed at the configured intervals"
        : "Automatic content refreshing has been turned off",
      variant: newSettings.enabled ? "default" : "destructive",
    })
  }

  // Update interval for a content type
  const updateInterval = (contentType: ContentType, minutes: number) => {
    const newSettings = {
      ...settings,
      intervals: {
        ...settings.intervals,
        [contentType]: minutes,
      },
    }
    updateSettings(newSettings)

    toast({
      title: "Revalidation interval updated",
      description: `${contentType} will now refresh every ${minutes} minutes`,
    })
  }

  // Manually trigger revalidation for a content type
  const triggerRevalidation = async (contentType: ContentType) => {
    setIsRevalidating((prev) => ({ ...prev, [contentType]: true }))

    try {
      const result = await revalidateContent(contentType)

      if (result.success) {
        updateLastRevalidated(contentType)
        setSettings(getRevalidationSettings())

        toast({
          title: "Content refreshed",
          description: result.message,
        })
      } else {
        toast({
          title: "Refresh failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsRevalidating((prev) => ({ ...prev, [contentType]: false }))
    }
  }

  // Check and revalidate content if needed
  const checkAndRevalidate = async () => {
    if (!settings.enabled) return

    const contentTypes: ContentType[] = ["skills", "projects", "blog", "case-studies", "timeline"]

    for (const contentType of contentTypes) {
      if (needsRevalidation(contentType) && !isRevalidating[contentType]) {
        await triggerRevalidation(contentType)
      }
    }
  }

  // Run automatic revalidation check on component mount and at regular intervals
  useEffect(() => {
    // Initial check
    checkAndRevalidate()

    // Set up interval for periodic checks (every minute)
    const intervalId = setInterval(checkAndRevalidate, 60000)

    // Clean up on unmount
    return () => clearInterval(intervalId)
  }, [settings.enabled])

  return {
    settings,
    isRevalidating,
    toggleAutoRevalidation,
    updateInterval,
    triggerRevalidation,
    checkAndRevalidate,
  }
}
