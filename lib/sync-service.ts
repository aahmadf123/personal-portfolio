import { saveToLocalStorage, getFromLocalStorage } from "./offline-storage"

// Types for our sync system
export type SyncStatus = "idle" | "syncing" | "success" | "error"
export type SyncAction = "create" | "update" | "delete" | "read"

export interface SyncQueueItem {
  id: string
  timestamp: number
  action: SyncAction
  resource: string
  data: any
  processed: boolean
  retryCount: number
}

export interface SyncState {
  lastSyncTime: number | null
  status: SyncStatus
  pendingActions: number
  error: string | null
}

// Storage keys
const SYNC_QUEUE_KEY = "sync_queue"
const SYNC_STATE_KEY = "sync_state"
const DATA_VERSION_KEY_PREFIX = "data_version_"

// Default sync state
const defaultSyncState: SyncState = {
  lastSyncTime: null,
  status: "idle",
  pendingActions: 0,
  error: null,
}

// Get the current sync queue
export function getSyncQueue(): SyncQueueItem[] {
  return getFromLocalStorage<SyncQueueItem[]>(SYNC_QUEUE_KEY) || []
}

// Add an item to the sync queue
export function addToSyncQueue(item: Omit<SyncQueueItem, "id" | "timestamp" | "processed" | "retryCount">): void {
  const queue = getSyncQueue()
  const newItem: SyncQueueItem = {
    ...item,
    id: generateId(),
    timestamp: Date.now(),
    processed: false,
    retryCount: 0,
  }

  queue.push(newItem)
  saveToLocalStorage(SYNC_QUEUE_KEY, queue)

  // Update the sync state to reflect pending actions
  updateSyncState({
    pendingActions: queue.filter((item) => !item.processed).length,
  })
}

// Process the sync queue
export async function processSyncQueue(): Promise<boolean> {
  const queue = getSyncQueue()
  const unprocessedItems = queue.filter((item) => !item.processed)

  if (unprocessedItems.length === 0) {
    return true
  }

  // Update sync state to syncing
  updateSyncState({
    status: "syncing",
    error: null,
  })

  let success = true

  // Process each item in the queue
  for (const item of unprocessedItems) {
    try {
      // Here we would normally make API calls based on the action
      // For this example, we'll simulate successful processing
      await simulateProcessing(item)

      // Mark as processed
      item.processed = true
    } catch (error) {
      success = false
      item.retryCount += 1

      // If we've tried too many times, mark as processed to avoid infinite retries
      if (item.retryCount >= 3) {
        item.processed = true
      }

      updateSyncState({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error during sync",
      })
    }
  }

  // Save the updated queue
  saveToLocalStorage(SYNC_QUEUE_KEY, queue)

  // Update sync state
  updateSyncState({
    status: success ? "success" : "error",
    lastSyncTime: Date.now(),
    pendingActions: queue.filter((item) => !item.processed).length,
  })

  return success
}

// Get the current sync state
export function getSyncState(): SyncState {
  return getFromLocalStorage<SyncState>(SYNC_STATE_KEY) || { ...defaultSyncState }
}

// Update the sync state
export function updateSyncState(partialState: Partial<SyncState>): void {
  const currentState = getSyncState()
  const newState = { ...currentState, ...partialState }
  saveToLocalStorage(SYNC_STATE_KEY, newState)
}

// Clear the sync queue
export function clearSyncQueue(): void {
  saveToLocalStorage(SYNC_QUEUE_KEY, [])
  updateSyncState({
    pendingActions: 0,
  })
}

// Track data versions for different resources
export function setDataVersion(resource: string, version: number): void {
  saveToLocalStorage(`${DATA_VERSION_KEY_PREFIX}${resource}`, version)
}

export function getDataVersion(resource: string): number {
  return getFromLocalStorage<number>(`${DATA_VERSION_KEY_PREFIX}${resource}`) || 0
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Simulate processing delay (would be a real API call in production)
async function simulateProcessing(item: SyncQueueItem): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 10% chance of failure for testing
      if (Math.random() < 0.1) {
        reject(new Error(`Failed to process ${item.action} for ${item.resource}`))
      } else {
        resolve()
      }
    }, 500) // Simulate network delay
  })
}

// Synchronize a specific resource
export async function synchronizeResource<T>(
  resource: string,
  fetchFn: () => Promise<T>,
  options: {
    forceSync?: boolean
    onProgress?: (progress: number) => void
  } = {},
): Promise<{ data: T; fromCache: boolean; synced: boolean }> {
  const { forceSync = false, onProgress } = options
  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true

  // Get cached data
  const cachedData = getFromLocalStorage<T>(resource)
  const cachedVersion = getDataVersion(resource)

  // If we're offline, return cached data
  if (!isOnline) {
    return {
      data: cachedData as T,
      fromCache: true,
      synced: false,
    }
  }

  // If we have cached data and don't need to force sync, return it
  if (cachedData && !forceSync) {
    // Start background sync
    synchronizeInBackground(resource, fetchFn)

    return {
      data: cachedData as T,
      fromCache: true,
      synced: false,
    }
  }

  // Update sync state
  updateSyncState({
    status: "syncing",
  })

  if (onProgress) {
    onProgress(10)
  }

  try {
    // Fetch fresh data
    const freshData = await fetchFn()

    if (onProgress) {
      onProgress(70)
    }

    // Save to cache
    saveToLocalStorage(resource, freshData)

    // Update version
    setDataVersion(resource, cachedVersion + 1)

    // Process any pending sync actions
    await processSyncQueue()

    if (onProgress) {
      onProgress(100)
    }

    // Update sync state
    updateSyncState({
      status: "success",
      lastSyncTime: Date.now(),
      error: null,
    })

    return {
      data: freshData,
      fromCache: false,
      synced: true,
    }
  } catch (error) {
    // Update sync state
    updateSyncState({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error during sync",
    })

    // If we have cached data, return it
    if (cachedData) {
      return {
        data: cachedData as T,
        fromCache: true,
        synced: false,
      }
    }

    // Otherwise, rethrow the error
    throw error
  }
}

// Synchronize in the background without blocking UI
async function synchronizeInBackground<T>(resource: string, fetchFn: () => Promise<T>): Promise<void> {
  try {
    const freshData = await fetchFn()
    const cachedVersion = getDataVersion(resource)

    // Save to cache
    saveToLocalStorage(resource, freshData)

    // Update version
    setDataVersion(resource, cachedVersion + 1)

    // Update sync state
    updateSyncState({
      lastSyncTime: Date.now(),
    })
  } catch (error) {
    console.error(`Background sync failed for ${resource}:`, error)
  }
}
