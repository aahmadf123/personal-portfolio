/**
 * This script checks for breaking changes after dependency updates
 * Run with: npx tsx scripts/check-updates.ts
 */

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

// Define critical dependencies to check
const criticalDependencies = [
  "react",
  "react-dom",
  "next",
  "framer-motion",
  "three",
  "@react-three/fiber",
  "@react-three/drei",
  "react-markdown",
  "@supabase/supabase-js",
  "@vercel/blob",
  "tailwindcss",
]

// Function to check for potential breaking changes
function checkBreakingChanges() {
  console.log("Checking for potential breaking changes in updated dependencies...\n")

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))

  // Check critical dependencies
  criticalDependencies.forEach((dep) => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`Checking ${dep}...`)
      try {
        // Run npm view to get version info
        const versionInfo = execSync(`npm view ${dep} version`, { encoding: "utf8" }).trim()
        const currentVersion = (packageJson.dependencies[dep] || packageJson.devDependencies[dep])
          .replace("^", "")
          .replace("~", "")

        console.log(`  Current: ${currentVersion}`)
        console.log(`  Latest: ${versionInfo}`)

        // Simple major version check
        const currentMajor = Number.parseInt(currentVersion.split(".")[0])
        const latestMajor = Number.parseInt(versionInfo.split(".")[0])

        if (currentMajor < latestMajor) {
          console.log(`  ⚠️ WARNING: Major version difference detected for ${dep}`)
          console.log(
            `  Please check the changelog for breaking changes: https://github.com/${dep.includes("/") ? dep : dep + "/" + dep}/releases`,
          )
        } else {
          console.log(`  ✅ No major version difference detected`)
        }
      } catch (error) {
        console.error(`  Error checking ${dep}: ${error}`)
      }
      console.log("")
    }
  })

  // Check for npm audit issues
  console.log("Running npm audit to check for security vulnerabilities...")
  try {
    const auditResult = execSync("npm audit --json", { encoding: "utf8" })
    const auditData = JSON.parse(auditResult)

    if (auditData.metadata.vulnerabilities.total > 0) {
      console.log(`⚠️ Found ${auditData.metadata.vulnerabilities.total} vulnerabilities`)
      console.log("Run 'npm audit fix' to attempt to fix these issues")
    } else {
      console.log("✅ No vulnerabilities found")
    }
  } catch (error) {
    console.log("⚠️ npm audit found vulnerabilities. Run 'npm audit' for details.")
  }

  console.log("\nDependency check complete.")
  console.log("Remember to test your application thoroughly after updating dependencies.")
}

// Run the check
checkBreakingChanges()
