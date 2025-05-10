import type { Metadata } from "next"
import { ProjectEditor } from "@/components/admin/project-editor"

export const metadata: Metadata = {
  title: "Create Project | Admin Dashboard",
  description: "Create a new portfolio project",
}

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
        <p className="text-muted-foreground">Create a new project for your portfolio</p>
      </div>
      <ProjectEditor isNew={true} />
    </div>
  )
}
