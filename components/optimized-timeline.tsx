"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  Code,
  Award,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { throttle } from "@/lib/performance-utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define timeline entry types
export type TimelineEntryType =
  | "education"
  | "work"
  | "project"
  | "achievement";

export interface TimelineEntry {
  id: string;
  type: TimelineEntryType;
  title: string;
  organization: string;
  description: string;
  startDate: string; // Format: YYYY-MM
  endDate: string | "present"; // Format: YYYY-MM or 'present'
  tags?: string[];
  link?: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
  initialVisibleCount?: number;
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (dateString === "present") return "Present";

  try {
    // Handle YYYY-MM-DD or YYYY-MM formats
    const date = new Date(
      dateString.includes("-") && dateString.split("-").length === 2
        ? `${dateString}-01` // Add day if only YYYY-MM is provided
        : dateString
    );

    // Format to "Aug 2025" style
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch (e) {
    console.error("Date formatting error:", e, dateString);
    return dateString;
  }
};

// Get icon based on entry type
const getEntryIcon = (type: TimelineEntryType) => {
  switch (type) {
    case "education":
      return <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    case "work":
      return (
        <Briefcase className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      );
    case "project":
      return <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
    case "achievement":
      return <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
    default:
      return <Calendar className="h-5 w-5" />;
  }
};

// Get color based on entry type
const getEntryColor = (type: TimelineEntryType) => {
  switch (type) {
    case "education":
      return "blue";
    case "work":
      return "emerald";
    case "project":
      return "purple";
    case "achievement":
      return "amber";
    default:
      return "gray";
  }
};

// Timeline entry component
const TimelineEntry = ({
  entry,
  index,
  isExpanded,
  toggleExpand,
}: {
  entry: TimelineEntry;
  index: number;
  isExpanded: boolean;
  toggleExpand: () => void;
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isEven = index % 2 === 0;
  const color = getEntryColor(entry.type);

  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
      x: prefersReducedMotion ? 0 : isEven ? -5 : 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : (index * 0.1) % 0.5, // Stagger but reset every 5 items
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        "relative flex flex-col md:flex-row items-start gap-4 pb-8",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full border-2 border-border bg-background flex items-center justify-center z-10">
        <motion.div
          className="flex items-center justify-center"
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {getEntryIcon(entry.type)}
        </motion.div>
      </div>

      {/* Timeline connector */}
      <motion.div
        className={cn(
          "absolute left-4 md:left-1/2 top-8 bottom-0 w-0.5",
          `bg-${color}-200 dark:bg-${color}-900`
        )}
        initial={{ height: 0 }}
        animate={{ height: "calc(100% - 2rem)" }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Date */}
      <div
        className={cn(
          "hidden md:block w-1/2 pt-1",
          isEven ? "text-right pr-8" : "text-left pl-8"
        )}
      >
        <motion.span
          className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-medium",
            `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300`
          )}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
        </motion.span>
      </div>

