import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { validateRevalidationRequest } from "@/lib/revalidation-utils";

export const dynamic = "force-dynamic"; // Make this route dynamic

export async function POST(request: NextRequest) {
  try {
    // Validate the request using the new function
    const validationResult = await validateRevalidationRequest(request);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 401 }
      );
    }

    // Revalidate the timeline API and pages
    revalidatePath("/api/timeline");
    revalidatePath("/timeline");
    revalidatePath("/"); // Revalidate homepage which may show timeline entries

    return NextResponse.json({
      revalidated: true,
      message: "Timeline entries revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating timeline entries:", error);
    return NextResponse.json(
      { error: "Failed to revalidate timeline entries" },
      { status: 500 }
    );
  }
}
