import { createClient } from "@/lib/supabase";
import type {
  BlogPost,
  BlogPostWithCategory,
  BlogPostWithCategoryAndTags,
  Category,
} from "@/types/blog";
import {
  handleDatabaseError,
  retryOperation,
  validateRequiredFields,
} from "./error-utils";

// Get all published blog posts with pagination
export async function getPublishedPosts(
  page = 1,
  limit = 10,
  featured = false
): Promise<{ posts: BlogPostWithCategory[]; total: number }> {
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  try {
    return await retryOperation(async () => {
      const supabase = createClient();
      const offset = (page - 1) * limit;

      let query = supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:categories(*)
        `,
          { count: "exact" }
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (featured) {
        query = query.eq("featured", true);
      }

      const { data, error, count } = await query.range(
        offset,
        offset + limit - 1
      );

      if (error) {
        throw handleDatabaseError(error, "fetch", "published posts", {
          page,
          limit,
          featured,
        });
      }

      return {
        posts: data as BlogPostWithCategory[],
        total: count || 0,
      };
    });
  } catch (error) {
    console.error("Error in getPublishedPosts:", error);
    return { posts: [], total: 0 };
  }
}

// Get all blog posts (for static generation)
export async function getAllBlogPosts(): Promise<BlogPostWithCategory[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw handleDatabaseError(error, "fetch", "all blog posts");
      }

      return data as BlogPostWithCategory[];
    });
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error);
    return [];
  }
}

// Get all featured blog posts
export async function getFeaturedPosts(
  limit = 3
): Promise<BlogPostWithCategory[]> {
  try {
    const { posts } = await getPublishedPosts(1, limit, true);
    return posts;
  } catch (error) {
    console.error("Error in getFeaturedPosts:", error);
    return [];
  }
}

// Get a single blog post by slug
export async function getPostBySlug(
  slug: string
): Promise<BlogPostWithCategoryAndTags | null> {
  if (!slug) {
    console.error("Invalid slug provided to getPostBySlug");
    return null;
  }

  try {
    return await retryOperation(async () => {
      const supabase = createClient();

      const { data: post, error } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `
        )
        .eq("slug", slug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - not found
          return null;
        }
        throw handleDatabaseError(
          error,
          "fetch",
          `blog post with slug ${slug}`,
          { slug }
        );
      }

      if (!post) {
        return null;
      }

      // Transform the tags from the join table format
      const transformedTags = post.blog_post_tags.map(
        (tagJoin: any) => tagJoin.blog_tags
      );

      return {
        ...post,
        tags: transformedTags,
      } as BlogPostWithCategoryAndTags;
    });
  } catch (error) {
    console.error(`Error in getPostBySlug for slug ${slug}:`, error);
    return null;
  }
}

