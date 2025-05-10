import { createServerSupabaseClient } from "./supabase"
import type { Skill } from "../types/skills"
import { handleDatabaseError, retryOperation, validateRequiredFields } from "./error-utils"

export async function getAllSkills(): Promise<Skill[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("order_index")
        .order("proficiency", { ascending: false })

      if (error) {
        throw handleDatabaseError(error, "fetch", "skills")
      }

      return data || []
    })
  } catch (error) {
    console.error("Error in getAllSkills:", error)
    return []
  }
}

export async function getFeaturedSkills(limit = 6): Promise<Skill[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("is_featured", true)
        .order("order_index")
        .order("proficiency", { ascending: false })
        .limit(limit)

      if (error) {
        throw handleDatabaseError(error, "fetch", "featured skills", { limit })
      }

      return data || []
    })
  } catch (error) {
    console.error("Error in getFeaturedSkills:", error)
    return []
  }
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  if (!category) {
    console.error("Invalid category provided to getSkillsByCategory")
    return []
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("category", category)
        .order("order_index")
        .order("proficiency", { ascending: false })

      if (error) {
        throw handleDatabaseError(error, "fetch", `skills for category ${category}`, { category })
      }

      return data || []
    })
  } catch (error) {
    console.error(`Error in getSkillsByCategory for category ${category}:`, error)
    return []
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("skills").select("category").order("category")

      if (error) {
        throw handleDatabaseError(error, "fetch", "skill categories")
      }

      // Extract unique categories
      const categories = [...new Set(data.map((item) => item.category))]
      return categories
    })
  } catch (error) {
    console.error("Error in getAllCategories:", error)
    return []
  }
}

export async function createSkill(skill: Partial<Skill>): Promise<Skill | null> {
  try {
    // Validate required fields
    validateRequiredFields(skill, ["name", "category", "proficiency"], "skill")

    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("skills").insert([skill]).select().single()

      if (error) {
        throw handleDatabaseError(error, "create", "skill", { skill })
      }

      return data
    })
  } catch (error) {
    console.error("Error in createSkill:", error)
    throw error // Re-throw for API routes to handle
  }
}

export async function updateSkill(id: number, skill: Partial<Skill>): Promise<Skill | null> {
  if (!id || isNaN(id)) {
    throw new Error("Invalid skill ID provided to updateSkill")
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("skills").update(skill).eq("id", id).select().single()

      if (error) {
        throw handleDatabaseError(error, "update", `skill with ID ${id}`, { id, skill })
      }

      return data
    })
  } catch (error) {
    console.error(`Error in updateSkill for ID ${id}:`, error)
    throw error // Re-throw for API routes to handle
  }
}

export async function deleteSkill(id: number): Promise<boolean> {
  if (!id || isNaN(id)) {
    throw new Error("Invalid skill ID provided to deleteSkill")
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()
      const { error } = await supabase.from("skills").delete().eq("id", id)

      if (error) {
        throw handleDatabaseError(error, "delete", `skill with ID ${id}`, { id })
      }

      return true
    })
  } catch (error) {
    console.error(`Error in deleteSkill for ID ${id}:`, error)
    throw error // Re-throw for API routes to handle
  }
}

// Add these functions at the end of the file

// Get all skill categories with additional metadata
export async function getAllSkillCategories(): Promise<any[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()

      // First get all unique categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("skills")
        .select("category")
        .order("category")

      if (categoriesError) {
        throw handleDatabaseError(categoriesError, "fetch", "skill categories")
      }

      // Extract unique categories
      const categories = [...new Set(categoriesData.map((item) => item.category))]

      // For each category, get count and average proficiency
      const result = await Promise.all(
        categories.map(async (category) => {
          const { data, error } = await supabase.from("skills").select("*").eq("category", category)

          if (error) {
            throw handleDatabaseError(error, "fetch", `skills for category ${category}`)
          }

          const count = data.length
          const avgProficiency = data.reduce((sum, skill) => sum + skill.proficiency, 0) / count

          return {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
            count,
            avgProficiency: Math.round(avgProficiency * 10) / 10,
            description: `${count} skills in the ${category} category`,
          }
        }),
      )

      return result
    })
  } catch (error) {
    console.error("Error in getAllSkillCategories:", error)
    return []
  }
}

// Get a skill category by slug
export async function getSkillCategoryBySlug(slug: string): Promise<any | null> {
  if (!slug) {
    console.error("Invalid slug provided to getSkillCategoryBySlug")
    return null
  }

  try {
    return await retryOperation(async () => {
      const supabase = createServerSupabaseClient()

      // Get all categories
      const { data: categoriesData, error: categoriesError } = await supabase.from("skills").select("category")

      if (categoriesError) {
        throw handleDatabaseError(categoriesError, "fetch", "skill categories")
      }

      // Find the category that matches the slug
      const categories = [...new Set(categoriesData.map((item) => item.category))]
      const category = categories.find((cat) => cat.toLowerCase().replace(/\s+/g, "-") === slug)

      if (!category) {
        return null
      }

      // Get skills for this category
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("category", category)
        .order("order_index")
        .order("proficiency", { ascending: false })

      if (error) {
        throw handleDatabaseError(error, "fetch", `skills for category ${category}`)
      }

      const count = data.length
      const avgProficiency = data.reduce((sum, skill) => sum + skill.proficiency, 0) / count

      return {
        name: category,
        slug,
        count,
        avgProficiency: Math.round(avgProficiency * 10) / 10,
        description: `${count} skills in the ${category} category`,
        skills: data,
      }
    })
  } catch (error) {
    console.error(`Error in getSkillCategoryBySlug for slug ${slug}:`, error)
    return null
  }
}
