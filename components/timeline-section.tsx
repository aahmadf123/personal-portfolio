"use client"

import { useState, useEffect } from "react"
import styles from "./timeline-section.module.css"
import { RefreshButton } from "@/components/ui/refresh-button"

interface TimelineEntry {
  id: number
  title: string
  description: string
  date: string
  organization?: string
  location?: string
  type: "education" | "experience" | "achievement"
}

export function TimelineSection() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchTimelineEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/timeline?limit=5")

      if (!response.ok) {
        throw new Error(`Failed to fetch timeline entries: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setEntries(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching timeline entries:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimelineEntries()
  }, [])

  return (
    <section id="timeline" className={styles.timelineSection}>
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className={styles.sectionTitle}>Professional Journey</h2>
          <div className="flex items-center gap-2">
            <RefreshButton contentType="timeline" onSuccess={fetchTimelineEntries} label="Refresh Timeline" />
            {lastUpdated && (
              <span className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
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
                  <div className={styles.timelineDate}>{new Date(entry.date).getFullYear()}</div>
                  <h3 className={styles.timelineTitle}>{entry.title}</h3>
                  {entry.organization && <div className={styles.timelineOrganization}>{entry.organization}</div>}
                  {entry.location && <div className={styles.timelineLocation}>{entry.location}</div>}
                  <p className={styles.timelineDescription}>{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>No timeline entries available.</p>
        )}
      </div>
    </section>
  )
}
