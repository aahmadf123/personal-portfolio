import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const BUCKET_NAME = "portfolio-bucket";

type Props = {
  params: {
    id: string;
  };
};

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getSession();

    if (!authData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Decode the ID as it might be URL encoded
    const decodedPath = decodeURIComponent(id);

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([decodedPath]);

    if (error) {
      console.error("Supabase storage delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete media" },
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
