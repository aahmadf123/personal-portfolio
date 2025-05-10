export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: number
          title: string
          slug: string
          excerpt: string
          content: string
          image_url: string | null
          published: boolean
          featured: boolean
          created_at: string
          updated_at: string
          category_id: number
        }
        Insert: {
          id?: number
          title: string
          slug: string
          excerpt: string
          content: string
          image_url?: string | null
          published?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
          category_id: number
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          image_url?: string | null
          published?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
          category_id?: number
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
