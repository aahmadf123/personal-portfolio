/**
 * This script sets the is_featured flag for projects in Supabase
 *
 * Usage:
 * node scripts/set-featured-projects.js
 */

// Load environment variables
import "dotenv/config";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Script directory:", __dirname);
console.log("Environment variables loaded from:", process.cwd());

async function main() {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Missing Supabase URL or key. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    );
    console.error("Current environment variables:");
    console.error(
      `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "set" : "not set"}`
    );
    console.error(
      `- SUPABASE_SERVICE_ROLE_KEY: ${
        process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "not set"
      }`
    );
    console.error(
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "not set"
      }`
    );
    process.exit(1);
  }

  console.log("Starting featured projects update...");
  console.log(`Using Supabase URL: ${supabaseUrl}`);

  try {
    // First, get all projects to list them
    console.log("Fetching projects from database...");
    const listResponse = await fetch(
      `${supabaseUrl}/rest/v1/projects?select=id,title,slug,is_featured`,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      throw new Error(
        `Failed to list projects: ${listResponse.status} ${listResponse.statusText}\n${errorText}`
      );
    }

    const projects = await listResponse.json();
    console.log(`Found ${projects.length} projects in database:`);
    projects.forEach((p) => {
      console.log(
        `- [${p.id}] ${p.title} (featured: ${p.is_featured || false})`
      );
    });

    if (projects.length === 0) {
      console.warn("No projects found in database. Nothing to update.");
      process.exit(0);
    }

    // Confirm which projects to mark as featured
    // In this example, we're marking the first 3 projects as featured
    const projectsToFeature = projects.slice(0, 3);
    console.log("\nSetting the following projects as featured:");
    projectsToFeature.forEach((p) => console.log(`- [${p.id}] ${p.title}`));

    // Update each project
    for (const project of projectsToFeature) {
      console.log(`\nUpdating project ${project.id} (${project.title})...`);

      const response = await fetch(
        `${supabaseUrl}/rest/v1/projects?id=eq.${project.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            is_featured: true,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to update project ${project.id}: ${response.status} ${response.statusText}\n${errorText}`
        );
      } else {
        console.log(
          `✅ Project ${project.id} (${project.title}) marked as featured`
        );
      }
    }

    console.log("\nFeatured projects update completed!");

    // Notify about cache revalidation
    console.log("\nTo see changes on the website, clear the cache by calling:");
    console.log('fetch("/api/projects/revalidate")');
  } catch (error) {
    console.error("Error updating featured projects:", error);
    process.exit(1);
  }
}

main();
