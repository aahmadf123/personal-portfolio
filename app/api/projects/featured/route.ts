import { NextResponse } from "next/server";
import { getFeaturedProjects } from "@/lib/project-service";

// Set short revalidation time for dynamic data
export const revalidate = 0; // Disable ISR caching for development

// Generate static params for ISR
export const generateStaticParams = async () => {
  // Return a default limit for static generation
  return [{}];
};

export async function GET(request: Request) {
  console.log("Featured projects API route called");
  try {
    // Use a fixed limit for static generation
    // In Netlify static builds, we'll just use default limit=3
    let limit = 3;

    // Only try to parse URL in dynamic contexts
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NETLIFY !== "true"
    ) {
      try {
        const url = new URL(request.url);
        const limitParam = url.searchParams.get("limit");
        if (limitParam) {
          limit = parseInt(limitParam, 10);
        }
        console.log(`Request URL: ${url.toString()}, Limit: ${limit}`);
      } catch (e) {
        console.warn("URL parsing error:", e);
      }
    }

    // Get featured projects using project-service to maintain consistency
    console.log(`Fetching ${limit} featured projects...`);
    const featuredProjects = await getFeaturedProjects(limit);
    console.log(`Found ${featuredProjects.length} featured projects to return`);

    if (featuredProjects.length === 0) {
      console.log("No featured projects found in database");
    } else {
      console.log(
        "Featured projects:",
        featuredProjects.map((p) => p.title).join(", ")
      );
    }

    // No caching during development
    const headers =
      process.env.NODE_ENV === "production"
        ? { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
        : { "Cache-Control": "no-store" };

    return NextResponse.json(featuredProjects, { headers });
  } catch (error) {
    console.error("Error in featured projects API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch featured projects",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
