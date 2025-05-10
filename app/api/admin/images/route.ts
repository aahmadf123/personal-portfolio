import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This API endpoint previously used Vercel Blob storage
    // It needs to be reimplemented with a different storage solution
    return NextResponse.json(
      {
        error:
          "Blob storage functionality is currently unavailable. A new storage solution needs to be implemented.",
        message:
          "This endpoint previously used Vercel Blob storage which has been removed.",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error with blob storage:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Storage service error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This API endpoint previously used Vercel Blob storage
    // It needs to be reimplemented with a different storage solution
    return NextResponse.json(
      {
        error:
          "Blob storage functionality is currently unavailable. A new storage solution needs to be implemented.",
        message:
          "This endpoint previously used Vercel Blob storage which has been removed.",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error with blob storage:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Storage service error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This API endpoint previously used Vercel Blob storage
    // It needs to be reimplemented with a different storage solution
    return NextResponse.json(
      {
        error:
          "Blob storage functionality is currently unavailable. A new storage solution needs to be implemented.",
        message:
          "This endpoint previously used Vercel Blob storage which has been removed.",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error with blob storage:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Storage service error",
      },
      { status: 500 }
    );
  }
}
