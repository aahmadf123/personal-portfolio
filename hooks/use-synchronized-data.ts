"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNetworkStatus } from "./use-network-status"
import { synchronizeResource, getSyncState, type SyncStatus, updateSyncState } from "@/lib/sync-service"
import { getFromLocalStorage } from "@/lib/offline-storage"

interface UseSynchronizedDataOptions<T> {
  resource: string
  fetchFn: () => Promise<T>
  initialData?: T
  syncOnMount?: boolean
  syncOnReconnect?: boolean
}

interface SynchronizedDataState<T> {
  data: T | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSyncing: boolean
  syncStatus: SyncStatus
  lastSyncTime: number | null
  fromCache: boolean
}

export function useSynchronizedData<T>({
  resource,
  fetchFn,
  initialData = null,
  syncOnMount = true,
  syncOnReconnect = true,
}: UseSynchronizedDataOptions<T>) {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [state, setState] = useState<SynchronizedDataState<T>>({
    data: initialData,
    isLoading: true,
    isError: false,
    error: null,
    isSyncing: false,
    syncStatus: "idle",
    lastSyncTime: null,
    fromCache: false,
  })

  // Track sync progress
  const [syncProgress, setSyncProgress] = useState(0)

  const hasSyncedRef = useRef(false)

  // Load initial data from cache
  useEffect(() => {
    const cachedData = getFromLocalStorage<T>(resource)
    const syncState = getSyncState()

    if (cachedData) {
      setState((prev) => ({
        ...prev,
        data: cachedData,
        isLoading: false,
        fromCache: true,
        lastSyncTime: syncState.lastSyncTime,
      }))
    }
  }, [resource])

  // Sync function
  const syncData = useCallback(
    async (force = false) => {
      if (!isOnline && !state.data) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: new Error("You are offline and no cached data is available"),
        }))
        return
      }

      if (!isOnline) {
        return
      }

      setState((prev) => ({
        ...prev,
        isSyncing: true,
        syncStatus: "syncing",
      }))

      try {
        const result = await synchronizeResource<T>(resource, fetchFn, {
          forceSync: force,
          onProgress: (progress) => setSyncProgress(progress),
        })

        setState((prev) => ({
          ...prev,
          data: result.data,
          isLoading: false,
          isError: false,
          error: null,
          isSyncing: false,
          syncStatus: "success",
          lastSyncTime: Date.now(),
          fromCache: result.fromCache,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error("Unknown error"),
          isSyncing: false,
          syncStatus: "error",
        }))
      }
    },
    [fetchFn, isOnline, resource],
  )

  // Sync on mount if requested
  useEffect(() => {
    if (syncOnMount && !hasSyncedRef.current) {
      hasSyncedRef.current = true
      syncData()
    }
  }, [syncData, syncOnMount])

  // Sync when coming back online if requested
  useEffect(() => {
    if (syncOnReconnect && isOnline && wasOffline) {
      syncData(true) // Force sync when reconnecting
    }
  }, [isOnline, wasOffline, syncData, syncOnReconnect])

  // Reset sync state when unmounting
  useEffect(() => {
    return () => {
      if (state.syncStatus === "syncing") {
        updateSyncState({ status: "idle" })
      }
    }
  }, [state.syncStatus])

  return {
    ...state,
    syncData,
    syncProgress,
    isOnline,
  }
}
