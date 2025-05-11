import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase";
import { updateResearchProjectFromGitHub } from "@/lib/github-integration";

// Set to dynamic to ensure this isn't statically generated
export const dynamic = "force-dynamic";

/**
 * Webhook handler for GitHub events
 * This endpoint receives GitHub webhooks and updates research project data
 */
export async function POST(request: Request) {
  try {
    // Get the raw payload
    const payload = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify the webhook signature to ensure it's from GitHub
    if (!verifyGitHubWebhook(payload, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the payload
    const data = JSON.parse(payload);
    const event = request.headers.get("x-github-event");

    console.log(`Received GitHub webhook: ${event}`, {
      repository: data.repository?.full_name,
      sender: data.sender?.login,
      action: data.action,
    });

    // Process different event types
    if (!event) {
      return NextResponse.json(
        { error: "No event type specified" },
        { status: 400 }
      );
    }

    // Handle different types of events
    let result;
    switch (event) {
      case "push":
        result = await handlePushEvent(data);
        break;
      case "issues":
        result = await handleIssuesEvent(data);
        break;
      case "milestone":
        result = await handleMilestoneEvent(data);
        break;
      case "pull_request":
        result = await handlePullRequestEvent(data);
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
        return NextResponse.json({
          message: `Event type '${event}' not handled`,
        });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${event} event`,
      details: result,
    });
  } catch (error) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      {
        error: "Error processing webhook",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Verify the webhook signature from GitHub
 */
function verifyGitHubWebhook(
  payload: string,
  signature?: string | null
): boolean {
  if (!signature) {
    console.error("No signature provided");
    return false;
  }

  // Get webhook secret from environment variables
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error("WEBHOOK_SECRET not configured");
    return false;
  }

  // Calculate expected signature
  const hmac = crypto.createHmac("sha256", secret);
  const calculatedSignature = "sha256=" + hmac.update(payload).digest("hex");

  // Use constant-time comparison to avoid timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
}

/**
 * Handle GitHub push events (commits)
 */
async function handlePushEvent(data: any) {
  try {
    const repoName = data.repository.full_name;
    const commits = data.commits || [];
    const branch = data.ref.replace("refs/heads/", "");

    console.log(
      `Processing ${commits.length} commits to ${branch} branch in ${repoName}`
    );

    if (commits.length === 0) {
      return { message: "No commits to process" };
    }

    // Find the research project associated with this repository
    const supabase = createServerSupabaseClient();
    const { data: projects, error } = await supabase
      .from("research_projects")
      .select("*")
      .containedBy("resources", [{ url: data.repository.html_url }])
      .eq("is_active", true);

    if (error) {
      console.error("Error finding research project:", error);
      return { error: "Database error" };
    }

    if (!projects || projects.length === 0) {
      console.log(`No research project found for repository: ${repoName}`);
      return { message: "No matching research project found" };
    }

    const projectId = projects[0].id;
    console.log(`Found matching research project ID: ${projectId}`);

    // Add commits as updates
    const updates = commits.map((commit) => ({
      research_project_id: projectId,
      date: new Date(commit.timestamp).toISOString(),
      text: `[${branch}] ${commit.message} (${commit.author.name})`,
    }));

    const { error: insertError } = await supabase
      .from("research_project_updates")
      .insert(updates);

    if (insertError) {
      console.error("Error inserting updates:", insertError);
      return { error: "Failed to insert updates" };
    }

    // Update the project's completion if there are many commits
    if (commits.length > 3) {
      await updateResearchProjectFromGitHub(projectId, "push");
    }

    return {
      message: `Added ${commits.length} commits as updates to project ${projectId}`,
      projectId,
    };
  } catch (error) {
    console.error("Error handling push event:", error);
    throw error;
  }
}

/**
 * Handle GitHub issues events
 */
async function handleIssuesEvent(data: any) {
  try {
    const repoName = data.repository.full_name;
    const action = data.action;
    const issue = data.issue;

    console.log(`Processing issue #${issue.number} (${action}) in ${repoName}`);

    // Find the research project associated with this repository
    const supabase = createServerSupabaseClient();
    const { data: projects, error } = await supabase
      .from("research_projects")
      .select("*")
      .containedBy("resources", [{ url: data.repository.html_url }])
      .eq("is_active", true);

    if (error) {
      console.error("Error finding research project:", error);
      return { error: "Database error" };
    }

    if (!projects || projects.length === 0) {
      console.log(`No research project found for repository: ${repoName}`);
      return { message: "No matching research project found" };
    }

    const projectId = projects[0].id;
    console.log(`Found matching research project ID: ${projectId}`);

    // Handle different issue actions
    switch (action) {
      case "opened":
        // Check if issue is labeled as a challenge/blocker
        const isChallenge = issue.labels.some((label: any) =>
          ["challenge", "blocker", "bug", "problem"].includes(
            label.name.toLowerCase()
          )
        );

        if (isChallenge) {
          // Add as a challenge
          const { error: challengeError } = await supabase
            .from("research_project_challenges")
            .insert({
              research_project_id: projectId,
              description: `${issue.title} - ${issue.html_url}`,
            });

          if (challengeError) {
            console.error("Error adding challenge:", challengeError);
            return { error: "Failed to add challenge" };
          }

          return { message: `Added issue #${issue.number} as a challenge` };
        } else {
          // Add as an update
          const { error: updateError } = await supabase
            .from("research_project_updates")
            .insert({
              research_project_id: projectId,
              date: new Date(issue.created_at).toISOString(),
              text: `New issue: ${issue.title} - ${issue.html_url}`,
            });

          if (updateError) {
            console.error("Error adding update:", updateError);
            return { error: "Failed to add update" };
          }

          return { message: `Added issue #${issue.number} as an update` };
        }

      case "closed":
        // Add a closure update
        const { error: closureError } = await supabase
          .from("research_project_updates")
          .insert({
            research_project_id: projectId,
            date: new Date(issue.closed_at).toISOString(),
            text: `Closed issue: ${issue.title} - ${issue.html_url}`,
          });

        if (closureError) {
          console.error("Error adding closure update:", closureError);
          return { error: "Failed to add closure update" };
        }

        // Remove from challenges if it was a challenge
        const { data: challenges } = await supabase
          .from("research_project_challenges")
          .select("id, description")
          .eq("research_project_id", projectId)
          .filter("description", "like", `%${issue.number}%`);

        if (challenges && challenges.length > 0) {
          await supabase
            .from("research_project_challenges")
            .delete()
            .in(
              "id",
              challenges.map((c) => c.id)
            );

          console.log(`Removed closed issue #${issue.number} from challenges`);
        }

        // Update project completion
        await updateResearchProjectFromGitHub(projectId, "issue_closed");

        return { message: `Processed closed issue #${issue.number}` };

      default:
        return { message: `Issue action '${action}' not handled` };
    }
  } catch (error) {
    console.error("Error handling issues event:", error);
    throw error;
  }
}

/**
 * Handle GitHub milestone events
 */
async function handleMilestoneEvent(data: any) {
  try {
    const repoName = data.repository.full_name;
    const action = data.action;
    const milestone = data.milestone;

    console.log(
      `Processing milestone "${milestone.title}" (${action}) in ${repoName}`
    );

    // Find the research project associated with this repository
    const supabase = createServerSupabaseClient();
    const { data: projects, error } = await supabase
      .from("research_projects")
      .select("*")
      .containedBy("resources", [{ url: data.repository.html_url }])
      .eq("is_active", true);

    if (error) {
      console.error("Error finding research project:", error);
      return { error: "Database error" };
    }

    if (!projects || projects.length === 0) {
      console.log(`No research project found for repository: ${repoName}`);
      return { message: "No matching research project found" };
    }

    const projectId = projects[0].id;
    console.log(`Found matching research project ID: ${projectId}`);

    // Handle different milestone actions
    switch (action) {
      case "created":
      case "opened":
        // Update the next_milestone field
        const { error: updateError } = await supabase
          .from("research_projects")
          .update({
            next_milestone: `${milestone.title} (due ${new Date(
              milestone.due_on
            ).toLocaleDateString()})`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", projectId);

        if (updateError) {
          console.error("Error updating milestone:", updateError);
          return { error: "Failed to update milestone" };
        }

        // Add an update about the new milestone
        await supabase.from("research_project_updates").insert({
          research_project_id: projectId,
          date: new Date().toISOString(),
          text: `New milestone: ${milestone.title} - due ${new Date(
            milestone.due_on
          ).toLocaleDateString()}`,
        });

        return { message: `Updated next milestone to "${milestone.title}"` };

      case "closed":
        // Add a closure update
        await supabase.from("research_project_updates").insert({
          research_project_id: projectId,
          date: new Date().toISOString(),
          text: `Completed milestone: ${milestone.title}`,
        });

        // Update completion percentage
        await updateResearchProjectFromGitHub(projectId, "milestone_closed");

        return {
          message: `Processed completed milestone "${milestone.title}"`,
        };

      default:
        return { message: `Milestone action '${action}' not handled` };
    }
  } catch (error) {
    console.error("Error handling milestone event:", error);
    throw error;
  }
}

/**
 * Handle GitHub pull request events
 */
async function handlePullRequestEvent(data: any) {
  try {
    const repoName = data.repository.full_name;
    const action = data.action;
    const pr = data.pull_request;

    console.log(`Processing PR #${pr.number} (${action}) in ${repoName}`);

    // Find the research project associated with this repository
    const supabase = createServerSupabaseClient();
    const { data: projects, error } = await supabase
      .from("research_projects")
      .select("*")
      .containedBy("resources", [{ url: data.repository.html_url }])
      .eq("is_active", true);

    if (error) {
      console.error("Error finding research project:", error);
      return { error: "Database error" };
    }

    if (!projects || projects.length === 0) {
      console.log(`No research project found for repository: ${repoName}`);
      return { message: "No matching research project found" };
    }

    const projectId = projects[0].id;
    console.log(`Found matching research project ID: ${projectId}`);

    // Handle different PR actions
    switch (action) {
      case "opened":
        // Add as an update
        const { error: updateError } = await supabase
          .from("research_project_updates")
          .insert({
            research_project_id: projectId,
            date: new Date(pr.created_at).toISOString(),
            text: `New PR: ${pr.title} - ${pr.html_url}`,
          });

        if (updateError) {
          console.error("Error adding PR update:", updateError);
          return { error: "Failed to add PR update" };
        }

        return { message: `Added PR #${pr.number} as an update` };

      case "closed":
        let updateText = `Closed PR: ${pr.title} - ${pr.html_url}`;
        if (pr.merged) {
          updateText = `Merged PR: ${pr.title} - ${pr.html_url}`;

          // Update completion percentage if PR was merged
          await updateResearchProjectFromGitHub(projectId, "pr_merged");
        }

        // Add a closure update
        const { error: closureError } = await supabase
          .from("research_project_updates")
          .insert({
            research_project_id: projectId,
            date: new Date(pr.closed_at).toISOString(),
            text: updateText,
          });

        if (closureError) {
          console.error("Error adding PR closure update:", closureError);
          return { error: "Failed to add PR closure update" };
        }

        return {
          message: `Processed ${pr.merged ? "merged" : "closed"} PR #${
            pr.number
          }`,
        };

      default:
        return { message: `PR action '${action}' not handled` };
    }
  } catch (error) {
    console.error("Error handling pull request event:", error);
    throw error;
  }
}
