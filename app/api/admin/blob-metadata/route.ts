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
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    // Get file metadata from Supabase Storage
    // First, determine the directory and file name
    const parts = path.split("/");
    const fileName = parts.pop() || "";
    const directory = parts.join("/");

    // List the files in the directory to get the one we want
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(directory);

    if (error) {
      console.error("Supabase storage list error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to get file metadata" },
        { status: 500 }
      );
    }

    // Find the file in the list
    const file = data.find((item) => item.name === fileName);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Get the public URL for the file
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: path,
      contentType: file.metadata?.mimetype || "application/octet-stream",
      size: file.metadata?.size || 0,
      uploadedAt: file.created_at || new Date().toISOString(),
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
