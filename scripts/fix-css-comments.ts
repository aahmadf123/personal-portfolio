/**
 * Fix CSS Comments Script
 *
 * This script scans CSS files for invalid double-slash comments
 * and replaces them with proper CSS comments.
 */

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

// Configuration
const CONFIG = {
  // Directories to scan for CSS files
  includeDirs: ["app", "components", "styles"],
  // Directories to exclude
  excludeDirs: ["node_modules", ".next", "public", "out", "dist"],
  // File extensions to process
  extensions: [".css", ".module.css"],
  // Whether to show detailed output
  verbose: process.argv.includes("--verbose"),
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
 * Fix invalid comments in a CSS file
 */
function fixCssComments(filePath: string): boolean {
  const content = fs.readFileSync(filePath, "utf8")

  // Regular expression to match double-slash comments
  // This regex looks for // that are not inside a string or a url()
  const commentRegex = /(?<!:)\/\/(?!.*['"].*\/\/)(.*)$/gm

  if (!commentRegex.test(content)) {
    if (CONFIG.verbose) {
      console.log(`${COLORS.blue}No invalid comments found in ${filePath}${COLORS.reset}`)
    }
    return false
  }

  // Reset regex
  commentRegex.lastIndex = 0

  // Replace double-slash comments with proper CSS comments
  const fixedContent = content.replace(commentRegex, "/* $1 */")

  fs.writeFileSync(filePath, fixedContent, "utf8")
  console.log(`${COLORS.green}Fixed invalid comments in ${filePath}${COLORS.reset}`)
  return true
}

// Main execution
console.log(`${COLORS.magenta}Starting CSS comment fix process${COLORS.reset}`)

const cssFiles = findCssFiles()
console.log(`${COLORS.blue}Found ${cssFiles.length} CSS files to check${COLORS.reset}`)

let fixedCount = 0
for (const file of cssFiles) {
  if (fixCssComments(file)) {
    fixedCount++
  }
}

if (fixedCount > 0) {
  console.log(`${COLORS.green}Fixed comments in ${fixedCount} file(s)${COLORS.reset}`)
} else {
  console.log(`${COLORS.green}All CSS files have valid comments${COLORS.reset}`)
}
