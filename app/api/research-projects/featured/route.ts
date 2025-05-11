import { NextResponse, type NextRequest } from "next/server";
import { getFeaturedResearchProjects } from "@/lib/research-project-service";

// Enable ISR instead of forcing dynamic
export const revalidate = 3600; // Revalidate every hour

// Generate static params for ISR
export const generateStaticParams = async () => {
  // Return default params for static generation
  return [{}];
};

export async function GET(request: NextRequest) {
  try {
    // Default limit for static generation
    let limit = 3;

    // Only try to parse URL params in dynamic contexts
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.NETLIFY !== "true"
    ) {
      try {
        const searchParams = request.nextUrl.searchParams;
        const limitParam = searchParams.get("limit");
        if (limitParam) {
          limit = Number.parseInt(limitParam, 10);
        }
      } catch (e) {
        console.warn("URL parsing skipped in static build context");
      }
    }

    const projects = await getFeaturedResearchProjects(limit);

    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching featured research projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured research projects" },
      { status: 500 }
    );
  }
}
