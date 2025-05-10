import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const BUCKET_NAME = "portfolio-bucket";

export async function DELETE(request: NextRequest) {
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

    // Delete file from Supabase Storage
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error("Supabase storage delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
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