// Get all posts for a specific category
export async function getPostsByCategory(
  slug: string,
  page = 1,
  limit = 10
): Promise<{
  posts: BlogPostWithCategory[];
  total: number;
  category: Category | null;
}> {
  if (!slug) {
    console.error("Invalid category slug provided to getPostsByCategory");
    return { posts: [], total: 0, category: null };
  }

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  try {
    return await retryOperation(async () => {
      const supabase = createClient();
      const offset = (page - 1) * limit;

      // First, get the category
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (categoryError) {
        if (categoryError.code === "PGRST116") {
          // Category not found
          return { posts: [], total: 0, category: null };
        }
        throw handleDatabaseError(
          categoryError,
          "fetch",
          `category with slug ${slug}`,
          { slug }
        );
      }

      if (!category) {
        return { posts: [], total: 0, category: null };
      }

      // Then, get the posts for this category
      const {
        data: posts,
        error: postsError,
        count,
      } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:categories(*)
        `,
          { count: "exact" }
        )
        .eq("category_id", category.id)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (postsError) {
        throw handleDatabaseError(
          postsError,
          "fetch",
          `posts for category ${slug}`,
          {
            categoryId: category.id,
            page,
            limit,
          }
        );
      }

      return {
        posts: posts as BlogPostWithCategory[],
        total: count || 0,
        category,
      };
    });
  } catch (error) {
    console.error(`Error in getPostsByCategory for slug ${slug}:`, error);
    return { posts: [], total: 0, category: null };
  }
}

// Create a new blog post
export async function createPost(
  post: Partial<BlogPost>
): Promise<BlogPost | null> {
  try {
    // Validate required fields
    validateRequiredFields(
      post,
      ["title", "slug", "content", "category_id"],
      "blog post"
    );

    return await retryOperation(async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([post])
        .select()
        .single();

      if (error) {
        throw handleDatabaseError(error, "create", "blog post", { post });
      }

      return data as BlogPost;
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error; // Re-throw for API routes to handle
  }
}

// Update an existing blog post
export async function updatePost(
  id: number,
  post: Partial<BlogPost>
): Promise<BlogPost | null> {
  if (!id || isNaN(id)) {
    throw new Error("Invalid post ID provided to updatePost");
  }

  try {
    return await retryOperation(async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("blog_posts")
        .update(post)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw handleDatabaseError(error, "update", `blog post with ID ${id}`, {
          id,
          post,
        });
      }

      return data as BlogPost;
    });
  } catch (error) {
    console.error(`Error in updatePost for id ${id}:`, error);
    throw error; // Re-throw for API routes to handle
  }
}

// Delete a blog post
export async function deletePost(id: number): Promise<boolean> {
  if (!id || isNaN(id)) {
    throw new Error("Invalid post ID provided to deletePost");
  }

  try {
    return await retryOperation(async () => {
      const supabase = createClient();

      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) {
        throw handleDatabaseError(error, "delete", `blog post with ID ${id}`, {
          id,
        });
      }

      return true;
    });
  } catch (error) {
    console.error(`Error in deletePost for id ${id}:`, error);
    throw error; // Re-throw for API routes to handle
  }
}

// Add these functions at the end of the file

// Get all blog categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await retryOperation(async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        throw handleDatabaseError(error, "fetch", "blog categories");
      }

      return (data as Category[]) || [];
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return [];
  }
}

// Get posts by tag
export async function getPostsByTag(
  slug: string,
  page = 1,
  limit = 10
): Promise<{ posts: BlogPostWithCategory[]; total: number; tag: any | null }> {
  if (!slug) {
    console.error("Invalid tag slug provided to getPostsByTag");
    return { posts: [], total: 0, tag: null };
  }

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  try {
    return await retryOperation(async () => {
      const supabase = createClient();
      const offset = (page - 1) * limit;

      // First, get the tag
      const { data: tag, error: tagError } = await supabase
        .from("blog_tags")
        .select("*")
        .eq("slug", slug)
        .single();

      if (tagError) {
        if (tagError.code === "PGRST116") {
          // Tag not found
          return { posts: [], total: 0, tag: null };
        }
        throw handleDatabaseError(tagError, "fetch", `tag with slug ${slug}`, {
          slug,
        });
      }

      if (!tag) {
        return { posts: [], total: 0, tag: null };
      }

      // Then, get the posts for this tag through the join table
      const { data: postIds, error: postIdsError } = await supabase
        .from("blog_post_tags")
        .select("post_id")
        .eq("tag_id", tag.id);

      if (postIdsError) {
        throw handleDatabaseError(
          postIdsError,
          "fetch",
          `post IDs for tag ${slug}`,
          { tagId: tag.id }
        );
      }

      if (!postIds || postIds.length === 0) {
        return { posts: [], total: 0, tag };
      }

      // Extract the post IDs
      const ids = postIds.map((item) => item.post_id);

      // Finally, get the actual posts
      const {
        data: posts,
        error: postsError,
        count,
      } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          category:categories(*)
        `,
          { count: "exact" }
        )
        .in("id", ids)
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (postsError) {
        throw handleDatabaseError(
          postsError,
          "fetch",
          `posts for tag ${slug}`,
          {
            tagId: tag.id,
            page,
            limit,
          }
        );
      }

      return {
        posts: posts as BlogPostWithCategory[],
        total: count || 0,
        tag,
      };
    });
  } catch (error) {
    console.error(`Error in getPostsByTag for slug ${slug}:`, error);
    return { posts: [], total: 0, tag: null };
  }
}
