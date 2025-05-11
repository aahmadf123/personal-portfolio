import type { Metadata } from "next";
import { OptimizedTimeline } from "@/components/optimized-timeline";
import { TimelineErrorBoundary } from "@/components/error-boundaries/timeline-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Timeline | My Professional Journey",
  description:
    "Explore my professional journey, education, work experience, projects, and achievements in an interactive timeline.",
};

// Set revalidation period to 24 hours
export const revalidate = 86400;

async function getTimelineEntries() {
  try {
    // Use a different URL approach for Netlify builds
    let apiUrl = "/api/timeline";

    // For Netlify builds, we need to ensure URL parsing works
    if (process.env.NETLIFY === "true") {
      // Add base URL for static builds to avoid URL parsing errors
      apiUrl = "http://localhost/api/timeline";
    }

    // Fetch timeline data from API
    const res = await fetch(apiUrl, {
      next: { revalidate: 86400 }, // Use ISR with 24 hour revalidation
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch timeline data: ${res.status}`);
    }

    const data = await res.json();

    // Validate that we received an array
    if (!Array.isArray(data)) {
      console.error("Timeline data is not an array:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching timeline entries:", error);
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
}

export default async function TimelinePage() {
  try {
    const timelineEntries = await getTimelineEntries();

    return (
      <main className="container max-w-5xl py-12 px-4 sm:px-6">
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">My Journey</h1>
          <p className="text-xl text-muted-foreground">
            Explore my professional timeline, from education and work experience
            to projects and achievements.
          </p>
        </div>

        <TimelineErrorBoundary>
          {timelineEntries && timelineEntries.length > 0 ? (
            <OptimizedTimeline entries={timelineEntries} />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No timeline entries found</AlertTitle>
              <AlertDescription>
                There are currently no entries to display in the timeline.
              </AlertDescription>
            </Alert>
          )}
        </TimelineErrorBoundary>
      </main>
    );
  } catch (error) {
    // This will render our error boundary
    return (
      <main className="container max-w-5xl py-12 px-4 sm:px-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading timeline</AlertTitle>
          <AlertDescription>
            There was a problem loading the timeline data.
          </AlertDescription>
        </Alert>
      </main>
    );
  }
}
