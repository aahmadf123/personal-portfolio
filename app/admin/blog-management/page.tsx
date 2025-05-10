import type { Metadata } from "next"
import { BlogPostManager } from "@/components/admin/blog-post-manager"

export const metadata: Metadata = {
  title: "Blog Management | Admin Dashboard",
  description: "Manage your blog posts",
}

export default function BlogManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-muted-foreground">Create, edit, and manage your blog posts</p>
      </div>
      <BlogPostManager />
    </div>
  )
}
