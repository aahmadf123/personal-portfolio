import { NextResponse } from "next/server"
import { getPoolStats } from "@/lib/supabase"
import { DB_POOL_CONFIG } from "@/lib/db-pool-config"

export async function GET() {
  try {
    // Get the current pool statistics
    const stats = getPoolStats()

    // Return the stats along with the max connections from config
    return NextResponse.json({
      ...stats,
      maxConnections: DB_POOL_CONFIG.max,
    })
  } catch (error) {
    console.error("Error fetching database pool stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch database pool statistics",
        totalCount: 0,
        idleCount: 0,
        waitingCount: 0,
        maxConnections: DB_POOL_CONFIG.max,
      },
      { status: 200 },
    )
  }
}
