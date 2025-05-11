import { createServerSupabaseClient } from "./supabase";
import type { CaseStudy } from "../types/case-studies";

// Return mock data since case_studies table is not needed
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  console.log("Using mock data for case studies - table not required");
  return [];
}

export async function getFeaturedCaseStudies(limit = 1): Promise<CaseStudy[]> {
  console.log("Using mock data for featured case studies - table not required");
  return [];
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | null> {
  console.log(`Using mock data for case study ${slug} - table not required`);
  return null;
}
