"use server";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = createClient();

  // Extract post data
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "true";
  const category_id = Number.parseInt(formData.get("category_id") as string);
  const image_url = formData.get("image_url") as string;
  const read_time = formData.get("read_time") as string;

  // Create post
  const { data: post } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      published,
      category_id,
      image_url,
      read_time,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (!post) {
    throw new Error("Failed to create post");
  }

  // Handle tags
  const selectedTags = formData.getAll("tags") as string[];
  if (selectedTags.length > 0) {
    const postTags = selectedTags.map((tagId) => ({
      post_id: post.id,
      tag_id: Number.parseInt(tagId),
    }));

    await supabase.from("post_tags").insert(postTags);
  }

  redirect("/admin/blog");
}
