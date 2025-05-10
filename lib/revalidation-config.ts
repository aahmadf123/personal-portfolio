/**
 * Configuration for automatic content revalidation
 */

import type { ContentType } from "./revalidation-utils"

// Default intervals in minutes
export const DEFAULT_REVALIDATION_INTERVALS = {
  skills: 60, // 1 hour
  projects: 120, // 2 hours
  blog: 180, // 3 hours
  "case-studies": 240, // 4 hours
  timeline: 300, // 5 hours
  all: 360, // 6 hours
}

// Interface for revalidation settings
export interface RevalidationSettings {
  enabled: boolean
  intervals: Record<ContentType, number>
  lastRevalidated: Record<ContentType, string | null>
}

// Default settings
export const DEFAULT_REVALIDATION_SETTINGS: RevalidationSettings = {
  enabled: true,
  intervals: DEFAULT_REVALIDATION_INTERVALS,
  lastRevalidated: {
    skills: null,
    projects: null,
    blog: null,
    "case-studies": null,
    timeline: null,
    all: null,
  },
}

// Local storage key for settings
export const REVALIDATION_SETTINGS_KEY = "portfolio_revalidation_settings"

// Get settings from local storage or use defaults
export function getRevalidationSettings(): RevalidationSettings {
  if (typeof window === "undefined") {
    return DEFAULT_REVALIDATION_SETTINGS
  }

  const storedSettings = localStorage.getItem(REVALIDATION_SETTINGS_KEY)
  if (!storedSettings) {
    return DEFAULT_REVALIDATION_SETTINGS
  }

  try {
    return JSON.parse(storedSettings) as RevalidationSettings
  } catch (error) {
    console.error("Error parsing revalidation settings:", error)
    return DEFAULT_REVALIDATION_SETTINGS
  }
}

// Save settings to local storage
export function saveRevalidationSettings(settings: RevalidationSettings): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(REVALIDATION_SETTINGS_KEY, JSON.stringify(settings))
}

// Update last revalidated timestamp for a content type
export function updateLastRevalidated(contentType: ContentType): void {
  const settings = getRevalidationSettings()
  settings.lastRevalidated[contentType] = new Date().toISOString()
  saveRevalidationSettings(settings)
}

// Check if content type needs revalidation based on interval
export function needsRevalidation(contentType: ContentType): boolean {
  const settings = getRevalidationSettings()

  if (!settings.enabled) {
    return false
  }

  const lastRevalidated = settings.lastRevalidated[contentType]
  if (!lastRevalidated) {
    return true
  }

  const interval = settings.intervals[contentType]
  const lastRevalidatedDate = new Date(lastRevalidated)
  const now = new Date()

  // Convert interval from minutes to milliseconds
  const intervalMs = interval * 60 * 1000

  return now.getTime() - lastRevalidatedDate.getTime() > intervalMs
}
