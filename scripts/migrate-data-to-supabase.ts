/**
 * This script migrates existing data from JSON files to Supabase database
 *
 * Usage:
 * 1. Make sure .env has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 2. Run: ts-node scripts/migrate-data-to-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase environment variables. Make sure .env is properly set up."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to migrate projects
async function migrateProjects() {
  try {
    console.log("Migrating projects...");

    // Load projects data from project-details-service.ts
    const projectServicePath = path.join(
      process.cwd(),
      "lib",
      "project-details-service.ts"
    );

    if (!fs.existsSync(projectServicePath)) {
      console.error("Project service file not found.");
      return;
    }

    const projectServiceContent = fs.readFileSync(projectServicePath, "utf-8");

    // Extract projects object from the file
    const projectsMatch = projectServiceContent.match(
      /const\s+projects\s*:\s*Record<string,\s*Project>\s*=\s*({[\s\S]*?});/
    );

    if (!projectsMatch || !projectsMatch[1]) {
      console.error("Failed to extract projects from service file.");
      return;
    }

    // Convert the extracted text to a valid JSON
    let projectsJson = projectsMatch[1]
      .replace(/(\w+):/g, '"$1":') // Add quotes to object keys
      .replace(/`([\s\S]*?)`/g, function (match, p1) {
        // Escape backticks content
        return JSON.stringify(p1);
      });

    // Evaluate the JSON (careful with this approach in production)
    // For complex objects, you might need to use a more robust approach
    const projectsObj = eval(`(${projectsJson})`);

    // Insert projects into Supabase
    for (const [slug, project] of Object.entries(projectsObj)) {
      // Prepare project data according to the new schema
      const projectData = {
        title: project.title,
        slug: slug,
        description: project.description || "",
        details: project.details || "",
        summary: project.summary || project.description || "",
        thumbnail_url: project.image_url || null,
        main_image_url: project.image_url || null,
        github_url: project.githubUrl || null,
        demo_url: project.demoUrl || null,
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        is_featured: project.featured || false,
        is_ongoing: project.end_date ? false : true,
        order_index: project.order || 0,
        status: project.completion >= 100 ? "completed" : "in-progress",
      };

      const { data, error } = await supabase
        .from("projects")
        .upsert(projectData)
        .select();

      if (error) {
        console.error(`Error inserting project ${slug}:`, error);
      } else {
        console.log(`Inserted project: ${slug}`);
        const projectId = data[0].id;

        // Insert technologies
        if (project.technologies && project.technologies.length > 0) {
          for (const tech of project.technologies) {
            const { error: techError } = await supabase
              .from("project_technologies")
              .upsert({
                project_id: projectId,
                name: tech,
              });

            if (techError) {
              console.error(
                `Error inserting technology for project ${slug}:`,
                techError
              );
            }
          }
        }

        // Insert challenges
        if (project.challenges && project.challenges.length > 0) {
          for (const challenge of project.challenges) {
            const { error: challengeError } = await supabase
              .from("project_challenges")
              .upsert({
                project_id: projectId,
                title: challenge.title || "Challenge",
                description: challenge.description || "",
                solution: challenge.solution || "",
              });

            if (challengeError) {
              console.error(
                `Error inserting challenge for project ${slug}:`,
                challengeError
              );
            }
          }
        }

        // Insert milestones
        if (project.milestones && project.milestones.length > 0) {
          for (const milestone of project.milestones) {
            const { error: milestoneError } = await supabase
              .from("project_milestones")
              .upsert({
                project_id: projectId,
                title: milestone.title || "Milestone",
                description: milestone.description || "",
                date: milestone.date || null,
                status: milestone.status || "completed",
              });

            if (milestoneError) {
              console.error(
                `Error inserting milestone for project ${slug}:`,
                milestoneError
              );
            }
          }
        }

        // Insert tags
        if (project.tags && project.tags.length > 0) {
          for (const tag of project.tags) {
            const tagName = typeof tag === "string" ? tag : tag.name;

            const { error: tagError } = await supabase
              .from("project_tags")
              .upsert({
                project_id: projectId,
                name: tagName,
              });

            if (tagError) {
              console.error(
                `Error inserting tag for project ${slug}:`,
                tagError
              );
            }
          }
        }

        // Insert a main image
        if (project.image_url) {
          const { error: imageError } = await supabase
            .from("project_images")
            .upsert({
              project_id: projectId,
              url: project.image_url,
              alt_text: project.title,
              order_index: 0,
            });

          if (imageError) {
            console.error(
              `Error inserting main image for project ${slug}:`,
              imageError
            );
          }
        }
      }
    }

    console.log("Projects migration completed.");
  } catch (error) {
    console.error("Error migrating projects:", error);
  }
}

// Function to migrate organizations
async function migrateOrganizations() {
  try {
    console.log("Migrating organizations...");

    // Load organizations data from organization-service.ts
    const orgServicePath = path.join(
      process.cwd(),
      "lib",
      "organization-service.ts"
    );

    if (!fs.existsSync(orgServicePath)) {
      console.error("Organization service file not found.");
      return;
    }

    const orgServiceContent = fs.readFileSync(orgServicePath, "utf-8");

    // Extract organizations array from the file
    const orgsMatch = orgServiceContent.match(/return\s*\[([\s\S]*?)\]\s*\}/);

    if (!orgsMatch || !orgsMatch[1]) {
      console.error("Failed to extract organizations from service file.");
      return;
    }

    // Convert the extracted text to a valid JSON array
    let orgsJson = `[${orgsMatch[1]}]`;
    orgsJson = orgsJson
      .replace(/(\w+):/g, '"$1":') // Add quotes to object keys
      .replace(/'/g, '"'); // Replace single quotes with double quotes

    // Evaluate the JSON
    const orgsArray = JSON.parse(orgsJson);

    // Insert organizations into Supabase
    for (const org of orgsArray) {
      const { error } = await supabase.from("organizations").upsert(org);

      if (error) {
        console.error(`Error inserting organization ${org.name}:`, error);
      } else {
        console.log(`Inserted organization: ${org.name}`);
      }
    }

    console.log("Organizations migration completed.");
  } catch (error) {
    console.error("Error migrating organizations:", error);
  }
}

// Function to migrate skills
async function migrateSkills() {
  try {
    console.log("Migrating skills...");

    // Define skill categories
    const categories = [
      "Programming Languages",
      "Web Development",
      "Data Science",
      "Machine Learning",
      "DevOps",
    ];

    // Insert sample skills for each category
    let orderIndex = 0;
    for (const category of categories) {
      // For demonstration, add some sample skills to each category
      const sampleSkills = [
        {
          name: `${category} Skill 1`,
          category: category,
          proficiency: 9,
          is_featured: true,
          icon: null,
          order_index: orderIndex++,
        },
        {
          name: `${category} Skill 2`,
          category: category,
          proficiency: 8,
          is_featured: false,
          icon: null,
          order_index: orderIndex++,
        },
        {
          name: `${category} Skill 3`,
          category: category,
          proficiency: 7,
          is_featured: false,
          icon: null,
          order_index: orderIndex++,
        },
      ];

      for (const skill of sampleSkills) {
        const { error: skillError } = await supabase
          .from("skills")
          .upsert(skill);

        if (skillError) {
          console.error(`Error inserting skill ${skill.name}:`, skillError);
        } else {
          console.log(`Inserted skill: ${skill.name}`);
        }
      }
    }

    console.log("Skills migration completed.");
  } catch (error) {
    console.error("Error migrating skills:", error);
  }
}

// Function to migrate blog posts
async function migrateBlogPosts() {
  try {
    console.log("Migrating blog posts...");

    // Create sample blog post
    const samplePosts = [
      {
        title: "Getting Started with Supabase",
        slug: "getting-started-with-supabase",
        excerpt:
          "A beginner's guide to using Supabase with Next.js for authentication, storage, and database.",
        content:
          "# Getting Started with Supabase\n\nSupabase is an open source Firebase alternative. This post will guide you through setting up Supabase with Next.js...",
        image_url: "/blog-placeholder.jpg",
        read_time: 5,
        published: true,
        featured: true,
        created_at: new Date().toISOString(),
      },
      {
        title: "Migrating from Vercel to Netlify",
        slug: "migrating-from-vercel-to-netlify",
        excerpt:
          "Learn how to migrate your Next.js application from Vercel to Netlify without breaking your site.",
        content:
          "# Migrating from Vercel to Netlify\n\nIn this guide, I'll share my experience migrating my portfolio from Vercel to Netlify...",
        image_url: "/blog-placeholder.jpg",
        read_time: 8,
        published: true,
        featured: false,
        created_at: new Date().toISOString(),
      },
    ];

    // Create sample tags
    const tags = [
      {
        name: "Next.js",
        slug: "nextjs",
        description: "Posts about Next.js framework",
      },
      {
        name: "Supabase",
        slug: "supabase",
        description: "Posts about Supabase",
      },
      { name: "Netlify", slug: "netlify", description: "Posts about Netlify" },
      {
        name: "Migration",
        slug: "migration",
        description: "Posts about migrating between services",
      },
    ];

    // Insert tags
    for (const tag of tags) {
      const { error: tagError } = await supabase.from("blog_tags").upsert(tag);

      if (tagError) {
        console.error(`Error inserting tag ${tag.name}:`, tagError);
      } else {
        console.log(`Inserted tag: ${tag.name}`);
      }
    }

    // Get tag IDs
    const { data: tagData, error: tagFetchError } = await supabase
      .from("blog_tags")
      .select("*");

    if (tagFetchError) {
      console.error("Error fetching tags:", tagFetchError);
      return;
    }

    // Insert posts
    for (const post of samplePosts) {
      const { data, error } = await supabase
        .from("blog_posts")
        .upsert(post)
        .select();

      if (error) {
        console.error(`Error inserting blog post ${post.title}:`, error);
      } else {
        console.log(`Inserted blog post: ${post.title}`);

        // Assign tags to post
        const postId = data[0].id;
        // Randomly select 2 tags for each post
        const selectedTags = tagData!
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        for (const tag of selectedTags) {
          const { error: relationError } = await supabase
            .from("blog_post_tags")
            .upsert({
              blog_post_id: postId,
              tag_id: tag.id,
            });

          if (relationError) {
            console.error(`Error assigning tag to post:`, relationError);
          }
        }
      }
    }

    console.log("Blog posts migration completed.");
  } catch (error) {
    console.error("Error migrating blog posts:", error);
  }
}

// Main migration function
async function migrateData() {
  try {
    console.log("Starting data migration to Supabase...");

    // Run the migration functions
    await migrateProjects();
    await migrateOrganizations();
    await migrateSkills();
    await migrateBlogPosts();

    console.log("Data migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run the migration
migrateData();
