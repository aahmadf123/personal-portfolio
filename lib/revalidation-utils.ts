/**
 * Utility functions for content revalidation
 */

// Validate the revalidation secret
export function validateRevalidationSecret(secret?: string): boolean {
  if (!process.env.REVALIDATION_SECRET) {
    console.warn("REVALIDATION_SECRET is not set in environment variables")
    return false
  }

  return secret === process.env.REVALIDATION_SECRET
}

// Validate the revalidation request
export async function validateRevalidationRequest(request: Request): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the request method is POST
    if (request.method !== "POST") {
      return {
        success: false,
        error: "Invalid request method. Only POST requests are allowed.",
      }
    }

    // For authenticated admin routes, we can skip the secret validation
    // This assumes the request is coming from an authenticated admin user
    // The actual authentication check should be done in the middleware or route handler

    try {
      // Try to parse the request body
      const body = await request.json()

      // If there's a secret in the body, validate it
      if (body?.secret) {
        const isValidSecret = validateRevalidationSecret(body.secret)
        if (!isValidSecret) {
          return {
            success: false,
            error: "Invalid revalidation secret.",
          }
        }
      }
    } catch (e) {
      // If there's no body or it can't be parsed as JSON,
      // we'll assume this is an authenticated admin request
      // The actual authentication should be handled elsewhere
    }

    // If all checks pass, the request is valid
    return { success: true }
  } catch (error) {
    console.error("Error validating revalidation request:", error)
    return {
      success: false,
      error: "Error processing revalidation request.",
    }
  }
}

// Content types that can be revalidated
export type ContentType = "skills" | "projects" | "blog" | "case-studies" | "timeline" | "research-projects" | "all"

// Get the API path for a content type
export function getRevalidationPath(contentType: ContentType): string {
  if (!contentType) {
    throw new Error("Content type is required for revalidation")
  }
  return `/api/${contentType}/revalidate`
}

// Client-side function to trigger revalidation
export async function revalidateContent(contentType: ContentType): Promise<{ success: boolean; message: string }> {
  try {
    if (!contentType) {
      throw new Error("Content type is required for revalidation")
    }

    const path = getRevalidationPath(contentType)
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache: 'no-store' to prevent caching
      cache: "no-store",
    })

    // Check if the response is OK before trying to parse JSON
    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to revalidate content: ${response.status}`)
      } else {
        // Handle non-JSON responses
        const text = await response.text()
        throw new Error(`Failed to revalidate content: ${response.status}. Response was not JSON.`)
      }
    }

    // Parse the JSON response
    try {
      const data = await response.json()
      return {
        success: true,
        message: data.message || "Content revalidated successfully",
      }
    } catch (jsonError) {
      throw new Error("Invalid JSON response from revalidation endpoint")
    }
  } catch (error) {
    console.error(`Error revalidating ${contentType}:`, error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Revalidate all content types
export async function revalidateAllContent(): Promise<{ success: boolean; message: string }> {
  return revalidateContent("all")
}

// Re-export the server actions for backward compatibility
// These are just proxy functions that call the actual server actions
export {
  revalidateProjects,
  revalidateBlog,
  revalidateSkills,
  revalidateResearchProjects,
  revalidateAll,
} from "@/app/actions/revalidate-actions"
