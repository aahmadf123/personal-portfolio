import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const BUCKET_NAME = "profolio-bucket";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getSession();

    if (!authData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";

    // List files from Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Supabase storage list error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to list files" },
        { status: 500 }
      );
    }

    // Get public URLs for each file
    const files = data
      .filter((item) => !item.id.endsWith("/"))
      .map((item) => {
        const path = prefix ? `${prefix}/${item.name}` : item.name;
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path);

        return {
          url: urlData.publicUrl,
          path: path,
          contentType: item.metadata?.mimetype || "application/octet-stream",
          size: item.metadata?.size || 0,
          uploadedAt: item.created_at || new Date().toISOString(),
        };
      });

    return NextResponse.json({
      files: files,
    });
  } catch (error) {
    console.error("Error with storage:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Storage service error",
      },
      { status: 500 }
    );
  }
}
