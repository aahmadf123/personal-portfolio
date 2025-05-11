import { ResearchProjectForm } from "../_components/research-project-form";
import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { createResearchProject } from "./actions";

export const metadata = {
  title: "Create Research Project | Admin",
  description: "Create a new research and development project",
};

export default async function NewResearchProjectPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Research Project</h1>

      <ResearchProjectForm action={createResearchProject} />
    </div>
  );
}
