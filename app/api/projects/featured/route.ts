import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit") as string)
      : 3;

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        title,
        slug,
        description,
        summary,
        thumbnail_url,
        main_image_url,
        image_url,
        github_url,
        demo_url,
        is_featured,
        status,
        completion,
        start_date,
        end_date,
        tags,
        technologies
      `
      )
      .eq("is_featured", true)
      .order("priority", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the data to help with debugging
    console.log("Featured projects from database:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in featured projects API:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}
