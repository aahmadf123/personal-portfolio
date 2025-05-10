import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt, model = "gpt-4o", temperature = 0.7, maxTokens = 1000 } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai(model),
      prompt,
      temperature,
      maxTokens,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in OpenAI API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
