/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
  public statusCode: number
  public context?: Record<string, any>
  public originalError?: any

  constructor(message: string, statusCode = 500, context?: Record<string, any>, originalError?: any) {
    super(message)
    this.name = "DatabaseError"
    this.statusCode = statusCode
    this.context = context
    this.originalError = originalError

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError)
    }
  }
}

/**
 * Handles database errors in a standardized way
 */
export function handleDatabaseError(
  error: any,
  operation: string,
  entity: string,
  context?: Record<string, any>,
): DatabaseError {
  console.error(`Database error during ${operation} on ${entity}:`, error)

  // Log additional context if available
  if (context) {
    console.error("Context:", context)
  }

  // Determine appropriate status code and message
  let statusCode = 500
  let message = `Failed to ${operation} ${entity}`

  // Handle specific Supabase error codes
  if (error?.code) {
    switch (error.code) {
      case "23505": // Unique violation
        statusCode = 409
        message = `${entity} already exists`
        break
      case "23503": // Foreign key violation
        statusCode = 400
        message = `Referenced ${entity} does not exist`
        break
      case "42P01": // Undefined table
        statusCode = 500
        message = `Database schema error: table for ${entity} not found`
        break
      case "42703": // Undefined column
        statusCode = 500
        message = `Database schema error: column in ${entity} not found`
        break
      case "28P01": // Invalid password
      case "28000": // Invalid authorization
        statusCode = 401
        message = "Database authentication failed"
        break
      case "57014": // Query timeout
      case "57P01": // Admin shutdown
      case "57P02": // Crash shutdown
      case "57P03": // Cannot connect now
        statusCode = 503
        message = "Database temporarily unavailable"
        break
    }
  }

  // Handle network errors
  if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
    statusCode = 503
    message = "Database connection failed"
  }

  return new DatabaseError(message, statusCode, context, error)
}

/**
 * Retry a database operation with exponential backoff
 */
export async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3, initialDelay = 300): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Only retry on connection errors or timeouts
      const isRetryable =
        error?.message?.includes("network") ||
        error?.message?.includes("timeout") ||
        error?.message?.includes("connection") ||
        error?.code === "57014" || // Query timeout
        error?.code === "57P03" // Cannot connect now

      if (!isRetryable) {
        throw error
      }

      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5)
      console.warn(`Retrying database operation after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`, error)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Validate that required fields are present
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[],
  entityName: string,
): void {
  const missingFields = requiredFields.filter((field) => data[field] === undefined)

  if (missingFields.length > 0) {
    throw new DatabaseError(`Missing required fields for ${entityName}: ${missingFields.join(", ")}`, 400, {
      providedFields: Object.keys(data),
      missingFields,
    })
  }
}
