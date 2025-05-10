import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// Fetch all blog posts for admin
export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch blog posts with related data
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        categories(*),
        blog_post_tags(
          blog_tags(*)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data for frontend
    const transformedPosts = posts.map((post) => {
      // Extract tags from the nested structure
      const tags = post.blog_post_tags
        ? post.blog_post_tags.map((tag: any) => tag.blog_tags)
        : [];

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        image_url: post.image_url,
        published: post.published,
        featured: post.featured,
        read_time: post.read_time,
        view_count: post.view_count || 0,
        category: post.categories,
        tags: tags,
        created_at: post.created_at,
        updated_at: post.updated_at,
      };
    });

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract fields for new post
    const {
      title,
      slug,
      excerpt,
      content,
      image_url,
      read_time,
      published = false,
      featured = false,
      category_id = null,
      tags = [],
      ...otherFields
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        {
          error: "Title, slug, excerpt, and content are required",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingPost, error: checkError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingPost) {
      return NextResponse.json(
        {
          error: "A blog post with this slug already exists",
        },
        { status: 400 }
      );
    }

    // Get user ID for author
    const author_id = session.session.user.id;

    // Create the blog post record
    const postData = {
      title,
      slug,
      excerpt,
      content,
      image_url,
      read_time,
      published,
      featured,
      category_id,
      author_id,
      ...otherFields,
    };

    const { data: newPost, error: createError } = await supabase
      .from("blog_posts")
      .insert(postData)
      .select();

    if (createError) {
      console.error("Error creating blog post:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    const postId = newPost[0].id;

    // Handle tags
    if (tags.length > 0) {
      // First, make sure all tags exist in the blog_tags table
      for (const tagName of tags) {
        // Get or create the tag
        const slug = tagName.toLowerCase().replace(/\s+/g, "-");

        // Check if tag exists
        const { data: existingTag, error: tagCheckError } = await supabase
          .from("blog_tags")
          .select("id")
          .eq("name", tagName)
          .maybeSingle();

        if (tagCheckError) {
          console.error("Error checking tag:", tagCheckError);
          continue;
        }

        // If tag doesn't exist, create it
        let tagId;

        if (!existingTag) {
          const { data: newTag, error: tagCreateError } = await supabase
            .from("blog_tags")
            .insert({
              name: tagName,
              slug: slug,
              description: `Posts tagged with ${tagName}`,
            })
            .select();

          if (tagCreateError) {
            console.error("Error creating tag:", tagCreateError);
            continue;
          }

          tagId = newTag[0].id;
        } else {
          tagId = existingTag.id;
        }

        // Create the blog_post_tags relationship
        await supabase.from("blog_post_tags").insert({
          blog_post_id: postId,
          tag_id: tagId,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Blog post created successfully",
        id: postId,
        slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
