import type { Metadata } from "next";
import { getProjects } from "@/lib/supabase-content";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
  title: "Projects | Ahmad Firas",
  description:
    "Explore my projects in computer science, engineering, and data science",
};

// Set revalidation to ensure fresh data
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
  console.log("Rendering ProjectsPage");
  const projects = await getProjects();

  return <ProjectsClient projects={projects} />;
}
