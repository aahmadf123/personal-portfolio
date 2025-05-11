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
    // For Netlify static builds, provide mock data
    if (process.env.NETLIFY === "true") {
      console.log("Using mock timeline data for Netlify static build");
      // Return a minimal set of timeline entries for static builds
      return [
        {
          id: "work-1",
          type: "work",
          title: "Software Engineering Intern",
          description: "Worked on full-stack development projects",
          organization: "Example Company",
          startDate: "2024-05-01",
          endDate: "2024-08-31",
          location: "Remote",
          tags: ["React", "TypeScript", "Node.js"],
        },
        {
          id: "education-1",
          type: "education",
          title: "Bachelor of Science, Computer Science",
          description: "Graduated with honors",
          organization: "University of Technology",
          startDate: "2020-09-01",
          endDate: "2024-05-15",
          location: "University Park, PA",
          tags: ["Computer Science", "Software Engineering"],
        },
        {
          id: "achievement-1",
          type: "achievement",
          title: "Best Student Project Award",
          description: "Awarded for innovative senior design project",
          organization: "Engineering Department",
          startDate: "2024-04-15",
          tags: ["Award", "Project"],
        },
      ];
    }

    // For non-Netlify builds, use the API
    // Use a relative URL path first
    const apiUrl = "/api/timeline";

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
