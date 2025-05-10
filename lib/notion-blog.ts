import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import { cache } from "react"

// Types for blog posts
export interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  date: string
  coverImage?: string
  content?: string
  published: boolean
  featured: boolean
  categoryId?: string
  categoryName?: string
  tags?: { id: string; name: string }[]
}

export interface BlogCategory {
  id: string
  name: string
  description?: string
  slug: string
}

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

// Get the database ID from environment variables
const blogDatabaseId = process.env.NOTION_BLOG_DATABASE_ID || ""
const categoriesDatabaseId = process.env.NOTION_CATEGORIES_DATABASE_ID || ""

// Function to get blog posts with caching
export const getBlogPosts = cache(
  async (options?: {
    featured?: boolean
    limit?: number
    categoryId?: string
    tagId?: string
    includeUnpublished?: boolean
  }): Promise<BlogPost[]> => {
    try {
      // Fallback data for development or when Notion API is not available
      const fallbackPosts: BlogPost[] = [
        {
          id: "1",
          slug: "getting-started-with-nextjs",
          title: "Getting Started with Next.js",
          description: "Learn how to build modern web applications with Next.js",
          date: new Date().toISOString(),
          coverImage: "/nextjs-blog.png",
          published: true,
          featured: true,
          categoryName: "Web Development",
          tags: [
            { id: "1", name: "Next.js" },
            { id: "2", name: "React" },
          ],
        },
        {
          id: "2",
          slug: "understanding-quantum-computing",
          title: "Understanding Quantum Computing",
          description: "A beginner-friendly introduction to quantum computing concepts",
          date: new Date(Date.now() - 86400000).toISOString(),
          coverImage: "/quantum-computing-concept.png",
          published: true,
          featured: false,
          categoryName: "Quantum Computing",
          tags: [
            { id: "3", name: "Quantum" },
            { id: "4", name: "Computing" },
          ],
        },
        {
          id: "3",
          slug: "machine-learning-fundamentals",
          title: "Machine Learning Fundamentals",
          description: "Core concepts and techniques in machine learning",
          date: new Date(Date.now() - 172800000).toISOString(),
          coverImage: "/machine-learning-concept.png",
          published: true,
          featured: true,
          categoryName: "AI & Machine Learning",
          tags: [
            { id: "5", name: "ML" },
            { id: "6", name: "AI" },
          ],
        },
      ]

      // If Notion API key is not available, return fallback data
      if (!process.env.NOTION_API_KEY || !blogDatabaseId) {
        console.warn("Notion API key or Blog Database ID not found, using fallback data")

        // Filter based on options
        let filteredPosts = [...fallbackPosts]

        if (options?.featured !== undefined) {
          filteredPosts = filteredPosts.filter((post) => post.featured === options.featured)
        }

        if (options?.limit) {
          filteredPosts = filteredPosts.slice(0, options.limit)
        }

        return filteredPosts
      }

      // Build the Notion query
      const filter: any = {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: options?.includeUnpublished ? undefined : true,
            },
          },
        ],
      }

      // Add featured filter if specified
      if (options?.featured !== undefined) {
        filter.and.push({
          property: "Featured",
          checkbox: {
            equals: options.featured,
          },
        })
      }

      // Add category filter if specified
      if (options?.categoryId) {
        filter.and.push({
          property: "Category",
          relation: {
            contains: options.categoryId,
          },
        })
      }

      // Add tag filter if specified
      if (options?.tagId) {
        filter.and.push({
          property: "Tags",
          relation: {
            contains: options.tagId,
          },
        })
      }

      // Query the Notion database
      const response = await notion.databases.query({
        database_id: blogDatabaseId,
        filter,
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
        page_size: options?.limit || 100,
      })

      // Process the response
      const posts = await Promise.all(
        response.results.map(async (page) => {
          // Extract properties from the page
          const properties = page.properties as any

          // Get category information if available
          let categoryName = ""
          let categoryId = ""

          if (properties.Category && properties.Category.relation && properties.Category.relation.length > 0) {
            categoryId = properties.Category.relation[0].id

            try {
              const categoryPage = await notion.pages.retrieve({ page_id: categoryId })
              categoryName = (categoryPage as any).properties.Name.title[0]?.plain_text || ""
            } catch (error) {
              console.error("Error fetching category:", error)
            }
          }

          // Get tags information if available
          let tags: { id: string; name: string }[] = []

          if (properties.Tags && properties.Tags.relation && properties.Tags.relation.length > 0) {
            tags = await Promise.all(
              properties.Tags.relation.map(async (relation: any) => {
                const tagId = relation.id
                try {
                  const tagPage = await notion.pages.retrieve({ page_id: tagId })
                  const tagName = (tagPage as any).properties.Name.title[0]?.plain_text || ""
                  return { id: tagId, name: tagName }
                } catch (error) {
                  console.error("Error fetching tag:", error)
                  return { id: tagId, name: "Unknown Tag" }
                }
              }),
            )
          }

          // Create the blog post object
          return {
            id: page.id,
            slug: properties.Slug.rich_text[0]?.plain_text || "",
            title: properties.Title.title[0]?.plain_text || "Untitled",
            description: properties.Description.rich_text[0]?.plain_text || "",
            date: properties.Date.date?.start || new Date().toISOString(),
            coverImage: properties.CoverImage.url || undefined,
            published: properties.Published.checkbox,
            featured: properties.Featured.checkbox,
            categoryId,
            categoryName,
            tags,
          } as BlogPost
        }),
      )

      return posts
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }
  },
)

