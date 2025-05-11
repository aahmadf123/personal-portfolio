import { createClient } from "@/lib/supabase";
import type { Project } from "@/types/projects";
import type { Organization } from "@/components/organizations";
import type { SkillCategory } from "@/types/skills";
import { transformStorageUrl } from "./storage-utils";

/**
 * Utility functions for fetching content from Supabase database
 */

// Projects
export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();

  // Use a more efficient query pattern with proper foreign key relationships
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_technologies(id, name, icon, category),
      project_tags(id, name),
      project_images(id, url, alt_text, caption, order_index)
    `
    )
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  if (!data || !Array.isArray(data)) {
    return [];
  }

  // Process image URLs and transform data to match expected Project type
  return data.map((project) => {
    try {
      // Calculate image URL from existing fields - don't rely on image_url column
      const imageUrl =
        project.main_image_url || project.thumbnail_url
          ? transformStorageUrl(project.main_image_url || project.thumbnail_url)
          : null;

      // Calculate completion based on status
      const completion =
        project.status === "completed"
          ? 100
          : project.status === "in-progress"
          ? 50
          : project.status === "planned"
          ? 0
          : 75;

      return {
        ...project,
        id: project.id.toString(),
        image_url: imageUrl,
        technologies: Array.isArray(project.project_technologies)
          ? project.project_technologies.map((tech: any) => tech.name)
          : [],
        tags: Array.isArray(project.project_tags)
          ? project.project_tags.map((tag: any) => tag.name)
          : [],
        images: Array.isArray(project.project_images)
          ? project.project_images.map((img: any) => ({
              url: img.url ? transformStorageUrl(img.url) : null,
              alt: img.alt_text || project.title,
              caption: img.caption || "",
            }))
          : [],
        featured: project.is_featured || false,
        completion: completion,
      };
    } catch (err) {
      console.error(`Error processing project data for ID ${project.id}:`, err);
      // Return basic project data if processing failed
      return {
        ...project,
        id: project.id.toString(),
        image_url: null,
        technologies: [],
        tags: [],
        images: [],
        featured: false,
        completion: 0,
      };
    }
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient();

  if (!slug) {
    console.error("Project slug is required");
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_challenges(*),
      project_milestones(*),
      project_tags(*),
      project_technologies(*),
      project_images(*)
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    throw error;
  }

  if (!data) return null;

  try {
    // Process image URLs and transform data
    return {
      ...data,
      id: data.id.toString(),
      image_url:
        data.main_image_url || data.thumbnail_url
          ? transformStorageUrl(data.main_image_url || data.thumbnail_url)
          : null,
      technologies: data.project_technologies
        ? data.project_technologies.map((tech: any) => tech.name)
        : [],
      tags: data.project_tags
        ? data.project_tags.map((tag: any) => tag.name)
        : [],
      challenges: data.project_challenges || [],
      milestones: data.project_milestones || [],
      images: data.project_images
        ? data.project_images.map((img: any) => ({
            url: img.url ? transformStorageUrl(img.url) : null,
            alt: img.alt_text || data.title,
            caption: img.caption || "",
          }))
        : [],
      featured: data.is_featured || false,
      completion:
        data.status === "completed"
          ? 100
          : data.status === "in-progress"
          ? 50
          : data.status === "planned"
          ? 0
          : 75,
    };
  } catch (err) {
    console.error(`Error processing project data for slug ${slug}:`, err);
    // Return partial data if processing failed
    return {
      ...data,
      id: data.id.toString(),
      image_url: null,
      technologies: [],
      tags: [],
      challenges: [],
      milestones: [],
      images: [],
      featured: false,
      completion: 0,
    };
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_technologies(*), project_tags(*), project_images(*)")
      .eq("is_featured", true)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching featured projects:", error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Process projects with consistent image handling
    return data.map((project) => {
      try {
        // Find main image from project_images if it exists
        const mainImage = project.project_images?.find(
          (img: any) => img.is_main
        );
        const thumbnailUrl = project.thumbnail_url || null;
        const mainImageUrl = mainImage?.url || project.main_image_url || null;

        // Process image URLs consistently
        const processedThumbnail = thumbnailUrl
          ? transformStorageUrl(thumbnailUrl)
          : null;
        const processedMainImage = mainImageUrl
          ? transformStorageUrl(mainImageUrl)
          : null;

        // Calculate image_url from available sources without using fallbacks
        const imageUrl = processedThumbnail || processedMainImage;

        // Calculate completion based on status instead of using the database column
        const completion =
          project.status === "completed"
            ? 100
            : project.status === "in-progress"
            ? 50
            : project.status === "planned"
            ? 0
            : 75;

        return {
          ...project,
          id: project.id.toString(),
          thumbnail_url: processedThumbnail,
          main_image_url: processedMainImage,
          image_url: imageUrl,
          technologies: project.project_technologies
            ? project.project_technologies.map((tech: any) => tech.name)
            : [],
          tags: project.project_tags
            ? project.project_tags.map((tag: any) => tag.name)
            : [],
          images: project.project_images
            ? project.project_images.map((img: any) => ({
                url: img.url ? transformStorageUrl(img.url) : null,
                alt: img.alt_text || project.title,
                caption: img.caption || "",
              }))
            : [],
          featured: project.is_featured,
          completion: completion,
          // Add safe defaults for any fields that might be expected but don't exist
          priority: "medium",
        };
      } catch (err) {
        console.error(
          `Error processing featured project data for ID ${project.id}:`,
          err
        );
        // Return basic project data if processing failed
        return {
          ...project,
          id: project.id.toString(),
          thumbnail_url: null,
          main_image_url: null,
          image_url: null,
          technologies: [],
          tags: [],
          images: [],
          featured: project.is_featured,
          completion: 0,
          priority: "medium",
        };
      }
    });
  } catch (outerError) {
    console.error("Unexpected error in getFeaturedProjects:", outerError);
    return [];
  }
}

// Organizations
export async function getOrganizations(): Promise<Organization[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }

  // Process logo URLs
  return data.map((org) => ({
    ...org,
    logo: transformStorageUrl(org.logo),
  }));
}

// Skills
export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }

  // Group skills by category
  const categoriesMap = new Map<string, SkillCategory>();

  data.forEach((skill) => {
    if (!categoriesMap.has(skill.category)) {
      categoriesMap.set(skill.category, {
        id: skill.category,
        name: skill.category,
        skills: [],
      });
    }

    categoriesMap.get(skill.category)?.skills.push({
      id: skill.id.toString(),
      name: skill.name,
      proficiency: skill.proficiency,
      icon: skill.icon,
      featured: skill.is_featured,
      sort_order: skill.order_index,
    });
  });

  // Convert map to array and sort skills within each category
  return Array.from(categoriesMap.values()).map((category) => ({
    ...category,
    skills: category.skills.sort((a, b) => a.sort_order - b.sort_order),
  }));
}

// Blog posts
export async function getBlogPosts(limit?: number) {
  const supabase = createClient();
  let query = supabase
    .from("blog_posts")
    .select(
      `
      *,
      categories(*),
      blog_post_tags!inner(
        *,
        blog_tags(*)
      )
    `
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }

  // Process data and extract tags
  return data.map((post) => {
    const tags = post.blog_post_tags
      ? post.blog_post_tags.map((postTag: any) => postTag.blog_tags)
      : [];

    return {
      ...post,
      cover_image: transformStorageUrl(post.image_url),
      summary: post.excerpt,
      tags: tags,
      category: post.categories,
      read_time: post.read_time ? `${post.read_time} min read` : "5 min read",
    };
  });
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createClient();

  if (!slug) {
    console.error("Blog post slug is required");
    return null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      categories(*),
      blog_post_tags!inner(
        *,
        blog_tags(*)
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }

  if (!data) return null;

  try {
    // Process data and extract tags
    const tags = data.blog_post_tags
      ? data.blog_post_tags.map((postTag: any) => postTag.blog_tags)
      : [];

    return {
      ...data,
      cover_image: data.image_url ? transformStorageUrl(data.image_url) : null,
      summary: data.excerpt || "",
      tags: tags,
      category: data.categories,
      read_time: data.read_time ? `${data.read_time} min read` : "5 min read",
    };
  } catch (err) {
    console.error(`Error processing blog post data for slug ${slug}:`, err);
    // Return partial data if processing failed
    return {
      ...data,
      cover_image: null,
      summary: data.excerpt || "",
      tags: [],
      category: null,
      read_time: "5 min read",
    };
  }
}

// Timeline
export async function getTimelineEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching timeline events:", error);
    throw error;
  }

  return data;
}

// Case studies - mock implementation since table doesn't exist
export async function getCaseStudies() {
  console.log(
    "Using mock implementation for case studies - table doesn't exist"
  );
  return [];
}

export async function getCaseStudyBySlug(slug: string) {
  console.log(
    `Using mock implementation for case study ${slug} - table doesn't exist`
  );
  return null;
}
