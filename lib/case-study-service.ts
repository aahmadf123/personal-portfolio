import { createServerSupabaseClient } from "./supabase"
import type { CaseStudy } from "../types/case-studies"

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("case_studies").select("*").order("created_at", { ascending: false })

    if (error) {
      // Check if the error is due to missing table
      if (error.code === "42P01") {
        console.error("Table 'case_studies' does not exist. Returning empty array.")
        return []
      }
      console.error("Error fetching case studies:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllCaseStudies:", error)
    return []
  }
}

export async function getFeaturedCaseStudies(limit = 1): Promise<CaseStudy[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      // Check if the error is due to missing table
      if (error.code === "42P01") {
        console.error("Table 'case_studies' does not exist. Returning empty array.")
        return []
      }
      console.error("Error fetching featured case studies:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFeaturedCaseStudies:", error)
    return []
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data: caseStudy, error } = await supabase.from("case_studies").select("*").eq("slug", slug).single()

    if (error) {
      // Check if the error is due to missing table
      if (error.code === "42P01") {
        console.error(`Table 'case_studies' does not exist.`)
        return null
      }
      console.error(`Error fetching case study with slug ${slug}:`, error)
      return null
    }

    if (!caseStudy) {
      return null
    }

    // Get metrics for this case study
    let metrics = []
    try {
      const { data: metricsData, error: metricsError } = await supabase
        .from("case_study_metrics")
        .select("*")
        .eq("case_study_id", caseStudy.id)

      if (metricsError && metricsError.code !== "42P01") {
        console.error(`Error fetching metrics for case study ${slug}:`, metricsError)
      } else {
        metrics = metricsData || []
      }
    } catch (metricsError) {
      console.error(`Error in metrics fetch for case study ${slug}:`, metricsError)
    }

    // Get tags for this case study
    let tags = []
    try {
      const { data: caseStudyTags, error: tagsError } = await supabase
        .from("case_study_tags")
        .select(`
          tag:tags(*)
        `)
        .eq("case_study_id", caseStudy.id)

      if (tagsError && tagsError.code !== "42P01") {
        console.error(`Error fetching tags for case study ${slug}:`, tagsError)
      } else {
        tags = caseStudyTags?.map((cst) => cst.tag) || []
      }
    } catch (tagsError) {
      console.error(`Error in tags fetch for case study ${slug}:`, tagsError)
    }

    return {
      ...caseStudy,
      metrics: metrics || [],
      tags,
    }
  } catch (error) {
    console.error(`Error in getCaseStudyBySlug for ${slug}:`, error)
    return null
  }
}
