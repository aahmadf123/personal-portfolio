import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { ProjectForm } from "../_components/project-form";
import { createProject } from "./actions";

export default async function NewProjectPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Get all tags
  const { data: tags } = await supabase.from("tags").select("*").order("name");

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      <ProjectForm
        tags={tags || []}
        selectedTagIds={[]}
        challenges={[]}
        milestones={[]}
        action={createProject}
      />
    </div>
  );
}
