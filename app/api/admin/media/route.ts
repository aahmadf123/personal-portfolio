import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const BUCKET_NAME = "portfolio-bucket";
const MEDIA_FOLDER = "media";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getSession();

    if (!authData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // List files from the media folder in Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(MEDIA_FOLDER, {
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("Supabase storage list error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to list media files" },
        { status: 500 }
      );
    }

    // Get public URLs for each file and format the response
    const mediaItems = data
      .filter((item) => !item.id.endsWith("/")) // Filter out folders
      .map((item) => {
        const path = `${MEDIA_FOLDER}/${item.name}`;
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path);

        const filename = item.name.substring(item.name.indexOf("-") + 1);

        return {
          id: path,
          url: urlData.publicUrl,
          pathname: path,
          filename: filename,
          contentType: item.metadata?.mimetype || "application/octet-stream",
          size: item.metadata?.size || 0,
          createdAt: item.created_at || new Date().toISOString(),
          ...(item.metadata?.mimetype?.startsWith("image/")
            ? {
                width: item.metadata?.width || 0,
                height: item.metadata?.height || 0,
              }
            : {}),
        };
      });

    return NextResponse.json(mediaItems);
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
