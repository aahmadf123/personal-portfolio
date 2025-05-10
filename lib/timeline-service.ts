import { createServerSupabaseClient } from "./supabase"
import type { Experience, Education, Certification } from "../types/timeline"

export async function getAllExperience(): Promise<Experience[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("experience").select("*").order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching experience entries:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllExperience:", error)
    return []
  }
}

export async function getFeaturedExperience(): Promise<Experience[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("is_featured", true)
      .order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching featured experience:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeaturedExperience:", error)
    return []
  }
}

export async function getAllEducation(): Promise<Education[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("education").select("*").order("start_date", { ascending: false })

    if (error) {
      console.error("Error fetching education entries:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllEducation:", error)
    return []
  }
}

export async function getAllCertifications(): Promise<Certification[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("certifications").select("*").order("issue_date", { ascending: false })

    if (error) {
      console.error("Error fetching certifications:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllCertifications:", error)
    return []
  }
}
