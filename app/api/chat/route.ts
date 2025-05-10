import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    const { messages } = await req.json()

    // Create a properly formatted messages array for the OpenAI API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add a system message at the beginning to provide context
    formattedMessages.unshift({
      role: "system",
      content: `You are an AI assistant for a personal portfolio website. Answer questions about the portfolio owner's 
      projects, skills, and background based on the conversation. Be helpful, concise, and professional.
      If you don't know something specific about the portfolio owner, you can provide general advice or ask for more information.
      The portfolio belongs to Ahmad, who specializes in AI, quantum computing, and aerospace engineering.`,
    })

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: formattedMessages,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
