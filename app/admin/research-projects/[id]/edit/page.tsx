import { ResearchProjectForm } from "../../_components/research-project-form";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import type { ResearchProject } from "@/types/research-projects";
import { updateResearchProject } from "./actions";

export const metadata = {
  title: "Edit Research Project | Admin",
  description: "Edit an existing research and development project",
};

export default async function EditResearchProjectPage({
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

  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  // Fetch the research project with all related data
  const { data: project, error } = await supabase
    .from("research_projects")
    .select(
      `
      *,
      research_project_tags(id, name),
      research_project_challenges(id, description),
      research_project_updates(id, date, text),
      research_project_team_members(id, name, role, is_lead),
      research_project_resources(id, name, url)
    `
    )
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Process the data to match the expected format
  const processedProject: ResearchProject = {
    ...project,
    tags: project.research_project_tags.map((tag: any) => tag.name),
    challenges: project.research_project_challenges,
    recentUpdates: project.research_project_updates.map((update: any) => ({
      date: update.date,
      text: update.text,
    })),
    teamMembers: project.research_project_team_members.map((member: any) =>
      member.is_lead ? `${member.name} (Lead)` : member.name
    ),
    resources: project.research_project_resources,
  };

  // Use the server action from the imported module
  const actionWithId = async (formData: FormData) => {
    return updateResearchProject(id, formData);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Research Project</h1>

      <ResearchProjectForm project={processedProject} action={actionWithId} />
    </div>
  );
}
