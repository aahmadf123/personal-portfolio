import { type NextRequest, NextResponse } from "next/server"
import { searchSimilarDocuments } from "@/lib/vector-database"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Search for similar documents with a lower threshold for better recall
    const similarDocuments = await searchSimilarDocuments(query, 0.5, 5)

    // If no similar documents found, return a generic response
    if (!similarDocuments || similarDocuments.length === 0) {
      return NextResponse.json({
        answer:
          "I don't have specific information about that in my knowledge base. Could you ask something else about Ahmad's portfolio, projects, or skills?",
        sources: [],
      })
    }

    // Prepare context from similar documents
    const context = similarDocuments
      .map((doc) => {
        const metadata = doc.metadata || {}
        const typeInfo = metadata.type ? `[${metadata.type}]` : ""
        const titleInfo = metadata.title ? `"${metadata.title}"` : ""
        const header = [typeInfo, titleInfo].filter(Boolean).join(" ")

        return `${header ? header + ":\n" : ""}${doc.content}`
      })
      .join("\n\n")

    // Generate response using OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for Ahmad's portfolio website. You provide helpful, accurate, and concise information about Ahmad's projects, skills, experience, and content based on the provided context. If the information isn't in the context, say you don't have that specific information rather than making something up. Always maintain a professional, friendly tone.`,
          },
          {
            role: "user",
            content: `Context information is below.
---------------------
${context}
---------------------
Given the context information and not prior knowledge, answer the question: ${query}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    const answer = data.choices[0].message.content

    return NextResponse.json({
      answer,
      sources: similarDocuments.map((doc) => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata || {},
        similarity: doc.similarity,
      })),
    })
  } catch (error) {
    console.error("Error in RAG API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
