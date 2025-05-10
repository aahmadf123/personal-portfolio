import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Singleton pattern for Supabase clients
let serverClientInstance: ReturnType<typeof createSupabaseClient> | null = null
let clientClientInstance: ReturnType<typeof createSupabaseClient> | null = null

// Create a Supabase client that works in both client and server components
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key not found, using fallback values")
    return createSupabaseClient(
      "https://example.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.fallback-key-for-development",
    )
  }

  // Use singleton pattern for client-side to prevent multiple instances
  if (typeof window !== "undefined") {
    if (!clientClientInstance) {
      clientClientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    }
    return clientClientInstance
  }

  // For server-side, create a new client each time
  // This is because server components might be rendered in parallel
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Create a server-side Supabase client (for server components and API routes)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or Service Key not found")
  }

  // Use singleton pattern for server-side to prevent multiple instances
  if (serverClientInstance) {
    return serverClientInstance
  }

  // Create new client
  serverClientInstance = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
    },
  })

  return serverClientInstance
}

// Add the missing export
export const createClientSupabaseClient = createClient

// Simplified pool stats function that doesn't rely on pg
export function getPoolStats() {
  return {
    totalCount: 5, // Default values for display
    idleCount: 3,
    waitingCount: 0,
    maxConnections: 10,
  }
}
