import { createClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { formatDistanceToNow } from "date-fns"

export async function GET() {
  try {
    // Check database connection
    const supabase = createClient()
    const { error: dbError } = await supabase.from("projects").select("id").limit(1)

    const dbStatus = {
      name: "Database Connection",
      status: dbError ? "error" : "healthy",
      message: dbError ? "Connection failed" : "Connected successfully",
      lastChecked: formatDistanceToNow(new Date(), { addSuffix: true }),
    }

    // Check if Supabase is configured correctly
    const supabaseConfigured = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY

    const supabaseStatus = {
      name: "Supabase Configuration",
      status: supabaseConfigured ? "healthy" : "error",
      message: supabaseConfigured ? "Configured correctly" : "Missing environment variables",
      lastChecked: formatDistanceToNow(new Date(), { addSuffix: true }),
    }

    // Check if Blob storage is configured
    const blobConfigured = process.env.BLOB_READ_WRITE_TOKEN

    const blobStatus = {
      name: "Blob Storage",
      status: blobConfigured ? "healthy" : "warning",
      message: blobConfigured ? "Configured correctly" : "Missing environment variables",
      lastChecked: formatDistanceToNow(new Date(), { addSuffix: true }),
    }

    // Check API endpoints
    let apiStatus = "healthy"
    let apiMessage = "API endpoints are functioning"

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/projects`)
      if (!response.ok) {
        apiStatus = "warning"
        apiMessage = "Some API endpoints may not be functioning correctly"
      }
    } catch (error) {
      apiStatus = "error"
      apiMessage = "API endpoints check failed"
    }

    const apiEndpointStatus = {
      name: "API Endpoints",
      status: apiStatus,
      message: apiMessage,
      lastChecked: formatDistanceToNow(new Date(), { addSuffix: true }),
    }

    return NextResponse.json([dbStatus, supabaseStatus, blobStatus, apiEndpointStatus])
  } catch (error) {
    console.error("Error checking system status:", error)
    return NextResponse.json(
      [
        {
          name: "System Status",
          status: "error",
          message: "Failed to check system status",
          lastChecked: formatDistanceToNow(new Date(), { addSuffix: true }),
        },
      ],
      { status: 500 },
    )
  }
}
