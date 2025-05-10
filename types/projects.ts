export interface Project {
  id: number
  title: string
  slug: string
  description: string
  details?: string
  summary?: string
  thumbnail_url?: string
  main_image_url?: string
  github_url?: string
  demo_url?: string
  video_url?: string
  start_date?: string
  end_date?: string
  is_featured: boolean
  is_ongoing: boolean
  order_index: number
  status: string
  client?: string
  view_count: number
  created_at: string
  updated_at: string
  project_tags?: ProjectTag[]
  project_technologies?: ProjectTechnology[]
  project_milestones?: ProjectMilestone[]
  project_challenges?: ProjectChallenge[]
  project_images?: ProjectImage[]
}

export interface ProjectTag {
  id: number
  project_id: number
  name: string
}

export interface ProjectTechnology {
  id: number
  project_id: number
  name: string
  icon?: string
  version?: string
  category?: string
}

export interface ProjectMilestone {
  id: number
  project_id: number
  title: string
  description?: string
  date?: string
  status: string
}

export interface ProjectChallenge {
  id: number
  project_id: number
  title: string
  description: string
  solution?: string
}

export interface ProjectImage {
  id: number
  project_id: number
  url: string
  alt_text?: string
  caption?: string
  order_index: number
}
