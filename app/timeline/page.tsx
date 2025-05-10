import type { Metadata } from "next"
import { OptimizedTimeline } from "@/components/optimized-timeline"
import { timelineData } from "@/data/timeline-data"

export const metadata: Metadata = {
  title: "Timeline | My Professional Journey",
  description:
    "Explore my professional journey, education, work experience, projects, and achievements in an interactive timeline.",
}

export default function TimelinePage() {
  return (
    <main className="container max-w-5xl py-12 px-4 sm:px-6">
      <div className="space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">My Journey</h1>
        <p className="text-xl text-muted-foreground">
          Explore my professional timeline, from education and work experience to projects and achievements.
        </p>
      </div>

      <OptimizedTimeline entries={timelineData} />
    </main>
  )
}
