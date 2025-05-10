// Type definitions
type StorageItem = {
  timestamp: number
  data: any
}

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000

/**
 * Save data to localStorage with timestamp
 */
export function saveToLocalStorage(key: string, data: any): void {
  try {
    const item: StorageItem = {
      timestamp: Date.now(),
      data,
    }
    localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

/**
 * Get data from localStorage if it exists and hasn't expired
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key)

    // If no item exists, return null
    if (!itemStr) return null

    const item: StorageItem = JSON.parse(itemStr)
    const now = Date.now()

    // Check if the item has expired
    if (now - item.timestamp > CACHE_EXPIRATION) {
      // If expired, remove it and return null
      localStorage.removeItem(key)
      return null
    }

    return item.data as T
  } catch (error) {
    console.error("Error retrieving from localStorage:", error)
    return null
  }
}

/**
 * Clear all cached data
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error("Error clearing localStorage:", error)
  }
}
