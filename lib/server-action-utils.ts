import { createServerSupabaseClient } from "@/lib/supabase"

export type ActionResponse = {
  success: boolean
  message: string
  error?: {
    code?: string
    details?: string
  }
  data?: any
}

export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  FOREIGN_KEY_VIOLATION = "FOREIGN_KEY_VIOLATION",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export async function checkAuth() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized access", {
      cause: {
        code: ErrorCode.UNAUTHORIZED,
        message: "You must be logged in to perform this action",
      },
    })
  }

  return { supabase, userId: session.user.id }
}

export function handleError(error: any): ActionResponse {
  console.error("Server action error:", error)

  // Handle Supabase PostgreSQL errors
  if (error?.code) {
    // Foreign key violation
    if (error.code === "23503") {
      return {
        success: false,
        message: "This record is referenced by other records and cannot be deleted",
        error: {
          code: ErrorCode.FOREIGN_KEY_VIOLATION,
          details: error.details,
        },
      }
    }

    // Unique violation
    if (error.code === "23505") {
      return {
        success: false,
        message: "A record with this information already exists",
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          details: error.details,
        },
      }
    }

    // Other database errors
    return {
      success: false,
      message: "Database operation failed",
      error: {
        code: ErrorCode.DATABASE_ERROR,
        details: error.message || error.details,
      },
    }
  }

  // Handle custom errors
  if (error?.cause?.code) {
    return {
      success: false,
      message: error.cause.message || "An error occurred",
      error: {
        code: error.cause.code,
        details: error.message,
      },
    }
  }

  // Handle unknown errors
  return {
    success: false,
    message: "An unexpected error occurred",
    error: {
      code: ErrorCode.UNKNOWN_ERROR,
      details: error.message || String(error),
    },
  }
}
