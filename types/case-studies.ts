export interface CaseStudy {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  image_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface CaseStudyMetric {
  id: string
  case_study_id: string
  label: string
  value: string
  icon?: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface CaseStudyWithTags extends CaseStudy {
  metrics?: CaseStudyMetric[]
  tags?: Tag[]
}
