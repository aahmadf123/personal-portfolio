"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import type { TimelineEntry } from "@/components/interactive-timeline"

interface VirtualizedTimelineOptions {
  entries: TimelineEntry[]
  itemHeight: number
  overscan: number
  visibleItems: number
  loadingDelay?: number
}

export function useVirtualizedTimeline({
  entries,
  itemHeight,
  overscan = 3, // Increased overscan for smoother scrolling
  visibleItems = 3,
  loadingDelay = 300, // Shorter loading delay for better responsiveness
}: VirtualizedTimelineOptions) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadedCount, setLoadedCount] = useState(visibleItems)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollListenerRef = useRef<() => void>()

  // Calculate total height of all entries
  const totalHeight = entries.length * itemHeight

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    // Calculate the start index based on scroll position
    const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - overscan)

    // Calculate the end index based on visible items plus overscan
    const endIndex = Math.min(entries.length, Math.ceil((scrollPosition + containerHeight) / itemHeight) + overscan)

    return { startIndex, endIndex }
  }, [scrollPosition, containerHeight, entries.length, itemHeight, overscan])

  // Get the visible entries - with progressive loading
  const visibleEntries = useMemo(() => {
    // Determine how many entries to show based on current load state
    const entriesToShow = Math.min(entries.length, loadedCount)
    return entries.slice(0, entriesToShow)
  }, [entries, loadedCount])

  // Calculate the padding to maintain scroll position
  const paddingTop = visibleRange.startIndex * itemHeight

  // Load more entries when approaching the bottom
  const loadMoreEntries = useCallback(() => {
    if (isLoading || loadedCount >= entries.length) return

    setIsLoading(true)

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
    }

    // Set a timeout to simulate network delay, but keep it short
    loadingTimeoutRef.current = setTimeout(() => {
      setLoadedCount((prev) => Math.min(prev + 3, entries.length))
      setIsLoading(false)
    }, loadingDelay)
  }, [isLoading, loadedCount, entries.length, loadingDelay])

  // Track scroll position and load more content preemptively
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const element = containerRef.current
      const scrollTop = window.scrollY
      const elementTop = element.getBoundingClientRect().top + window.scrollY
      const relativeScroll = Math.max(0, scrollTop - elementTop)

      // Update scroll position
      setScrollPosition(relativeScroll)

      // Get the bottom of the viewport relative to the container
      const viewportBottom = scrollTop + window.innerHeight
      const containerBottom = elementTop + element.offsetHeight

      // Calculate how close we are to the bottom of the loaded content
      // Start loading more when within 1000px of the bottom
      const distanceToBottom = containerBottom - viewportBottom

      if (distanceToBottom < 1000 && !isLoading && loadedCount < entries.length) {
        loadMoreEntries()
      }
    }
  }, [isLoading, loadedCount, entries.length, loadMoreEntries])

  // Reset when entries change (like when filters change)
  useEffect(() => {
    setLoadedCount(visibleItems)
    setIsLoading(false)

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
  }, [entries, visibleItems])

  // Set up scroll listener
  useEffect(() => {
    // Store the current handler in a ref to avoid removing/adding listeners unnecessarily
    scrollListenerRef.current = handleScroll

    const scrollHandler = () => {
      // Use requestAnimationFrame to avoid blocking the main thread
      requestAnimationFrame(() => {
        scrollListenerRef.current?.()
      })
    }

    // Set initial container height
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight)
    }

    window.addEventListener("scroll", scrollHandler, { passive: true })
    window.addEventListener("resize", scrollHandler, { passive: true })

    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("resize", scrollHandler)

      // Clear any existing timeout on unmount
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [handleScroll])

  // Explicitly load more entries (for button click)
  const loadMore = useCallback(() => {
    loadMoreEntries()
  }, [loadMoreEntries])

  return {
    containerRef,
    visibleEntries,
    totalHeight,
    paddingTop,
    isLoading,
    visibleRange,
    hasMore: loadedCount < entries.length,
    loadMore,
    progress: loadedCount / entries.length,
  }
}
