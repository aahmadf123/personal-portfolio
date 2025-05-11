import { createClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import { LivePostEditor } from "../../_components/live-post-editor";
import { getAllCategories } from "@/lib/blog-service";
import { updatePost } from "./actions";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Fetch post data
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, categories(*)")
    .eq("id", params.id)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch tags
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  // Fetch post tags
  const { data: postTags } = await supabase
    .from("post_tags")
    .select("tag_id")
    .eq("post_id", params.id);

  const selectedTagIds = postTags?.map((pt) => pt.tag_id) || [];

  // Fetch all categories for dropdown
  const categories = await getAllCategories();

  const handleUpdatePost = (formData: FormData) => {
    return updatePost(params.id, selectedTagIds, formData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

      <LivePostEditor
        post={post}
        categories={categories}
        tags={tags || []}
        selectedTagIds={selectedTagIds}
        action={handleUpdatePost}
      />
    </div>
  );
}
