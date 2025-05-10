export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string | null
  read_time: number | null
  published: boolean
  featured: boolean
  view_count: number
  category_id: number | null
  author_id: string | null
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface BlogPostWithCategory extends BlogPost {
  category: Category | null
}

export interface BlogPostWithCategoryAndTags extends BlogPostWithCategory {
  tags: BlogTag[]
}

export interface BlogComment {
  id: number
  blog_post_id: number
  name: string
  email: string
  content: string
  approved: boolean
  created_at: string
  updated_at: string
}
