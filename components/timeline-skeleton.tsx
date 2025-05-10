"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineSkeletonProps {
  isEven: boolean
}

export function TimelineSkeleton({ isEven }: TimelineSkeletonProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col md:flex-row items-start gap-4",
        isEven ? "md:flex-row" : "md:flex-row-reverse",
      )}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-7 h-7 rounded-full border-2 border-primary/40 bg-background/80 flex items-center justify-center z-10">
        <motion.div
          className="w-4 h-4 rounded-full bg-primary/30"
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      {/* Timeline connector */}
      <div className="absolute left-[14px] md:left-1/2 top-7 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/30 to-transparent" />

      {/* Date placeholder */}
      <div className={cn("hidden md:block w-1/2 pt-1", isEven ? "text-right pr-8" : "text-left pl-8")}>
        <div className="inline-block w-32 h-6 rounded-full bg-primary/10 animate-pulse" />
      </div>

      {/* Content placeholder */}
      <div className={cn("w-full md:w-1/2 ml-10 md:ml-0", isEven ? "md:pl-8" : "md:pr-8")}>
        <div className="p-5 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm">
          {/* Mobile date placeholder */}
          <div className="block md:hidden mb-2">
            <div className="w-24 h-4 rounded-full bg-primary/10 animate-pulse" />
          </div>

          {/* Title and badge placeholder */}
          <div className="flex items-start justify-between mb-2">
            <div className="w-40 h-6 rounded-md bg-muted animate-pulse" />
            <div className="w-16 h-5 rounded-md bg-blue-100/50 dark:bg-blue-900/20 animate-pulse" />
          </div>

          {/* Organization placeholder */}
          <div className="w-32 h-4 mt-1 rounded-md bg-primary/10 animate-pulse" />

          {/* Description placeholder */}
          <div className="mt-3 space-y-2">
            <div className="w-full h-3 rounded-md bg-muted/60 animate-pulse" />
            <div className="w-5/6 h-3 rounded-md bg-muted/60 animate-pulse" />
            <div className="w-4/6 h-3 rounded-md bg-muted/60 animate-pulse" />
          </div>

          {/* Tags placeholder */}
          <div className="flex flex-wrap gap-1 mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-5 rounded-full bg-background/80 border border-border/50 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
