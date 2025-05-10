import { createClient } from "@/lib/supabase";

/**
 * Helper functions for handling storage with Supabase
 */

const BUCKET_NAME = "portfolio-bucket";

/**
 * Gets a public URL for a file in Supabase Storage
 * @param path - Path within the bucket
 * @returns Full public URL
 */
export function getStorageUrl(path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
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
 * @param url - Original Vercel Blob URL
 * @returns URL to the resource in Supabase Storage
 */
export function transformStorageUrl(url: string): string {
  // Check if this is a Vercel Blob URL
  if (url.includes("vercel-storage.com")) {
    try {
      // Extract the filename from the Vercel Blob URL
      const filename = url.split("/").pop();

      if (!filename) {
        return getPlaceholderImageUrl();
      }

      // Return the equivalent Supabase Storage URL
      // For now returning placeholder until files are migrated
      return getPlaceholderImageUrl();

      // Once files are migrated, you can use:
      // return getStorageUrl(`images/${filename}`);
    } catch (error) {
      console.error("Error transforming storage URL:", error);
      return getPlaceholderImageUrl();
    }
  }

  // Return the original URL if it's not a Vercel Blob URL
  return url;
}
