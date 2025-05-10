"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Calendar, Briefcase, Code, Award, BookOpen, Filter, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useVirtualizedTimeline } from "@/hooks/use-virtualized-timeline"
import { TimelineSkeleton } from "./timeline-skeleton"
import { TimelineDetail } from "./timeline-detail"

// Define timeline entry types
export type TimelineEntryType = "education" | "work" | "project" | "achievement"

export interface TimelineEntry {
  id: string
  type: TimelineEntryType
  title: string
  organization: string
  description: string
  startDate: string // Format: YYYY-MM
  endDate: string | "present" // Format: YYYY-MM or 'present'
  tags?: string[]
  link?: string
  icon?: React.ReactNode
}

interface TimelineProps {
  entries: TimelineEntry[]
  className?: string
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (dateString === "present") return "Present"

  const date = new Date(dateString + "-01") // Add day to make valid date
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
}

// Get icon based on entry type with appropriate colors
const getEntryIcon = (type: TimelineEntryType) => {
  switch (type) {
    case "education":
      return <BookOpen className="h-5 w-5 text-tertiary" />
    case "work":
      return <Briefcase className="h-5 w-5 text-quaternary" />
    case "project":
      return <Code className="h-5 w-5 text-secondary" />
    case "achievement":
      return <Award className="h-5 w-5 text-accent" />
    default:
      return <Calendar className="h-5 w-5" />
  }
}

// Animation variants for timeline entries - optimized for performance
const timelineEntryVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 20, // Reduced movement for better performance
    y: 10, // Reduced movement
    scale: 0.98, // Less extreme scale for better performance
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delayChildren: 0.1, // Reduced delay
      staggerChildren: 0.05, // Reduced stagger
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -20, // Reduced movement
    y: -10, // Reduced movement
    transition: {
      duration: 0.3, // Faster exit animation
    },
  }),
}

// Animation variants for timeline content elements - optimized
const contentVariants = {
  hidden: { opacity: 0, y: 5 }, // Reduced movement
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.2, // Faster animation
    },
  },
}

// Optimized filter button animation
const filterButtonVariants = {
  inactive: { scale: 1 },
  active: {
    scale: [1, 1.03, 1], // Reduced scale for better performance
    transition: {
      duration: 0.2, // Faster animation
      times: [0, 0.5, 1],
    },
  },
  tap: { scale: 0.97 }, // Less extreme scale
  hover: { scale: 1.03 }, // Less extreme scale
}

// Optimized quantum particle effect
const QuantumParticle = memo(({ delay = 0 }: { delay: number }) => {
  const prefersReducedMotion = useReducedMotion()

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return null
  }

  return (
    <motion.div
      className="absolute rounded-full bg-primary/40 backdrop-blur-sm z-0"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        scale: [0, 1, 0],
        x: [0, Math.random() * 40 - 20], // Reduced movement range
        y: [0, Math.random() * 40 - 20], // Reduced movement range
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      }}
      style={{
        width: Math.random() * 8 + 4, // Smaller particles
        height: Math.random() * 8 + 4, // Smaller particles
        willChange: "transform, opacity", // Hardware acceleration hint
      }}
    />
  )
})
QuantumParticle.displayName = "QuantumParticle"

