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
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add a system message at the beginning to provide context
    formattedMessages.unshift({
      role: "system",
      content: `You are an AI assistant for a personal portfolio website. Answer questions about the portfolio owner's 
      projects, skills, and background based on the conversation. Be helpful, concise, and professional.
      If you don't know something specific about the portfolio owner, you can provide general advice or ask for more information.
      The portfolio belongs to Ahmad, who specializes in AI, quantum computing, and aerospace engineering.`,
    });

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        messages: formattedMessages,
        maxTokens: 500,
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
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again later." },
      { status: 500 }
    );
  }
}
