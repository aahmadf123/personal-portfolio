/**
 * This script cleans the Next.js cache and temporary files
 * to ensure static assets are correctly generated
 */

import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    console.log("🧹 Cleaning Next.js cache...");

    // Remove .next directory
    try {
      await fs.rm(path.join(__dirname, ".next"), {
        recursive: true,
        force: true,
      });
      console.log("✅ Removed .next directory");
    } catch (err) {
      console.log("ℹ️ .next directory not found or could not be removed");
    }

    console.log("\n🔄 Restarting Next.js build process...");

    // Run next build in development mode first to generate assets
    console.log("\n🛠️ Building project...");
    execSync("next build", { stdio: "inherit" });

    console.log("\n✨ Static assets should now be correctly generated.");
    console.log('🚀 Run "npm run dev" to start the development server.');
    console.log(
      "\n📝 If you still see 404 errors, check Browser DevTools Network tab and reload with cache cleared."
    );
  } catch (error) {
    console.error("❌ Error occurred:", error);
    process.exit(1);
  }
}

main();
