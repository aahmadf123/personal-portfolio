import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// Get a specific blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch blog post with all related data
    const { data: post, error } = await supabase
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
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching blog post ${id}:`, error);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "PGRST116" ? 404 : 500 }
      );
    }

    // Transform the data for the frontend
    const tags = post.blog_post_tags
      ? post.blog_post_tags.map((tag: any) => tag.blog_tags)
      : [];

    const transformedPost = {
      ...post,
      category: post.categories,
      tags: tags,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Update a specific blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract fields to update the blog post
    const {
      title,
      slug,
      excerpt,
      content,
      image_url,
      read_time,
      published,
      featured,
      category_id,
      tags = [],
      ...otherFields
    } = body;

    // Check if new slug already exists (if changed)
    if (slug) {
      const { data: existingPost, error: checkError } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .neq("id", id)
        .maybeSingle();

      if (existingPost) {
        return NextResponse.json(
          {
            error: "Another blog post with this slug already exists",
          },
          { status: 400 }
        );
      }
    }

    // Update the blog post
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
      ...otherFields,
    };

    // Update the main blog post record
    const { data, error } = await supabase
      .from("blog_posts")
      .update(postData)
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating blog post ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle tags update
    if (tags && Array.isArray(tags)) {
      // First delete existing tag relationships
      await supabase.from("blog_post_tags").delete().eq("blog_post_id", id);

      // Then add new tag relationships
      for (const tagName of tags) {
        // Get or create the tag
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");

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
              slug: tagSlug,
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
          blog_post_id: id,
          tag_id: tagId,
        });
      }
    }

    return NextResponse.json({
      message: "Blog post updated successfully",
      id,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Delete a specific blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();

    // Check authentication
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete related records first
    await supabase.from("blog_post_tags").delete().eq("blog_post_id", id);

    // Delete the blog post
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting blog post ${id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
