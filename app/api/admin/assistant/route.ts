import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Force dynamic to ensure the API is always fresh
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured");
      return NextResponse.json(
        {
          error:
            "OpenAI API key is not configured. Please add it to your environment variables.",
        },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Create a properly formatted messages array for the OpenAI API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add a system message at the beginning to provide context
    formattedMessages.unshift({
      role: "system",
      content: `You are an AI assistant specifically designed to help the portfolio owner (Ahmad) with content creation, 
      editing, and management for their portfolio website. Your primary functions include:
      
      1. Helping draft or improve project descriptions
      2. Suggesting content ideas for blog posts or case studies
      3. Editing and refining existing content
      4. Brainstorming new portfolio sections or features
      5. Providing SEO suggestions for portfolio content
      6. Helping create technical documentation
      7. Suggesting improvements to existing content
      
      Be creative, professional, and focused on helping improve the portfolio. Provide specific, actionable suggestions
      and be willing to iterate on content based on feedback. When appropriate, structure your responses with headings,
      bullet points, or other formatting to improve readability.`,
    });

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        messages: formattedMessages,
        maxTokens: 1000,
        temperature: 0.7,
      });

      return NextResponse.json({ response: text });
    } catch (aiError: any) {
      console.error("AI generation error:", aiError);
      // Check for specific OpenAI errors
      if (aiError.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      throw aiError; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error("Error in admin assistant API:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again later." },
      { status: 500 }
    );
  }
}
