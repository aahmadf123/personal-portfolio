import type { Metadata } from "next"
import { BlogPostEditor } from "@/components/admin/blog-post-editor"

export const metadata: Metadata = {
  title: "Create Blog Post | Admin Dashboard",
  description: "Create a new blog post",
}

export default function CreateBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
        <p className="text-muted-foreground">Create a new blog post for your portfolio</p>
      </div>
      <BlogPostEditor isNew={true} />
    </div>
  )
}
