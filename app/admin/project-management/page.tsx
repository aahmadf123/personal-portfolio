import type { Metadata } from "next"
import { ProjectManager } from "@/components/admin/project-manager"

export const metadata: Metadata = {
  title: "Project Management | Admin Dashboard",
  description: "Manage your portfolio projects",
}

export default function ProjectManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <p className="text-muted-foreground">Create, edit, and manage your portfolio projects</p>
      </div>
      <ProjectManager />
    </div>
  )
}
