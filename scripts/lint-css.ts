/**
 * CSS Linting Script
 *
 * This script runs stylelint on all CSS files in the project.
 * It can be used to check for CSS syntax errors and enforce consistent styling.
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

// Configuration
const CONFIG = {
  // Directories to scan for CSS files
  includeDirs: ["app", "components", "styles"],
  // Directories to exclude
  excludeDirs: ["node_modules", ".next", "public", "out", "dist"],
  // File extensions to lint
  extensions: [".css", ".module.css"],
  // Whether to automatically fix issues
  autoFix: process.argv.includes("--fix"),
  // Whether to show detailed output
  verbose: process.argv.includes("--verbose"),
}

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

/**
 * Find all CSS files in the specified directories
 */
function findCssFiles(): string[] {
  const cssFiles: string[] = []

  function scanDir(dir: string) {
    if (CONFIG.excludeDirs.some((excluded) => dir.includes(excluded))) {
      return
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.isFile() && CONFIG.extensions.some((ext) => entry.name.endsWith(ext))) {
        cssFiles.push(fullPath)
      }
    }
  }

  for (const dir of CONFIG.includeDirs) {
    if (fs.existsSync(dir)) {
      scanDir(dir)
    }
  }

  return cssFiles
}

/**
 * Run stylelint on the specified files
 */
function lintFiles(files: string[]): void {
  if (files.length === 0) {
    console.log(`${COLORS.yellow}No CSS files found to lint${COLORS.reset}`)
    return
  }

  console.log(`${COLORS.blue}Found ${files.length} CSS files to lint${COLORS.reset}`)

  if (CONFIG.verbose) {
    console.log(`${COLORS.cyan}Files to lint:${COLORS.reset}`)
    files.forEach((file) => console.log(`  - ${file}`))
  }

  const fixFlag = CONFIG.autoFix ? " --fix" : ""
  const command = `npx stylelint "${files.join('" "')}"${fixFlag}`

  try {
    console.log(`${COLORS.blue}Running stylelint...${COLORS.reset}`)
    execSync(command, { stdio: "inherit" })
    console.log(`${COLORS.green}CSS linting completed successfully!${COLORS.reset}`)
  } catch (error) {
    console.error(`${COLORS.red}CSS linting failed with errors${COLORS.reset}`)
    process.exit(1)
  }
}

// Main execution
console.log(`${COLORS.magenta}Starting CSS linting process${COLORS.reset}`)
console.log(`${COLORS.cyan}Auto-fix: ${CONFIG.autoFix ? "Enabled" : "Disabled"}${COLORS.reset}`)

const cssFiles = findCssFiles()
lintFiles(cssFiles)
