/**
 * CSS Optimization Script
 * Run with: npx tsx scripts/optimize-css.ts
 */

import fs from "fs"
import path from "path"
import { promisify } from "util"
import { exec as execCallback } from "child_process"

const exec = promisify(execCallback)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

async function optimizeCSS() {
  console.log("🚀 Starting CSS optimization...")

  // Create output directory if it doesn't exist
  const outputDir = path.join(process.cwd(), "public", "css")
  try {
    await mkdir(outputDir, { recursive: true })
  } catch (err) {
    // Directory already exists, continue
  }

  // Read globals.css
  const globalsCssPath = path.join(process.cwd(), "app", "globals.css")
  const globalsCss = await readFile(globalsCssPath, "utf8")

  // Simple CSS minification (in a real scenario, use a proper CSS minifier)
  const minifiedCss = globalsCss
    .replace(/\/\*(?!\*\/).*?\*\//gs, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, "$1") // Remove spaces around punctuation
    .replace(/;\}/g, "}") // Remove trailing semicolons
    .trim()

  // Write minified CSS
  const minifiedPath = path.join(outputDir, "styles.min.css")
  await writeFile(minifiedPath, minifiedCss)

  // Generate stats
  const originalSize = Buffer.from(globalsCss).length
  const minifiedSize = Buffer.from(minifiedCss).length
  const savings = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(2)

  console.log(`✅ CSS optimization complete!`)
  console.log(`📊 Original size: ${(originalSize / 1024).toFixed(2)}KB`)
  console.log(`📊 Minified size: ${(minifiedSize / 1024).toFixed(2)}KB`)
  console.log(`📊 Savings: ${savings}%`)

  return {
    originalSize,
    minifiedSize,
    savings,
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  optimizeCSS().catch(console.error)
}

export default optimizeCSS
