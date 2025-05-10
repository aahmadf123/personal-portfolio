"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAutoRevalidation } from "@/hooks/use-auto-revalidation"
import type { ContentType } from "@/lib/revalidation-utils"
import type { RevalidationSettings } from "@/lib/revalidation-config"

// Define the context type
interface RevalidationContextType {
  settings: RevalidationSettings
  isRevalidating: Record<ContentType, boolean>
  toggleAutoRevalidation: () => void
  updateInterval: (contentType: ContentType, minutes: number) => void
  triggerRevalidation: (contentType: ContentType) => Promise<void>
  checkAndRevalidate: () => Promise<void>
}

// Create the context
const RevalidationContext = createContext<RevalidationContextType | undefined>(undefined)

// Provider component
export function RevalidationProvider({ children }: { children: ReactNode }) {
  const revalidation = useAutoRevalidation()

  return <RevalidationContext.Provider value={revalidation}>{children}</RevalidationContext.Provider>
}

// Hook to use the revalidation context
export function useRevalidation() {
  const context = useContext(RevalidationContext)
  if (context === undefined) {
    throw new Error("useRevalidation must be used within a RevalidationProvider")
  }
  return context
}
