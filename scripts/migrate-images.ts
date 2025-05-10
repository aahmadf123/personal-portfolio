/**
 * This script helps migrate images from Vercel Blob to Supabase Storage
 *
 * Usage:
 * 1. Make sure .env has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 2. Run: ts-node scripts/migrate-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Constants
const BUCKET_NAME = "portfolio-bucket";
const TEMP_DIR = path.join(process.cwd(), "temp-images");
const VERCEL_URLS_FILE = path.join(process.cwd(), "vercel-image-urls.txt");

// Vercel Blob URLs to migrate - add your URLs here
// Format: One URL per line in vercel-image-urls.txt
// You can also add them directly in the array below
const DEFAULT_URLS: string[] = [];

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Make sure .env is properly set up."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Function to download a file
async function downloadFile(url: string, filePath: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
    console.log(`Downloaded: ${url} to ${filePath}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    throw error;
  }
}

// Function to upload a file to Supabase Storage
async function uploadToSupabaseStorage(
  filePath: string,
  targetPath: string
): Promise<string> {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileExt = path.extname(filePath).toLowerCase();

    // Determine content type based on file extension
    let contentType = "application/octet-stream";
    if ([".jpg", ".jpeg"].includes(fileExt)) contentType = "image/jpeg";
    else if (fileExt === ".png") contentType = "image/png";
    else if (fileExt === ".gif") contentType = "image/gif";
    else if (fileExt === ".svg") contentType = "image/svg+xml";
    else if (fileExt === ".webp") contentType = "image/webp";

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(targetPath, fileContent, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(targetPath);

    console.log(`Uploaded to Supabase: ${targetPath}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading to Supabase: ${filePath}`, error);
    throw error;
  }
}

// Main migration function
async function migrateImages(): Promise<void> {
  try {
    console.log("Starting migration from Vercel Blob to Supabase Storage...");

    // Load URLs from file if it exists
    let urls = DEFAULT_URLS;
    if (fs.existsSync(VERCEL_URLS_FILE)) {
      const fileContent = fs.readFileSync(VERCEL_URLS_FILE, "utf-8");
      const fileUrls = fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"));

      urls = [...urls, ...fileUrls];
    }

    if (urls.length === 0) {
      console.log(
        "No URLs to migrate. Add URLs to vercel-image-urls.txt or update the script."
      );
      return;
    }

    console.log(`Found ${urls.length} URLs to migrate.`);

    // Migration results
    const results: {
      original: string;
      newUrl: string;
      success: boolean;
      error?: string;
    }[] = [];

    // Process each URL
    for (const [index, url] of urls.entries()) {
      try {
        console.log(`\nProcessing URL ${index + 1}/${urls.length}: ${url}`);

        // Extract filename from URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");
        let filename = pathParts[pathParts.length - 1];

        // Create a temporary file path
        const tempFilePath = path.join(TEMP_DIR, filename);

        // Download the file
        await downloadFile(url, tempFilePath);

        // Determine target path in Supabase
        // We'll organize files by type
        let targetDirectory = "images";
        if (filename.toLowerCase().includes("logo")) {
          targetDirectory = "logos";
        }

        // Add a timestamp to ensure uniqueness
        const timestamp = Date.now();
        const targetFilename = `${timestamp}-${filename}`;
        const targetPath = `${targetDirectory}/${targetFilename}`;

        // Upload to Supabase Storage
        const newUrl = await uploadToSupabaseStorage(tempFilePath, targetPath);

        // Add to results
        results.push({
          original: url,
          newUrl,
          success: true,
        });

        // Clean up the temp file
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error(`Failed to process URL: ${url}`, error);
        results.push({
          original: url,
          newUrl: "",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Generate report
    const successCount = results.filter((r) => r.success).length;
    console.log(`\n--- Migration Report ---`);
    console.log(`Total URLs: ${urls.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${urls.length - successCount}`);

    // Save mapping to file for reference
    const mappingFile = path.join(
      process.cwd(),
      "image-migration-mapping.json"
    );
    fs.writeFileSync(mappingFile, JSON.stringify(results, null, 2));
    console.log(`\nMapping saved to ${mappingFile}`);

    // Clean up temp directory
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }

    console.log("\nMigration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run the migration
migrateImages();