      {/* Content */}
      <div
        className={cn(
          "w-full md:w-1/2 ml-10 md:ml-0",
          isEven ? "md:pl-8" : "md:pr-8"
        )}
      >
        <motion.div
          className="relative"
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Card
            className={cn(
              "p-5 overflow-hidden border-t-4",
              `border-t-${color}-500 dark:border-t-${color}-400`
            )}
          >
            {/* Mobile date display */}
            <div className="block md:hidden mb-2">
              <span
                className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                  `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300`
                )}
              >
                {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {entry.title}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300 border-${color}-200 dark:border-${color}-800`
                )}
              >
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </Badge>
            </div>

            <p className="text-sm font-medium text-primary mt-1">
              {entry.organization}
            </p>

            <motion.div
              className="mt-2 text-sm text-muted-foreground"
              initial={{
                height: isExpanded ? "auto" : "4.5rem",
                overflow: "hidden",
              }}
              animate={{
                height: isExpanded ? "auto" : "4.5rem",
                overflow: "hidden",
              }}
              transition={{ duration: 0.3 }}
            >
              <p>{entry.description}</p>
            </motion.div>

            {/* Expand/collapse button */}
            {entry.description.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpand}
                className="mt-2 text-xs flex items-center gap-1 hover:bg-transparent hover:text-primary p-0"
              >
                {isExpanded ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </Button>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {entry.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + tagIndex * 0.05 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="inline-block px-2 py-0.5 rounded-full bg-background text-xs text-muted-foreground border border-border"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}

            {/* External link */}
            {entry.link && (
              <motion.a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center mt-3 text-xs font-medium hover:underline",
                  `text-${color}-600 dark:text-${color}-400`
                )}
                whileHover={{ x: 3 }}
              >
                Learn more
                <ExternalLink className="h-3 w-3 ml-1" />
              </motion.a>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main timeline component
export function OptimizedTimeline({
  entries,
  className,
  initialVisibleCount = 5,
}: TimelineProps) {
  const [activeFilters, setActiveFilters] = useState<TimelineEntryType[]>([
    "education",
    "work",
    "project",
    "achievement",
  ]);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [expandedEntries, setExpandedEntries] = useState<
    Record<string, boolean>
  >({});
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Filter entries based on active filters
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => activeFilters.includes(entry.type))
      .sort((a, b) => {
        // Sort by date (most recent first)
        const dateA =
          a.endDate === "present" ? new Date().toISOString() : a.endDate;
        const dateB =
          b.endDate === "present" ? new Date().toISOString() : b.endDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  }, [entries, activeFilters]);

  // Visible entries based on current count
  const visibleEntries = useMemo(() => {
    return filteredEntries.slice(0, visibleCount);
  }, [filteredEntries, visibleCount]);

  // Toggle filter
  const toggleFilter = useCallback((type: TimelineEntryType) => {
    setActiveFilters((prev) => {
      if (prev.includes(type)) {
        // Don't allow removing the last filter
        if (prev.length > 1) {
          return prev.filter((t) => t !== type);
        }
        return prev;
      } else {
        return [...prev, type];
      }
    });
  }, []);

  // Toggle expanded state for an entry
  const toggleExpand = useCallback((id: string) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  // Load more entries
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 5, filteredEntries.length));
  }, [filteredEntries.length]);

  // Check if scroll is near bottom to load more
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const isNearBottom = rect.bottom <= window.innerHeight + 300;

        if (isNearBottom && visibleCount < filteredEntries.length) {
          loadMore();
        }
      }, 200),
    [loadMore, visibleCount, filteredEntries.length]
  );

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={cn("w-full", className)} ref={timelineRef}>
      {/* Filter controls */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mr-2">
          <span className="text-sm font-medium">Filter:</span>
        </div>

        {/* Filter buttons */}
        {[
          {
            type: "education",
            icon: <BookOpen className="h-4 w-4" />,
            label: "Education",
            color: "blue",
          },
          {
            type: "work",
            icon: <Briefcase className="h-4 w-4" />,
            label: "Work",
            color: "emerald",
          },
          {
            type: "project",
            icon: <Code className="h-4 w-4" />,
            label: "Projects",
            color: "purple",
          },
          {
            type: "achievement",
            icon: <Award className="h-4 w-4" />,
            label: "Achievements",
            color: "amber",
          },
        ].map(({ type, icon, label, color }) => (
          <motion.button
            key={type}
            onClick={() => toggleFilter(type as TimelineEntryType)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all",
              activeFilters.includes(type as TimelineEntryType)
                ? cn(
                    `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-800`
                  )
                : "bg-background text-muted-foreground border border-border hover:bg-muted"
            )}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {icon}
            <span>{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Timeline entries */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-border"></div>

        {/* Timeline entries */}
        <AnimatePresence mode="wait">
          {visibleEntries.length > 0 ? (
            <motion.div
              className="space-y-8 relative"
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {visibleEntries.map((entry, index) => (
                <TimelineEntry
                  key={entry.id}
                  entry={entry}
                  index={index}
                  isExpanded={!!expandedEntries[entry.id]}
                  toggleExpand={() => toggleExpand(entry.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <h3 className="text-lg font-medium text-foreground">
                No entries match your filters
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try selecting different filter options
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more button */}
        {visibleCount < filteredEntries.length && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={loadMore}
              variant="outline"
              className="flex items-center gap-2"
            >
              Load more
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, 3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Progress indicator */}
      {filteredEntries.length > 0 && (
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Progress bar */}
          <div className="w-full max-w-md h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{
                width: `${(visibleCount / filteredEntries.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Progress text */}
          <p className="text-xs text-muted-foreground">
            Showing {visibleCount} of {filteredEntries.length} entries
          </p>
        </motion.div>
      )}
    </div>
  );
}
