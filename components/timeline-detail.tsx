"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import type { TimelineEntry } from "@/components/optimized-timeline";

interface TimelineDetailProps {
  entry: TimelineEntry;
  onClose: () => void;
}

export function TimelineDetail({ entry, onClose }: TimelineDetailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card w-full max-w-2xl rounded-lg shadow-lg border border-border overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {entry.image && (
          <div className="relative w-full h-48 bg-muted">
            <motion.img
              src={entry.image}
              alt={entry.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{entry.title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-2 text-muted-foreground">
            <div className="font-medium text-foreground">
              {entry.organization}
            </div>
            <div>
              {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
            </div>
            {entry.location && <div>{entry.location}</div>}
          </div>

          <div className="mt-4">
            <p className="whitespace-pre-line">{entry.description}</p>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Technologies & Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entry.link && (
            <div className="mt-6">
              <a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Visit website <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
