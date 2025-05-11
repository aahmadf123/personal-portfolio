"use server";

import { createServerSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function updateProject(
  projectId: number,
  selectedTagIds: number[],
  formData: FormData
) {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  // Extract project data
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const completion = Number.parseInt(formData.get("completion") as string);
  const start_date = formData.get("start_date") as string;
  const end_date = (formData.get("end_date") as string) || null;
  const priority = formData.get("priority") as string;
  const image_url = formData.get("image_url") as string;
  const github_url = formData.get("github_url") as string;
  const demo_url = formData.get("demo_url") as string;
  const role = formData.get("role") as string;
  const team_size = Number.parseInt(formData.get("team_size") as string) || 1;
  const detailed_description = formData.get("detailed_description") as string;

  // Process arrays
  const key_achievements = formData.get("key_achievements") as string;
  const technologies = formData.get("technologies") as string;

  const key_achievements_array = key_achievements
    ? key_achievements.split("\n").filter((item) => item.trim() !== "")
    : [];

  const technologies_array = technologies
    ? technologies
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
    : [];

  // Update project
  await supabase
    .from("projects")
    .update({
      title,
      slug,
      description,
      completion,
      start_date,
      end_date,
      priority,
      image_url,
      github_url,
      demo_url,
      role,
      team_size,
      detailed_description,
      key_achievements: key_achievements_array,
      technologies: technologies_array,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);

  // Handle tags
  const selectedTags = formData.getAll("tags") as string[];
  const selectedTagIdsNew = selectedTags.map(Number);

  // Delete removed tags
  await supabase
    .from("project_tags")
    .delete()
    .eq("project_id", projectId)
    .not("tag_id", "in", `(${selectedTagIdsNew.join(",")})`);

  // Add new tags
  const newTagIds = selectedTagIdsNew.filter(
    (id) => !selectedTagIds.includes(id)
  );
  if (newTagIds.length > 0) {
    const newProjectTags = newTagIds.map((tag_id) => ({
      project_id: projectId,
      tag_id,
    }));

    await supabase.from("project_tags").insert(newProjectTags);
  }

  // Handle challenges
  const challengeIds = formData.getAll("challenge_id") as string[];
  const challengeDescriptions = formData.getAll(
    "challenge_description"
  ) as string[];
  const newChallengeDescriptions = formData.getAll("new_challenge") as string[];

  // Update existing challenges
  for (let i = 0; i < challengeIds.length; i++) {
    if (challengeDescriptions[i]) {
      await supabase
        .from("project_challenges")
        .update({ description: challengeDescriptions[i] })
        .eq("id", challengeIds[i]);
    }
  }

  // Add new challenges
  const newChallenges = newChallengeDescriptions
    .filter((desc) => desc.trim() !== "")
    .map((description) => ({
      project_id: projectId,
      description,
    }));

  if (newChallenges.length > 0) {
    await supabase.from("project_challenges").insert(newChallenges);
  }

  // Handle milestones
  const milestoneIds = formData.getAll("milestone_id") as string[];
  const milestoneDescriptions = formData.getAll(
    "milestone_description"
  ) as string[];
  const milestoneDueDates = formData.getAll("milestone_due_date") as string[];
  const milestoneCompleted = formData.getAll("milestone_completed") as string[];
  const newMilestoneDescriptions = formData.getAll(
    "new_milestone_description"
  ) as string[];
  const newMilestoneDueDates = formData.getAll(
    "new_milestone_due_date"
  ) as string[];
  const newMilestoneCompleted = formData.getAll(
    "new_milestone_completed"
  ) as string[];

  // Update existing milestones
  for (let i = 0; i < milestoneIds.length; i++) {
    await supabase
      .from("project_milestones")
      .update({
        description: milestoneDescriptions[i],
        due_date: milestoneDueDates[i] || null,
        completed: milestoneCompleted[i] === "true",
      })
      .eq("id", milestoneIds[i]);
  }

  // Add new milestones
  const newMilestones = [];
  for (let i = 0; i < newMilestoneDescriptions.length; i++) {
    if (newMilestoneDescriptions[i].trim() !== "") {
      newMilestones.push({
        project_id: projectId,
        description: newMilestoneDescriptions[i],
        due_date: newMilestoneDueDates[i] || null,
        completed: newMilestoneCompleted[i] === "true",
      });
    }
  }

  if (newMilestones.length > 0) {
    await supabase.from("project_milestones").insert(newMilestones);
  }

  redirect("/admin/projects");
}
