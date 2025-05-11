import { createClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase";
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
export function getStorageUrl(path: string): string | null {
  if (!path) return null;

  // Clean the path - remove leading slashes
  const cleanPath = path.replace(/^\/+/, "");

  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(cleanPath);
  console.log(`Storage URL transformation: ${path} → ${data.publicUrl}`);
  return data.publicUrl;
}

/**
 * Returns a placeholder URL for images that couldn't be found
 * @deprecated - No longer using fallback images
 */
export function getPlaceholderImageUrl(): null {
  return null;
}

/**
 * Transforms URLs for storage resources
 * @param url - Original URL
 * @returns URL to the resource or null if invalid
 */
export function transformStorageUrl(url: string): string | null {
  console.log(`Transforming URL: ${url}`);

  if (!url) {
    console.warn("Empty URL provided to transformStorageUrl");
    return null;
  }

  try {
    // Handle complete Supabase storage URLs - preserve as is
    if (
      url.includes("supabase.co/storage/") ||
      url.includes("supabase.co/object/")
    ) {
      console.log(`URL is already a Supabase URL: ${url}`);
      return url;
    }

    // Handle legacy Vercel Blob URLs - preserve as is
    if (url.includes("vercel-storage.com")) {
      console.log(`URL is a Vercel Blob URL: ${url}`);
      return url;
    }

    // Handle storage paths that might be full references to bucket objects
    if (url.includes(`${BUCKET_NAME}/`)) {
      const pathInBucket = url.split(`${BUCKET_NAME}/`)[1];
      console.log(`Processing URL as bucket path: ${pathInBucket}`);
      return getStorageUrl(pathInBucket);
    }

    // Check if this is a relative path
    if (url.startsWith("/")) {
      // If it's a local file in the public directory, return as is
      if (url.startsWith("/images/") || url.startsWith("/public/")) {
        console.log(`URL is a local public file: ${url}`);
        return url;
      }

      // Check if it looks like an image file path
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)) {
        // Try to get the storage URL
        console.log(`Converting relative image path: ${url}`);
        return getStorageUrl(url.substring(1));
      }

      // For any other paths, return as is
      console.log(`Keeping relative path as is: ${url}`);
      return url;
    }

    // For absolute URLs with http/https, return as is
    if (url.startsWith("http")) {
      console.log(`URL is an absolute URL: ${url}`);
      return url;
    }

    // For any other case, assume it's a relative path that needs conversion
    console.log(`Treating as storage path: ${url}`);
    return getStorageUrl(url);
  } catch (error) {
    console.error(`Error transforming URL ${url}:`, error);
    return null; // Return null if transformation fails
  }
}

/**
 * Verify storage configuration and debug issues
 * Call this function from an API route to check storage settings
 */
export async function verifyStorageConfig() {
  try {
    console.log("Starting storage configuration verification...");

    // Use server client with admin permissions to ensure we can list buckets
    const supabase = createServerSupabaseClient();

    // Check if we can list the buckets
    console.log("Checking available storage buckets...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
      return {
        success: false,
        error: bucketsError.message,
        details: "Could not list storage buckets",
      };
    }

    console.log(`Found ${buckets.length} storage buckets`);
    const bucketNames = buckets.map((b) => b.name);
    console.log("Available buckets:", bucketNames.join(", "));

    // Check if our configured bucket exists
    const bucketExists = bucketNames.includes(BUCKET_NAME);
    console.log(
      `Configured bucket "${BUCKET_NAME}" ${
        bucketExists ? "exists" : "does not exist"
      }`
    );

    if (!bucketExists) {
      return {
        success: false,
        error: `Bucket "${BUCKET_NAME}" not found`,
        suggestedBucket: bucketNames.length > 0 ? bucketNames[0] : null,
        details:
          "The configured bucket does not exist in your Supabase project",
      };
    }

    // Try to list files in the bucket
    console.log(`Listing files in bucket "${BUCKET_NAME}"...`);
    const { data: files, error: filesError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (filesError) {
      console.error("Error listing files:", filesError);
      return {
        success: false,
        error: filesError.message,
        details: "Could not list files in the bucket",
      };
    }

    console.log(`Found ${files.length} files/folders in the bucket`);
    if (files.length > 0) {
      console.log(
        "Sample files:",
        files
          .slice(0, 5)
          .map((f) => f.name)
          .join(", ")
      );

      // Try to get URL for the first image file
      const imageFile = files.find((f) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)
      );
      if (imageFile) {
        const url = getStorageUrl(imageFile.name);
        if (url) {
          console.log(`Test image URL: ${url}`);
          return {
            success: true,
            bucketName: BUCKET_NAME,
            fileCount: files.length,
            testImageUrl: url,
            details: "Storage configuration is valid",
          };
        }
      }
    }

    return {
      success: true,
      bucketName: BUCKET_NAME,
      fileCount: files.length,
      details: "Bucket exists but no valid image files were found to test",
    };
  } catch (error) {
    console.error("Error verifying storage configuration:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: "Unexpected error while verifying storage configuration",
    };
  }
}
