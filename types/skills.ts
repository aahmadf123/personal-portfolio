export interface Skill {
  id: number
  name: string
  slug: string
  description?: string
  proficiency: number
  category: string
  color?: string
  is_featured: boolean
  order_index?: number
  created_at: string
  updated_at?: string
}
