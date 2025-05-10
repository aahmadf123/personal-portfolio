import { createClient } from "@/lib/supabase"
import { notFound, redirect } from "next/navigation"
import { LivePostEditor } from "../../_components/live-post-editor"
import { getAllCategories } from "@/lib/blog-service"

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch post data
  const { data: post } = await supabase.from("blog_posts").select("*, categories(*)").eq("id", params.id).single()

  if (!post) {
    notFound()
  }

  // Fetch tags
  const { data: tags } = await supabase.from("tags").select("*").order("name")

  // Fetch post tags
  const { data: postTags } = await supabase.from("post_tags").select("tag_id").eq("post_id", params.id)

  const selectedTagIds = postTags?.map((pt) => pt.tag_id) || []

  // Fetch all categories for dropdown
  const categories = await getAllCategories()

  async function updatePost(formData: FormData) {
    "use server"

    const supabase = createClient()

    // Extract post data
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const published = formData.get("published") === "true"
    const category_id = Number.parseInt(formData.get("category_id") as string)
    const image_url = formData.get("image_url") as string
    const read_time = formData.get("read_time") as string

    // Update post
    await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        published,
        category_id,
        image_url,
        read_time,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    // Handle tags
    const selectedTags = formData.getAll("tags") as string[]
    const selectedTagIdsNew = selectedTags.map(Number)

    // Delete removed tags
    await supabase
      .from("post_tags")
      .delete()
      .eq("post_id", params.id)
      .not("tag_id", "in", `(${selectedTagIdsNew.join(",")})`)

    // Add new tags
    const newTagIds = selectedTagIdsNew.filter((id) => !selectedTagIds.includes(id))
    if (newTagIds.length > 0) {
      const newPostTags = newTagIds.map((tag_id) => ({
        post_id: Number.parseInt(params.id),
        tag_id,
      }))

      await supabase.from("post_tags").insert(newPostTags)
    }

    redirect("/admin/blog")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

      <LivePostEditor
        post={post}
        categories={categories}
        tags={tags || []}
        selectedTagIds={selectedTagIds}
        action={updatePost}
      />
    </div>
  )
}
