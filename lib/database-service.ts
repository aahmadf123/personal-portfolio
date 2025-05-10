import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Generic database service for fetching data from Supabase
 */
export async function fetchData<T>(
  table: string,
  options: {
    select?: string
    limit?: number
    orderBy?: { column: string; ascending?: boolean }
    filters?: Record<string, any>
    joins?: Array<{ table: string; on: string; type?: "inner" | "left" | "right" }>
  } = {},
): Promise<T[]> {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return []
    }

    const { select = "*", limit, orderBy, filters, joins } = options

    let query = supabase.from(table).select(select)

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply order
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false })
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error(`Error fetching data from ${table}:`, error)
      return []
    }

    return data as T[]
  } catch (error) {
    console.error(`Error in fetchData for ${table}:`, error)
    return []
  }
}

/**
 * Fetch featured projects
 */
export async function getFeaturedProjects(limit = 3) {
  return fetchData("projects", {
    limit,
    filters: { is_featured: true },
    orderBy: { column: "order_index", ascending: true },
  })
}

/**
 * Fetch featured blog posts
 */
export async function getFeaturedBlogPosts(limit = 3) {
  return fetchData("blog_posts", {
    select: `
      *,
      categories(id, name, slug)
    `,
    limit,
    filters: { featured: true, published: true },
    orderBy: { column: "created_at", ascending: false },
  })
}

/**
 * Fetch skills by category
 */
export async function getSkillsByCategory() {
  const skills = await fetchData("skills", {
    orderBy: { column: "order_index", ascending: true },
  })

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return groupedSkills
}

/**
 * Fetch experience items
 */
export async function getExperience() {
  return fetchData("experience", {
    orderBy: { column: "start_date", ascending: false },
  })
}

/**
 * Fetch education items
 */
export async function getEducation() {
  return fetchData("education", {
    orderBy: { column: "start_date", ascending: false },
  })
}
