import { createClient } from "@/lib/supabase";
import { DEFAULT_BUCKET_NAME } from "./env-check";

/**
 * Helper functions for handling storage with Supabase
 */

// Use environment variable with fallback through the centralized constant
const BUCKET_NAME = DEFAULT_BUCKET_NAME;

/**
 * Gets a public URL for a file in Supabase Storage
 * @param path - Path within the bucket
 * @returns Full public URL
 */
export function getStorageUrl(path: string): string {
  if (!path) return getPlaceholderImageUrl();

  // Clean the path - remove leading slashes
  const cleanPath = path.replace(/^\/+/, "");

  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(cleanPath);
  return data.publicUrl;
}

/**
 * Returns a placeholder URL for images that couldn't be found
 */
export function getPlaceholderImageUrl(): string {
  return "/images/placeholder-image.jpg";
}

/**
 * Transforms URLs from Vercel Blob to Supabase Storage
 * @param url - Original URL
 * @returns URL to the resource in Supabase Storage
 */
export function transformStorageUrl(url: string): string {
  if (!url) return getPlaceholderImageUrl();

  // Check if this is already a Supabase Storage URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && url.includes(supabaseUrl)) {
    return url;
  }

  // Check if this is a Vercel Blob URL
  if (url.includes("vercel-storage.com")) {
    try {
      // Extract the filename from the Vercel Blob URL
      const filename = url.split("/").pop();

      if (!filename) {
        return getPlaceholderImageUrl();
      }

      // Return the equivalent Supabase Storage URL
      return getStorageUrl(`images/${filename}`);
    } catch (error) {
      console.error("Error transforming storage URL:", error);
      return getPlaceholderImageUrl();
    }
  }

  // Check if this is a relative path
  if (url.startsWith("/")) {
    // If it's a local file in the public directory, return as is
    if (url.startsWith("/images/") || url.startsWith("/public/")) {
      return url;
    }

    // Otherwise, assume it should be in storage and convert
    return getStorageUrl(url.substring(1));
  }

  // Return the original URL for external URLs
  return url;
}
