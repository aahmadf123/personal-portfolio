import { NextResponse } from "next/server";
import { getPoolStats } from "@/lib/supabase";
import { DB_POOL_CONFIG } from "@/lib/db-pool-config";

// Mark as dynamic to prevent static generation issues
export const dynamic = "force-dynamic";

// Provide a static fallback for Netlify builds
export const generateStaticParams = async () => {
  return [{}];
};

export async function GET() {
  // For static builds, return dummy data
  if (process.env.NETLIFY === "true" && process.env.CONTEXT === "production") {
    return NextResponse.json({
      totalCount: 0,
      idleCount: 0,
      waitingCount: 0,
      activeCount: 0,
      maxConnections: DB_POOL_CONFIG.max || 20,
      note: "Static build - actual stats available in runtime mode",
    });
  }

  try {
    // Get the current pool statistics
    const stats = await getPoolStats();

    // Return the stats along with the max connections from config
    return NextResponse.json({
      ...stats,
      maxConnections: DB_POOL_CONFIG.max,
    });
  } catch (error) {
    console.error("Failed to get actual pool stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch database pool statistics",
        totalCount: 0,
        idleCount: 0,
        waitingCount: 0,
        activeCount: 0,
        maxConnections: DB_POOL_CONFIG.max || 20,
      },
      { status: 200 }
    );
  }
}
