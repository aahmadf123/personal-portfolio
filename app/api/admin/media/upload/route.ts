import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data with the file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const contentType =
      (formData.get("contentType") as string) ||
      file?.type ||
      "application/octet-stream";
    const userId = session.session.user.id;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed size (10MB)`,
        },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${nanoid()}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFilename}`;

    // Get file buffer
    const fileBuffer = await file.arrayBuffer();

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("media")
      .upload(filePath, fileBuffer, {
        contentType,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Error uploading file to Supabase Storage:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(data.path);

    // Store metadata in the media_metadata table
    const { error: metadataError } = await supabase
      .from("media_metadata")
      .insert({
        blob_id: data.path,
        metadata: {
          filename: file.name,
          size: file.size,
          contentType,
          uploadedBy: userId,
          originalName: file.name,
        },
      });

    if (metadataError) {
      console.error("Error storing file metadata:", metadataError);
      // Continue even if metadata storage fails
    }

    // Return the file information
    return NextResponse.json(
      {
        url: publicUrl,
        path: data.path,
        name: file.name,
        size: file.size,
        type: contentType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while uploading the file" },
      { status: 500 }
    );
  }
}