// Function to get blog categories with caching
export const getBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  try {
    // Fallback categories for development or when Notion API is not available
    const fallbackCategories: BlogCategory[] = [
      {
        id: "1",
        name: "Web Development",
        description: "Articles about web development technologies and techniques",
        slug: "web-development",
      },
      {
        id: "2",
        name: "Quantum Computing",
        description: "Exploring quantum computing concepts and applications",
        slug: "quantum-computing",
      },
      {
        id: "3",
        name: "AI & Machine Learning",
        description: "Insights into artificial intelligence and machine learning",
        slug: "ai-machine-learning",
      },
    ]

    // If Notion API key is not available, return fallback data
    if (!process.env.NOTION_API_KEY || !categoriesDatabaseId) {
      console.warn("Notion API key or Categories Database ID not found, using fallback data")
      return fallbackCategories
    }

    // Query the Notion database for categories
    const response = await notion.databases.query({
      database_id: categoriesDatabaseId,
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
    })

    // Process the response
    const categories = response.results.map((page) => {
      const properties = page.properties as any

      return {
        id: page.id,
        name: properties.Name.title[0]?.plain_text || "Unnamed Category",
        description: properties.Description?.rich_text[0]?.plain_text || "",
        slug: properties.Slug?.rich_text[0]?.plain_text || "unnamed-category",
      } as BlogCategory
    })

    return categories
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return []
  }
})

// Function to get a single blog post by slug
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    // If Notion API key is not available, return fallback data
    if (!process.env.NOTION_API_KEY || !blogDatabaseId) {
      console.warn("Notion API key or Blog Database ID not found, using fallback data")

      // Use the fallback posts from getBlogPosts
      const fallbackPosts = await getBlogPosts()
      const post = fallbackPosts.find((post) => post.slug === slug)

      if (!post) return null

      // Add some dummy content for the fallback post
      return {
        ...post,
        content: `# ${post.title}\n\nThis is a fallback content for the blog post. In a real application, this would be fetched from Notion.\n\n## Introduction\n\n${post.description}\n\n## Main Content\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\n## Conclusion\n\nThank you for reading this fallback blog post!`,
      }
    }

    // Query the Notion database for the post with the given slug
    const response = await notion.databases.query({
      database_id: blogDatabaseId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    })

    // If no post is found, return null
    if (response.results.length === 0) {
      return null
    }

    // Get the page
    const page = response.results[0]
    const properties = page.properties as any

    // Get category information if available
    let categoryName = ""
    let categoryId = ""

    if (properties.Category && properties.Category.relation && properties.Category.relation.length > 0) {
      categoryId = properties.Category.relation[0].id

      try {
        const categoryPage = await notion.pages.retrieve({ page_id: categoryId })
        categoryName = (categoryPage as any).properties.Name.title[0]?.plain_text || ""
      } catch (error) {
        console.error("Error fetching category:", error)
      }
    }

    // Get tags information if available
    let tags: { id: string; name: string }[] = []

    if (properties.Tags && properties.Tags.relation && properties.Tags.relation.length > 0) {
      tags = await Promise.all(
        properties.Tags.relation.map(async (relation: any) => {
          const tagId = relation.id
          try {
            const tagPage = await notion.pages.retrieve({ page_id: tagId })
            const tagName = (tagPage as any).properties.Name.title[0]?.plain_text || ""
            return { id: tagId, name: tagName }
          } catch (error) {
            console.error("Error fetching tag:", error)
            return { id: tagId, name: "Unknown Tag" }
          }
        }),
      )
    }

    // Get the page content
    const mdBlocks = await n2m.pageToMarkdown(page.id)
    const mdString = n2m.toMarkdownString(mdBlocks)

    // Create the blog post object
    return {
      id: page.id,
      slug: properties.Slug.rich_text[0]?.plain_text || "",
      title: properties.Title.title[0]?.plain_text || "Untitled",
      description: properties.Description.rich_text[0]?.plain_text || "",
      date: properties.Date.date?.start || new Date().toISOString(),
      coverImage: properties.CoverImage.url || undefined,
      content: mdString.parent,
      published: properties.Published.checkbox,
      featured: properties.Featured.checkbox,
      categoryId,
      categoryName,
      tags,
    } as BlogPost
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }
})
