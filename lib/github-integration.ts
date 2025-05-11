import { createServerSupabaseClient } from "./supabase";

/**
 * Types of GitHub events that can trigger project updates
 */
export type GitHubEventType =
  | "push"
  | "issue_opened"
  | "issue_closed"
  | "milestone_created"
  | "milestone_closed"
  | "pr_opened"
  | "pr_merged"
  | "pr_closed";

/**
 * Updates a research project's completion and other metrics based on GitHub events
 * @param projectId The ID of the research project to update
 * @param eventType The type of GitHub event that triggered the update
 */
export async function updateResearchProjectFromGitHub(
  projectId: number,
  eventType: GitHubEventType
): Promise<boolean> {
  try {
    console.log(
      `Updating research project ${projectId} from GitHub ${eventType} event`
    );

    const supabase = createServerSupabaseClient();

    // First, get the current project state
    const { data: project, error } = await supabase
      .from("research_projects")
      .select(
        `
        *,
        research_project_challenges(count),
        research_project_updates(count)
      `
      )
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching research project:", error);
      return false;
    }

    if (!project) {
      console.error(`Research project ${projectId} not found`);
      return false;
    }

    // Calculate new completion percentage based on event type
    let newCompletion = project.completion || 0;
    let newMilestone = project.next_milestone;

    // Different event types affect completion differently
    switch (eventType) {
      case "push":
        // Small bump for regular commits
        newCompletion += 1;
        break;
      case "issue_closed":
        // Medium bump for closing issues
        newCompletion += 3;
        break;
      case "milestone_closed":
        // Big bump for completing milestones
        newCompletion += 10;
        // Clear the next milestone if it was completed
        newMilestone = null;
        break;
      case "pr_merged":
        // Large bump for merging pull requests
        newCompletion += 5;
        break;
      default:
        // Other events don't affect completion directly
        break;
    }

    // Calculate total completion based on project age, challenges, and updates
    const today = new Date();
    const startDate = project.start_date ? new Date(project.start_date) : today;
    const endDate = project.end_date ? new Date(project.end_date) : today;

    // Project timeline progress (as percentage of time elapsed)
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();
    const timelineProgress =
      totalDuration <= 0
        ? 0
        : Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));

    // Weight the different factors
    // - Timeline progress: 20%
    // - GitHub activity completion: 60%
    // - Subjective completion: 20% (preserved from original value)

    // Cap the activity-based completion at 100
    newCompletion = Math.min(100, Math.max(0, newCompletion));

    // Calculate weighted completion
    const weightedCompletion = Math.round(
      timelineProgress * 0.2 + newCompletion * 0.6 + project.completion * 0.2
    );

    // Update the project with new completion percentage
    const { error: updateError } = await supabase
      .from("research_projects")
      .update({
        completion: weightedCompletion,
        next_milestone: newMilestone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("Error updating research project completion:", updateError);
      return false;
    }

    console.log(
      `Updated research project ${projectId} completion to ${weightedCompletion}%`
    );
    return true;
  } catch (error) {
    console.error("Error updating research project from GitHub:", error);
    return false;
  }
}

/**
 * Retrieves GitHub statistics for a repository
 * This could be expanded to get more detailed stats in the future
 */
export async function getGitHubRepositoryStats(repoUrl: string): Promise<any> {
  try {
    if (!repoUrl) {
      throw new Error("Repository URL is required");
    }

    // Extract owner and repo from the URL
    // GitHub URL format: https://github.com/owner/repo
    const urlParts = repoUrl.split("/");
    if (urlParts.length < 5 || urlParts[2] !== "github.com") {
      throw new Error("Invalid GitHub repository URL");
    }

    const owner = urlParts[3];
    const repo = urlParts[4];

    // GitHub API requires authentication
    const token = process.env.GITHUB_TOKEN || process.env.API_TOKEN;
    if (!token) {
      console.warn("No GitHub token found, API calls may be rate limited");
    }

    // Base fetch options with auth if available
    const fetchOptions: RequestInit = {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(token ? { Authorization: `token ${token}` } : {}),
      },
    };

    // Get repository info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      fetchOptions
    );
    if (!repoResponse.ok) {
      throw new Error(
        `GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`
      );
    }

    const repoData = await repoResponse.json();

    // Get recent commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
      fetchOptions
    );
    if (!commitsResponse.ok) {
      throw new Error(
        `GitHub API error: ${commitsResponse.status} ${commitsResponse.statusText}`
      );
    }

    const commitsData = await commitsResponse.json();

    // Get open issues
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=10`,
      fetchOptions
    );
    if (!issuesResponse.ok) {
      throw new Error(
        `GitHub API error: ${issuesResponse.status} ${issuesResponse.statusText}`
      );
    }

    const issuesData = await issuesResponse.json();

    // Get milestones
    const milestonesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/milestones?state=open&per_page=5`,
      fetchOptions
    );
    if (!milestonesResponse.ok) {
      throw new Error(
        `GitHub API error: ${milestonesResponse.status} ${milestonesResponse.statusText}`
      );
    }

    const milestonesData = await milestonesResponse.json();

    // Return combined stats
    return {
      repository: {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        language: repoData.language,
      },
      commits: commitsData.map((commit: any) => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message.split("\n")[0], // First line of commit message
        author: commit.commit.author.name,
        date: commit.commit.author.date,
      })),
      issues: issuesData.map((issue: any) => ({
        number: issue.number,
        title: issue.title,
        created_at: issue.created_at,
        labels: issue.labels.map((label: any) => label.name),
      })),
      milestones: milestonesData.map((milestone: any) => ({
        title: milestone.title,
        description: milestone.description,
        due_on: milestone.due_on,
        open_issues: milestone.open_issues,
        closed_issues: milestone.closed_issues,
      })),
    };
  } catch (error) {
    console.error("Error fetching GitHub repository stats:", error);
    throw error;
  }
}

