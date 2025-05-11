import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { LivePostEditor } from "../_components/live-post-editor";
import { getAllCategories } from "@/lib/blog-service";
import { createPost } from "./actions";

export default async function NewBlogPostPage() {
  const supabase = createClient();

  // Fetch all categories for dropdown
  const categories = await getAllCategories();

  // Fetch all tags
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

      <LivePostEditor
        categories={categories}
        tags={tags || []}
        selectedTagIds={[]}
        action={createPost}
      />
    </div>
  );
}
