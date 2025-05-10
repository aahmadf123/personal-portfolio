export interface ResearchProject {
  id: number
  title: string
  slug: string
  description: string
  longDescription?: string
  long_description?: string
  image_url?: string
  completion: number
  startDate?: string
  start_date?: string
  endDate?: string
  end_date?: string
  daysRemaining?: number
  days_remaining?: number
  priority: string
  category: string
  nextMilestone?: string
  next_milestone?: string
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  tags: string[]
  challenges: {
    id?: number
    description: string
  }[]
  recentUpdates: {
    date: string
    text: string
  }[]
  teamMembers: string[]
  resources: {
    name: string
    url: string
  }[]
}