/**
 * Synchronize a research project with its GitHub repository
 * This function fetches latest GitHub data and updates the project accordingly
 */
export async function syncResearchProjectWithGitHub(
  projectId: number
): Promise<boolean> {
  try {
    console.log(`Synchronizing research project ${projectId} with GitHub`);

    const supabase = createServerSupabaseClient();

    // Get the project with its GitHub repository URL
    const { data: project, error } = await supabase
      .from("research_projects")
      .select(
        `
        *,
        research_project_resources(name, url)
      `
      )
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching research project:", error);
      return false;
    }

    if (!project) {
      console.error(`Research project ${projectId} not found`);
      return false;
    }

    // Find GitHub repository URL in resources
    const githubResource = project.research_project_resources.find((r: any) =>
      r.url.includes("github.com")
    );

    if (!githubResource) {
      console.warn(
        `No GitHub repository found for research project ${projectId}`
      );
      return false;
    }

    // Get GitHub stats for the repository
    const repositoryStats = await getGitHubRepositoryStats(githubResource.url);

    // Update next milestone if any are available
    let nextMilestone = project.next_milestone;
    if (repositoryStats.milestones && repositoryStats.milestones.length > 0) {
      const milestone = repositoryStats.milestones[0];
      nextMilestone = `${milestone.title} (due ${new Date(
        milestone.due_on
      ).toLocaleDateString()})`;
    }

    // Add recent commits as updates
    if (repositoryStats.commits && repositoryStats.commits.length > 0) {
      const commitUpdates = repositoryStats.commits.map((commit: any) => ({
        research_project_id: projectId,
        date: new Date(commit.date).toISOString(),
        text: `[GitHub] ${commit.message} (${commit.author})`,
      }));

      // Check which commits are new by comparing messages
      const { data: existingUpdates } = await supabase
        .from("research_project_updates")
        .select("text")
        .eq("research_project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(20);

      const existingTexts = existingUpdates?.map((u: any) => u.text) || [];
      const newCommitUpdates = commitUpdates.filter(
        (update) => !existingTexts.some((text) => text.includes(update.text))
      );

      if (newCommitUpdates.length > 0) {
        await supabase
          .from("research_project_updates")
          .insert(newCommitUpdates);
        console.log(`Added ${newCommitUpdates.length} new commit updates`);
      }
    }

    // Add current issues as challenges
    if (repositoryStats.issues && repositoryStats.issues.length > 0) {
      const issueLabels = ["bug", "challenge", "blocker", "problem"];
      const challenges = repositoryStats.issues
        .filter((issue: any) =>
          issue.labels.some((label: string) =>
            issueLabels.includes(label.toLowerCase())
          )
        )
        .map((issue: any) => ({
          research_project_id: projectId,
          description: `${issue.title} (Issue #${issue.number})`,
        }));

      if (challenges.length > 0) {
        // Check which challenges are new
        const { data: existingChallenges } = await supabase
          .from("research_project_challenges")
          .select("description")
          .eq("research_project_id", projectId);

        const existingDescriptions =
          existingChallenges?.map((c: any) => c.description) || [];
        const newChallenges = challenges.filter(
          (challenge) =>
            !existingDescriptions.some((desc) =>
              desc.includes(challenge.description)
            )
        );

        if (newChallenges.length > 0) {
          await supabase
            .from("research_project_challenges")
            .insert(newChallenges);
          console.log(
            `Added ${newChallenges.length} new challenges from GitHub issues`
          );
        }
      }
    }

    // Update the project with GitHub stats and next milestone
    const { error: updateError } = await supabase
      .from("research_projects")
      .update({
        next_milestone: nextMilestone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      console.error(
        "Error updating research project with GitHub data:",
        updateError
      );
      return false;
    }

    console.log(
      `Successfully synchronized research project ${projectId} with GitHub`
    );
    return true;
  } catch (error) {
    console.error("Error synchronizing research project with GitHub:", error);
    return false;
  }
}
