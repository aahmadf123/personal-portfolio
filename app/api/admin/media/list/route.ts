import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const folder = url.searchParams.get("folder") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    // List files from the specified folder
    const { data, error } = await supabase.storage.from("media").list(folder, {
      limit,
      offset,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("Error listing files:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch metadata for each file
    const filesWithMetadata = await Promise.all(
      data.map(async (file) => {
        const filePath = folder ? `${folder}/${file.name}` : file.name;

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(filePath);

        // Try to get metadata
        const { data: metadata } = await supabase
          .from("media_metadata")
          .select("metadata")
          .eq("blob_id", filePath)
          .maybeSingle();

        return {
          ...file,
          path: filePath,
          url: publicUrl,
          metadata: metadata?.metadata || {},
        };
      })
    );

    return NextResponse.json({
      files: filesWithMetadata,
      folder,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while listing files" },
      { status: 500 }
    );
  }
}
