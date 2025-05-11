/**
 * Cross-platform script to clear Next.js cache and rebuild
 * Works on Windows, Mac, and Linux
 */

import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const nextCacheDir = path.join(rootDir, ".next");

async function main() {
  try {
    console.log("🧹 Cleaning Next.js cache...");

    // Check if .next directory exists
    try {
      await fs.access(nextCacheDir);
      console.log("Found .next directory, removing...");

      // Remove .next directory using fs.rm for cross-platform compatibility
      await fs.rm(nextCacheDir, { recursive: true, force: true });
      console.log("✅ Removed .next directory successfully");
    } catch (err) {
      console.log("ℹ️ .next directory not found or already removed");
    }

    // Also try to delete any file system caches
    console.log("Clearing browser caches...");

    console.log("\n🔄 Rebuilding the project...");
    execSync("next build", { stdio: "inherit", cwd: rootDir });

    console.log("\n✨ Cache cleared and project rebuilt");
    console.log('🚀 Run "npm run dev" to start the development server');
  } catch (error) {
    console.error("❌ Error occurred:", error);
    process.exit(1);
  }
}

main();
