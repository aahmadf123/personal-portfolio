import { EventEmitter } from "events";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createClientServer } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Increase max listeners to prevent warning during Netlify builds
EventEmitter.defaultMaxListeners = 20;

// Singleton pattern for Supabase clients
let clientClientInstance: ReturnType<typeof createSupabaseClient> | null = null;

// Create a Supabase client that works in both client and server components
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use service role key for server-side operations, especially during build
  const isServer = typeof window === "undefined";
  const isNetlifyBuild = process.env.NETLIFY === "true";

  // For server contexts or Netlify builds, prioritize using the service role key
  const supabaseKey =
    isServer || isNetlifyBuild
      ? process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
      : supabaseAnonKey;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key not found, using fallback values");
    return createSupabaseClient(
      "https://example.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.fallback-key-for-development"
    );
  }

  // Use singleton pattern for client-side to prevent multiple instances
  if (typeof window !== "undefined") {
    if (!clientClientInstance) {
      clientClientInstance = createSupabaseClient(supabaseUrl, supabaseKey);
    }
    return clientClientInstance;
  }

  // For server-side, create a new client each time
  // This is because server components might be rendered in parallel
  return createSupabaseClient(supabaseUrl, supabaseKey);
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
  // Skip actual database queries during static builds
  if (process.env.NETLIFY === "true" && process.env.CONTEXT === "production") {
    return {
      totalCount: 0,
      idleCount: 0,
      activeCount: 0,
      waitingCount: 0,
      maxConnections: 20,
      note: "Static build - actual stats available in runtime mode",
    };
  }

  try {
    // Create a server-side Supabase client with admin permissions
    const supabase = createServerSupabaseClient();

    // Use a safer method that doesn't require direct SQL execution
    // Just use a simple query to check connectivity
    const { data, error } = await supabase
      .from("projects")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }

    // Return estimated statistics
    return {
      totalCount: 1,
      idleCount: 0,
      activeCount: 1,
      waitingCount: 0,
      maxConnections: 20,
      note: "Estimated statistics (actual SQL query disabled)",
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
