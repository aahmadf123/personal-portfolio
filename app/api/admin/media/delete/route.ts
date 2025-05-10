import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get file path from request body
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Delete file from Supabase Storage
    const { error } = await supabase.storage.from("media").remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Delete metadata entry
    const { error: metadataError } = await supabase
      .from("media_metadata")
      .delete()
      .eq("blob_id", path);

    if (metadataError) {
      console.error("Error deleting file metadata:", metadataError);
      // Continue even if metadata deletion fails
    }

    return NextResponse.json({
      message: "File deleted successfully",
      path,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while deleting the file" },
      { status: 500 }
    );
  }
}