// Memoized timeline entry component for better performance
const TimelineEntryItem = memo(
  ({
    entry,
    index,
    isEven,
    isInView,
    prefersReducedMotion,
  }: {
    entry: TimelineEntry
    index: number
    isEven: boolean
    isInView: boolean
    prefersReducedMotion: boolean
  }) => {
    // Optimize animations based on reduced motion preference
    const particleCount = prefersReducedMotion ? 0 : 2 // Fewer particles or none if reduced motion
    const animationDuration = prefersReducedMotion ? 0.5 : 3 // Shorter duration if reduced motion

    return (
      <motion.div
        key={entry.id}
        variants={timelineEntryVariants}
        custom={isEven ? 1 : -1}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={cn(
          "relative flex flex-col md:flex-row items-start gap-4",
          isEven ? "md:flex-row" : "md:flex-row-reverse",
        )}
        data-id={entry.id}
      >
        {/* Timeline dot with effects */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-7 h-7 rounded-full border-2 border-border bg-background flex items-center justify-center z-10 overflow-hidden">
          {!prefersReducedMotion && (
            <motion.div
              className={`absolute inset-0 bg-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"}/20`}
              animate={{
                scale: [1, 1.3, 1], // Reduced scale
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: animationDuration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          )}

          <motion.div
            className="relative z-10"
            animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
            transition={{
              duration: entry.type === "project" ? 30 : entry.type === "work" ? 40 : 50, // Slower rotation
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {getEntryIcon(entry.type)}
          </motion.div>

          {/* Quantum particles - reduced count */}
          {Array.from({ length: particleCount }).map((_, i) => (
            <QuantumParticle key={i} delay={i * 1.5} />
          ))}
        </div>

        {/* Timeline connector with pulse animation */}
        <motion.div
          className={`absolute left-[14px] md:left-1/2 top-7 bottom-0 w-0.5 bg-gradient-to-b from-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"}/80 via-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"}/50 to-transparent`}
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {!prefersReducedMotion && (
            <motion.div
              className={`absolute top-0 w-full h-12 bg-gradient-to-b from-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"} via-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"}/30 to-transparent`}
              animate={{
                y: [0, 100, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: animationDuration,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          )}
        </motion.div>

        {/* Date with floating animation */}
        <motion.div
          variants={contentVariants}
          className={cn("hidden md:block w-1/2 pt-1", isEven ? "text-right pr-8" : "text-left pl-8")}
        >
          <motion.span
            className={`inline-block px-3 py-1 rounded-full bg-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"}/10 text-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"} text-sm font-medium`}
            animate={prefersReducedMotion ? {} : { y: [0, 3, 0] }} // Reduced movement
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: index * 0.3,
            }}
          >
            {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
          </motion.span>
        </motion.div>

        {/* Content with glow effect on hover */}
        <motion.div
          variants={contentVariants}
          className={cn("w-full md:w-1/2 ml-10 md:ml-0 relative", isEven ? "md:pl-8" : "md:pr-8")}
          whileHover="hover"
        >
          <motion.div
            className={cn(
              "p-5 rounded-lg bg-background/50 backdrop-blur-sm border border-border shadow-md transition-all duration-300 relative overflow-hidden",
            )}
            whileHover={{
              boxShadow: "0 0 15px 1px rgba(var(--color-primary), 0.15)",
              y: -3,
              borderColor: "rgba(var(--color-primary), 0.3)",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            style={{
              willChange: "transform, box-shadow",
            }}
          >
            {/* Glow effect - only if not reduced motion */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 -z-10"
                initial={{ opacity: 0, x: -100 }}
                whileHover={{ opacity: 1, x: 200 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              />
            )}

            {/* Mobile date display */}
            <div className="block md:hidden mb-2">
              <span
                className={`inline-block px-2 py-0.5 rounded-full bg-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"}/10 text-${entry.type === "education" ? "tertiary" : entry.type === "work" ? "quaternary" : entry.type === "project" ? "secondary" : "accent"} text-xs font-medium`}
              >
                {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <motion.h3 className="text-lg font-bold text-foreground" variants={contentVariants}>
                {entry.title}
              </motion.h3>
              <motion.span
                variants={contentVariants}
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                  entry.type === "education" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                  entry.type === "work" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                  entry.type === "project" &&
                    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                  entry.type === "achievement" &&
                    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                )}
              >
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </motion.span>
            </div>

            <motion.p className="text-sm font-medium text-primary mt-1" variants={contentVariants}>
              {entry.organization}
            </motion.p>

            <motion.p className="mt-2 text-sm text-muted-foreground" variants={contentVariants}>
              {entry.description}
            </motion.p>

            {/* Tags with staggered animation */}
            {entry.tags && entry.tags.length > 0 && (
              <motion.div className="flex flex-wrap gap-1 mt-3" variants={contentVariants}>
                {entry.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9, y: 5 }} // Reduced movement
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + tagIndex * 0.05, // Reduced delay
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      duration: 0.2, // Faster animation
                    }}
                    className="inline-block px-2 py-0.5 rounded-full bg-background text-xs text-muted-foreground border border-border"
                    whileHover={{
                      backgroundColor: "rgba(var(--color-primary), 0.2)",
                      color: "rgb(var(--color-primary))",
                      y: -1, // Reduced movement
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {/* Expandable detail instead of external link */}
            {entry.link && <TimelineDetail entry={entry} />}
          </motion.div>
        </motion.div>
      </motion.div>
    )
  },
)
TimelineEntryItem.displayName = "TimelineEntryItem"

// Main timeline component
export function InteractiveTimeline({ entries, className }: TimelineProps) {
  const [activeFilters, setActiveFilters] = useState<TimelineEntryType[]>([
    "education",
    "work",
    "project",
    "achievement",
  ])
  const prefersReducedMotion = useReducedMotion()
  const [inViewStates, setInViewStates] = useState<Record<string, boolean>>({})

  // Memoize filtered entries to prevent unnecessary recalculations
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => activeFilters.includes(entry.type))
      .sort((a, b) => {
        // Sort by date (most recent first)
        const dateA = a.endDate === "present" ? new Date().toISOString() : a.endDate
        const dateB = b.endDate === "present" ? new Date().toISOString() : b.endDate
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })
  }, [activeFilters, entries])

  // Use virtualized timeline hook with enhanced uninterrupted scrolling
  const { containerRef, visibleEntries, totalHeight, isLoading, visibleRange, hasMore, loadMore, progress } =
    useVirtualizedTimeline({
      entries: filteredEntries,
      itemHeight: 250, // Approximate height of each timeline entry
      overscan: 3, // Increased overscan for smoother scrolling
      visibleItems: 5, // Start with more visible items
      loadingDelay: 200, // Shorter loading delay for better responsiveness
    })

  // Use IntersectionObserver for better performance
  useEffect(() => {
    // Skip if browser doesn't support IntersectionObserver
    if (!("IntersectionObserver" in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        const updates: Record<string, boolean> = {}

        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id")
          if (id) {
            updates[id] = entry.isIntersecting
          }
        })

        if (Object.keys(updates).length > 0) {
          setInViewStates((prev) => ({ ...prev, ...updates }))
        }
      },
      {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: "0px 0px -10% 0px", // Slightly before entering viewport
      },
    )

    // Observe all timeline entries
    const elements = document.querySelectorAll("[data-id]")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [visibleEntries])

  // Toggle filter - memoized callback
  const toggleFilter = useCallback((type: TimelineEntryType) => {
    setActiveFilters((prev) => {
      if (prev.includes(type)) {
        // Don't allow removing the last filter
        if (prev.length > 1) {
          return prev.filter((t) => t !== type)
        }
        return prev
      } else {
        return [...prev, type]
      }
    })
  }, [])

  return (
    <div className={cn("w-full", className)}>
      {/* Filter controls */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="flex items-center gap-2 mr-2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  x: [0, 3, 0], // Reduced movement
                  rotateZ: [0, 3, 0], // Reduced rotation
                }
          }
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Filter:</span>
        </motion.div>

        {/* Filter buttons - with different colors for each type */}
        {[
          { type: "education", icon: <BookOpen className="h-4 w-4" />, label: "Education", color: "tertiary" },
          { type: "work", icon: <Briefcase className="h-4 w-4" />, label: "Work", color: "quaternary" },
          { type: "project", icon: <Code className="h-4 w-4" />, label: "Projects", color: "secondary" },
          { type: "achievement", icon: <Award className="h-4 w-4" />, label: "Achievements", color: "accent" },
        ].map(({ type, icon, label, color }) => (
          <motion.button
            key={type}
            onClick={() => toggleFilter(type as TimelineEntryType)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all relative",
              activeFilters.includes(type as TimelineEntryType)
                ? `bg-${color}/20 text-${color} border border-${color}/30`
                : "bg-background/80 text-muted-foreground border border-border hover:bg-background",
            )}
            variants={filterButtonVariants}
            animate={activeFilters.includes(type as TimelineEntryType) ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
          >
            {icon}
            <span>{label}</span>

            {activeFilters.includes(type as TimelineEntryType) && !prefersReducedMotion && (
              <motion.span
                layoutId={`${type}-active-pill`}
                className={`absolute inset-0 rounded-full bg-${color}/5`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Timeline entries with virtualization */}
      <div
        className="relative"
        ref={containerRef}
        style={{
          minHeight: `${Math.min(totalHeight, visibleEntries.length * 250)}px`,
          position: "relative",
          // Set a minimum height to ensure scrollbar appears immediately
          height: filteredEntries.length > 0 ? "auto" : "500px",
        }}
      >
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20"></div>

        {/* Virtualized timeline entries */}
        <div>
          <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
              <motion.div className="space-y-12 relative" initial="hidden" animate="visible" exit="exit">
                {visibleEntries.length > 0 ? (
                  visibleEntries.map((entry, index) => {
                    const isEven = index % 2 === 0
                    const isInView = inViewStates[entry.id] || false

                    return (
                      <TimelineEntryItem
                        key={entry.id}
                        entry={entry}
                        index={index}
                        isEven={isEven}
                        isInView={isInView}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    )
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center mb-4 border border-border">
                      <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No entries match your filters</h3>
                    <p className="text-sm text-muted-foreground mt-1">Try selecting different filter options</p>
                  </motion.div>
                )}

                {/* Loading indicator and skeleton loaders - always at the bottom */}
                {isLoading && (
                  <div className="space-y-12">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <TimelineSkeleton key={`skeleton-${i}`} isEven={i % 2 === 0} />
                    ))}
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </MotionConfig>
        </div>

        {/* Load more button - only show when there's more to load and not currently loading */}
        {hasMore && !isLoading && (
          <motion.button
            onClick={loadMore}
            className="mx-auto mt-8 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-md hover:bg-muted transition-all z-10"
            aria-label="Load more entries"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 10px 1px rgba(var(--color-primary), 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Load more</span>
            {!prefersReducedMotion ? (
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              >
                <ChevronDown className="h-4 w-4 text-primary" />
              </motion.div>
            ) : (
              <ChevronDown className="h-4 w-4 text-primary" />
            )}
          </motion.button>
        )}
      </div>

      {/* Timeline progress indicator */}
      {filteredEntries.length > 0 && (
        <motion.div
          className="mt-16 flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Progress bar */}
          <div className="w-full max-w-md h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Progress text */}
          <p className="text-xs text-muted-foreground">
            Showing {visibleEntries.length} of {filteredEntries.length} entries
          </p>
        </motion.div>
      )}
    </div>
  )
}
