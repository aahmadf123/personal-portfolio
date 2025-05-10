"use client"

import { RefreshCw, WifiOff, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SyncStatus } from "@/lib/sync-service"

interface SyncStatusIndicatorProps {
  status: SyncStatus
  isOnline: boolean
  lastSyncTime: number | null
  onSync: () => void
  syncProgress?: number
}

export function SyncStatusIndicator({
  status,
  isOnline,
  lastSyncTime,
  onSync,
  syncProgress = 0,
}: SyncStatusIndicatorProps) {
  // Format the last sync time
  const formattedLastSyncTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : null

  if (!isOnline) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs">
        <WifiOff size={14} />
        <span>You're offline. Showing cached data.</span>
      </div>
    )
  }

  if (status === "syncing") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs">
        <RefreshCw size={14} className="animate-spin" />
        <span>Syncing data... {syncProgress > 0 ? `${syncProgress}%` : ""}</span>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="inline-flex items-center gap-2">
        <div className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          <span>Sync failed</span>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5 ml-2" onClick={onSync}>
          <RefreshCw size={14} />
          Retry
        </Button>
      </div>
    )
  }

  if (status === "success" && lastSyncTime) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs">
        <CheckCircle size={14} />
        <span>
          Synced at {formattedLastSyncTime}{" "}
          <button onClick={onSync} className="underline ml-1 focus:outline-none">
            Refresh
          </button>
        </span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={onSync}>
        <RefreshCw size={14} />
        Sync Data
      </Button>
    </div>
  )
}
