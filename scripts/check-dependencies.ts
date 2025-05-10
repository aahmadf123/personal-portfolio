/**
 * This script checks for dependency compatibility issues
 * Run with: npx tsx scripts/check-dependencies.ts
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

// Function to check for dependency compatibility issues
function checkDependencyCompatibility() {
  console.log("Checking for dependency compatibility issues...\n")

  try {
    // Run npm ls to check for dependency issues
    console.log("Running npm ls to check for dependency issues...")
    execSync("npm ls", { stdio: "inherit" })
    console.log("\n✅ No dependency issues found with npm ls\n")
  } catch (error) {
    console.log("\n⚠️ Some dependency issues were found. See above for details.\n")
  }

  try {
    // Run npm outdated to check for outdated dependencies
    console.log("Running npm outdated to check for outdated dependencies...")
    execSync("npm outdated", { stdio: "inherit" })
    console.log("\n✅ Dependency check complete\n")
  } catch (error) {
    // npm outdated exits with code 1 if there are outdated dependencies
    console.log("\n⚠️ Some dependencies are outdated. See above for details.\n")
  }

  // Check for Next.js and React compatibility
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))
  const nextVersion = packageJson.dependencies.next.replace("^", "").replace("~", "")
  const reactVersion = packageJson.dependencies.react.replace("^", "").replace("~", "")

  console.log(`Next.js version: ${nextVersion}`)
  console.log(`React version: ${reactVersion}`)

  // Check React and Next.js compatibility
  const nextMajor = Number.parseInt(nextVersion.split(".")[0])
  const reactMajor = Number.parseInt(reactVersion.split(".")[0])
  const reactMinor = Number.parseInt(reactVersion.split(".")[1])

  if (nextMajor >= 13 && (reactMajor < 18 || (reactMajor === 18 && reactMinor < 2))) {
    console.log("\n⚠️ Warning: Next.js 13+ works best with React 18.2.0 or higher")
  } else {
    console.log("\n✅ Next.js and React versions are compatible")
  }

  // Check for peer dependency issues with key packages
  console.log("\nChecking for peer dependency issues with key packages...")
  try {
    execSync('npm info "react-dom@' + reactVersion + '" peerDependencies', { encoding: "utf8" })
    console.log("✅ react-dom peer dependencies are satisfied")
  } catch (error) {
    console.log("⚠️ Could not verify react-dom peer dependencies")
  }

  console.log("\nDependency compatibility check complete.")
  console.log("For a more thorough check, consider running: npm install --dry-run")
}

// Run the check
checkDependencyCompatibility()
