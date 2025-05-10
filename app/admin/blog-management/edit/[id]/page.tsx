import type { Metadata } from "next"
import { BlogPostEditor } from "@/components/admin/blog-post-editor"

export const metadata: Metadata = {
  title: "Edit Blog Post | Admin Dashboard",
  description: "Edit an existing blog post",
}

export default function EditBlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">Edit an existing blog post</p>
      </div>
      <BlogPostEditor postId={params.id} />
    </div>
  )
}
