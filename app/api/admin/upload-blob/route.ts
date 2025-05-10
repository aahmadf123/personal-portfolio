import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const BUCKET_NAME = "portfolio-bucket";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getSession();

    if (!authData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate a unique filename with folder structure
    const timestamp = new Date().getTime();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const filename = `${folder}/${timestamp}-${originalName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filename,
      contentType: file.type,
      size: file.size,
      uploadedAt: new Date(),
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
