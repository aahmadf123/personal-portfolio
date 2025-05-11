import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "../_components/project-form";
import type { Project } from "@/types/projects";
import { updateProject } from "./actions";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", params.id)
    .single();

  if (!project) {
    notFound();
  }

  // Get all tags
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  // Get project tags
  const { data: projectTags } = await supabase
    .from("project_tags")
    .select("tag_id")
    .eq("project_id", project.id);

  const selectedTagIds = projectTags?.map((pt) => pt.tag_id) || [];

  // Get project challenges
  const { data: challenges } = await supabase
    .from("project_challenges")
    .select("*")
    .eq("project_id", project.id);

  // Get project milestones
  const { data: milestones } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_id", project.id)
    .order("due_date");

  const handleUpdateProject = async (formData: FormData) => {
    "use server";
    return updateProject(project.id, selectedTagIds, formData);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>

      <ProjectForm
        project={project as Project}
        tags={tags || []}
        selectedTagIds={selectedTagIds}
        challenges={challenges || []}
        milestones={milestones || []}
        action={handleUpdateProject}
      />
    </div>
  );
}
