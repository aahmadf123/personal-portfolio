/**
 * Husky Setup Script
 *
 * This script sets up Husky for Git hooks.
 * It installs Husky, creates the necessary hooks directory,
 * and sets up the pre-commit hook.
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

// Colors for console output
const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${COLORS.magenta}Setting up Husky for Git hooks...${COLORS.reset}`)

try {
  // Install Husky
  console.log(`${COLORS.blue}Installing Husky...${COLORS.reset}`)
  execSync("npx husky install", { stdio: "inherit" })

  // Create .husky directory if it doesn't exist
  const huskyDir = path.join(process.cwd(), ".husky")
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true })
  }

  // Create pre-commit hook
  console.log(`${COLORS.blue}Creating pre-commit hook...${COLORS.reset}`)
  const preCommitPath = path.join(huskyDir, "pre-commit")
  const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`

  fs.writeFileSync(preCommitPath, preCommitContent)
  fs.chmodSync(preCommitPath, 0o755) // Make executable

  console.log(`${COLORS.green}Husky setup completed successfully!${COLORS.reset}`)
  console.log(`${COLORS.cyan}Pre-commit hook installed at: ${preCommitPath}${COLORS.reset}`)
} catch (error) {
  console.error(`${COLORS.red}Error setting up Husky:${COLORS.reset}`, error)
  process.exit(1)
}
