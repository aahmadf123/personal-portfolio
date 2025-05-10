/**
 * CSS Analysis Script
 *
 * This script analyzes CSS files in the project and generates a report
 * on file sizes, selector counts, and potential issues.
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
  // File extensions to analyze
  extensions: [".css", ".module.css"],
  // Thresholds for warnings
  thresholds: {
    fileSize: 50 * 1024, // 50KB
    selectorCount: 100,
    ruleCount: 200,
    mediaQueryCount: 20,
    nestedDepth: 4,
  },
}

interface CssMetrics {
  filePath: string
  fileSize: number
  selectorCount: number
  ruleCount: number
  mediaQueryCount: number
  maxNestingDepth: number
  issues: string[]
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
 * Analyze a CSS file and return metrics
 */
function analyzeCssFile(filePath: string): CssMetrics {
  const content = fs.readFileSync(filePath, "utf8")
  const fileSize = fs.statSync(filePath).size

  // Simple regex-based analysis (not perfect but gives a rough estimate)
  const selectorCount = (content.match(/[^}]*{/g) || []).length
  const ruleCount = (content.match(/[^:]*:[^;]*;/g) || []).length
  const mediaQueryCount = (content.match(/@media[^{]*{/g) || []).length

  // Estimate nesting depth (this is a rough approximation)
  const lines = content.split("\n")
  let maxDepth = 0
  let currentDepth = 0

  for (const line of lines) {
    if (line.includes("{")) {
      currentDepth++
      maxDepth = Math.max(maxDepth, currentDepth)
    }
    if (line.includes("}")) {
      currentDepth = Math.max(0, currentDepth - 1)
    }
  }

  // Identify potential issues
  const issues: string[] = []

  if (fileSize > CONFIG.thresholds.fileSize) {
    issues.push(
      `File size (${(fileSize / 1024).toFixed(2)}KB) exceeds threshold (${CONFIG.thresholds.fileSize / 1024}KB)`,
    )
  }

  if (selectorCount > CONFIG.thresholds.selectorCount) {
    issues.push(`Selector count (${selectorCount}) exceeds threshold (${CONFIG.thresholds.selectorCount})`)
  }

  if (ruleCount > CONFIG.thresholds.ruleCount) {
    issues.push(`Rule count (${ruleCount}) exceeds threshold (${CONFIG.thresholds.ruleCount})`)
  }

  if (mediaQueryCount > CONFIG.thresholds.mediaQueryCount) {
    issues.push(`Media query count (${mediaQueryCount}) exceeds threshold (${CONFIG.thresholds.mediaQueryCount})`)
  }

  if (maxDepth > CONFIG.thresholds.nestedDepth) {
    issues.push(`Maximum nesting depth (${maxDepth}) exceeds threshold (${CONFIG.thresholds.nestedDepth})`)
  }

  // Check for potentially invalid comments
  if (content.match(/(?<!:)\/\/(?!.*['"].*\/\/)(.*)$/gm)) {
    issues.push("Contains invalid double-slash comments")
  }

  return {
    filePath,
    fileSize,
    selectorCount,
    ruleCount,
    mediaQueryCount,
    maxNestingDepth: maxDepth,
    issues,
  }
}

/**
 * Generate a report from the analysis results
 */
function generateReport(results: CssMetrics[]): void {
  console.log(`${COLORS.magenta}CSS Analysis Report${COLORS.reset}`)
  console.log(`${COLORS.blue}Analyzed ${results.length} CSS files${COLORS.reset}`)

  // Summary statistics
  const totalSize = results.reduce((sum, file) => sum + file.fileSize, 0)
  const totalSelectors = results.reduce((sum, file) => sum + file.selectorCount, 0)
  const totalRules = results.reduce((sum, file) => sum + file.ruleCount, 0)
  const totalMediaQueries = results.reduce((sum, file) => sum + file.mediaQueryCount, 0)
  const totalIssues = results.reduce((sum, file) => sum + file.issues.length, 0)

  console.log(`\n${COLORS.cyan}Summary:${COLORS.reset}`)
  console.log(`Total CSS size: ${(totalSize / 1024).toFixed(2)}KB`)
  console.log(`Total selectors: ${totalSelectors}`)
  console.log(`Total rules: ${totalRules}`)
  console.log(`Total media queries: ${totalMediaQueries}`)
  console.log(`Total issues found: ${totalIssues}`)

  // Files by size (largest first)
  console.log(`\n${COLORS.cyan}Files by size (largest first):${COLORS.reset}`)
  results
    .sort((a, b) => b.fileSize - a.fileSize)
    .slice(0, 10)
    .forEach((file) => {
      console.log(`${file.filePath}: ${(file.fileSize / 1024).toFixed(2)}KB`)
    })

  // Files with issues
  const filesWithIssues = results.filter((file) => file.issues.length > 0)

  if (filesWithIssues.length > 0) {
    console.log(`\n${COLORS.yellow}Files with issues:${COLORS.reset}`)
    filesWithIssues.forEach((file) => {
      console.log(`\n${COLORS.yellow}${file.filePath}:${COLORS.reset}`)
      file.issues.forEach((issue) => {
        console.log(`  - ${issue}`)
      })
    })
  } else {
    console.log(`\n${COLORS.green}No issues found!${COLORS.reset}`)
  }

  // Recommendations
  if (totalIssues > 0) {
    console.log(`\n${COLORS.cyan}Recommendations:${COLORS.reset}`)
    console.log(`- Run 'npm run lint:css -- --fix' to automatically fix some issues`)
    console.log(`- Consider breaking large CSS files into smaller modules`)
    console.log(`- Review media queries for potential consolidation`)
    console.log(`- Check for unused CSS rules`)
  }
}

// Main execution
console.log(`${COLORS.magenta}Starting CSS analysis...${COLORS.reset}`)

const cssFiles = findCssFiles()
console.log(`${COLORS.blue}Found ${cssFiles.length} CSS files to analyze${COLORS.reset}`)

const results = cssFiles.map((file) => analyzeCssFile(file))
generateReport(results)
