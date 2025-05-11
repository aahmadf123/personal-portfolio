import { NextResponse } from "next/server";
import { verifyStorageConfig } from "@/lib/storage-utils";
import { DEFAULT_BUCKET_NAME } from "@/lib/env-check";

/**
 * API route to check storage configuration
 * GET /api/debug/storage-check
 */
export async function GET() {
  try {
    // Get storage configuration details
    const storageDetails = await verifyStorageConfig();

    // Add environment information
    const configInfo = {
      bucketName: DEFAULT_BUCKET_NAME,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      environment: process.env.NODE_ENV || "development",
    };

    return NextResponse.json({
      success: true,
      message: "Storage configuration check completed",
      storageDetails,
      configInfo,
    });
  } catch (error) {
    console.error("Error in storage check API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking storage configuration",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
