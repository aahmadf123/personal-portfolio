import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Singleton pattern for Supabase clients
let clientClientInstance: ReturnType<typeof createSupabaseClient> | null = null;

// Create a Supabase client that works in both client and server components
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key not found, using fallback values");
    return createSupabaseClient(
      "https://example.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.fallback-key-for-development"
    );
  }

  // Use singleton pattern for client-side to prevent multiple instances
  if (typeof window !== "undefined") {
    if (!clientClientInstance) {
      clientClientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);
    }
    return clientClientInstance;
  }

  // For server-side, create a new client each time
  // This is because server components might be rendered in parallel
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Create a server-side Supabase client (for server components and API routes)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or Service Key not found");
  }

  // For server contexts, always create a new client to avoid session conflicts
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
    },
  });
}

// Add the missing export
export const createClientSupabaseClient = createClient;

// Improved pool statistics function
export async function getPoolStats() {
  try {
    // Create a server-side Supabase client with admin permissions
    const supabase = createServerSupabaseClient();

    // Query actual connection pool statistics using pg_stat_activity
    const { data, error } = await supabase.sql(`
      SELECT 
        (SELECT count(*) FROM pg_stat_activity) as total_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'idle') as idle_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE wait_event_type = 'Lock') as waiting_connections,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
    `);

    if (error) {
      console.error("Error fetching pool stats:", error);
      throw error;
    }

    // Return actual pool statistics from query
    const stats = data?.[0] || {};
    return {
      totalCount: stats.total_connections || 0,
      idleCount: stats.idle_connections || 0,
      activeCount: stats.active_connections || 0,
      waitingCount: stats.waiting_connections || 0,
      maxConnections: stats.max_connections || 0,
    };
  } catch (err) {
    console.error("Failed to get actual pool stats:", err);
    // Fallback to default values in case of error
    return {
      totalCount: 0,
      idleCount: 0,
      activeCount: 0,
      waitingCount: 0,
      maxConnections: 20,
      error: "Could not retrieve connection statistics",
    };
  }
}
