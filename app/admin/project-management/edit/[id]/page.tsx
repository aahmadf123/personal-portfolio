import type { Metadata } from "next"
import { ProjectEditor } from "@/components/admin/project-editor"

export const metadata: Metadata = {
  title: "Edit Project | Admin Dashboard",
  description: "Edit an existing portfolio project",
}

export default function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">Edit an existing portfolio project</p>
      </div>
      <ProjectEditor projectId={params.id} />
    </div>
  )
}
