import { type NextRequest, NextResponse } from "next/server"
import { marked } from "marked"
import DOMPurify from "isomorphic-dompurify"

export async function POST(request: NextRequest) {
  try {
    const { markdown } = await request.json()

    if (!markdown) {
      return NextResponse.json({ error: "Markdown content is required" }, { status: 400 })
    }

    // Convert markdown to HTML
    const rawHtml = marked.parse(markdown)

    // Sanitize HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(rawHtml)

    return NextResponse.json({ html: sanitizedHtml })
  } catch (error) {
    console.error("Error in markdown preview API:", error)
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 })
  }
}
