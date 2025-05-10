import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // SQL to create case_studies table
    const caseStudiesSQL = `
      CREATE TABLE IF NOT EXISTS public.case_studies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        summary TEXT,
        content TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `

    // SQL to create case_study_metrics table
    const caseStudyMetricsSQL = `
      CREATE TABLE IF NOT EXISTS public.case_study_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        icon TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `

    // SQL to create tags table
    const tagsSQL = `
      CREATE TABLE IF NOT EXISTS public.tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `

    // SQL to create case_study_tags table
    const caseStudyTagsSQL = `
      CREATE TABLE IF NOT EXISTS public.case_study_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(case_study_id, tag_id)
      );
    `

    // Execute SQL to create tables
    await supabase.rpc("exec_sql", { sql: caseStudiesSQL })
    await supabase.rpc("exec_sql", { sql: caseStudyMetricsSQL })
    await supabase.rpc("exec_sql", { sql: tagsSQL })
    await supabase.rpc("exec_sql", { sql: caseStudyTagsSQL })

    return NextResponse.json({ success: true, message: "Database tables created successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database" }, { status: 500 })
  }
}
