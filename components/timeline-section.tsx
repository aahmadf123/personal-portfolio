"use client";

import { useState, useEffect } from "react";
import styles from "./timeline-section.module.css";
import { RefreshButton } from "@/components/ui/refresh-button";
import { AlertCircle } from "lucide-react";

interface TimelineEntry {
  id: string | number;
  type: "education" | "work" | "project" | "achievement";
  title: string;
  description: string;
  organization?: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  tags?: string[];
  image?: string | null;
  link?: string | null;
}

export function TimelineSection() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTimelineEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the latest 5 entries from the timeline API
      const response = await fetch("/api/timeline?limit=5", {
        // Add cache: 'no-store' to always get fresh data
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch timeline entries: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setEntries(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching timeline entries:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineEntries();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      if (dateString === "present") return "Present";

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

  return (
    <section id="timeline" className={styles.timelineSection}>
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className={styles.sectionTitle}>Professional Journey</h2>
          <div className="flex items-center gap-2">
            <RefreshButton
              contentType="timeline"
              onSuccess={fetchTimelineEntries}
              label="Refresh Timeline"
            />
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className={styles.timelineSkeleton}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.timelineItemSkeleton}></div>
            ))}
          </div>
        ) : entries.length > 0 ? (
          <div className={styles.timeline}>
            {entries.map((entry, index) => (
              <div key={entry.id} className={styles.timelineItem}>
                <div className={styles.timelineMarker}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineDate}>
                    {formatDate(entry.startDate)}
                    {entry.endDate && entry.endDate !== "present"
                      ? ` - ${formatDate(entry.endDate)}`
                      : entry.endDate === "present"
                      ? " - Present"
                      : ""}
                  </div>
                  <h3 className={styles.timelineTitle}>{entry.title}</h3>
                  {entry.organization && (
                    <div className={styles.timelineOrganization}>
                      {entry.organization}
                    </div>
                  )}
                  {entry.location && (
                    <div className={styles.timelineLocation}>
                      {entry.location}
                    </div>
                  )}
                  <p className={styles.timelineDescription}>
                    {entry.description}
                  </p>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className={styles.timelineTags}>
                      {entry.tags.map((tag) => (
                        <span key={tag} className={styles.timelineTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.timelineLink}
                    >
                      Learn more
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>No timeline entries available.</p>
        )}
      </div>
    </section>
  );
}
