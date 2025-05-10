import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read the file content
    const fileBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(fileBuffer)

    let extractedText = ""

    // Extract text based on file type
    if (file.name.endsWith(".pdf")) {
      // For a real implementation, you would use a PDF parsing library
      // This is a placeholder for demonstration
      extractedText = "Extracted text from PDF would appear here."
    } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
      // For a real implementation, you would use a DOCX parsing library
      // This is a placeholder for demonstration
      extractedText = "Extracted text from Word document would appear here."
    } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      // For text files, we can just read the content directly
      extractedText = new TextDecoder().decode(fileContent)
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    return NextResponse.json({ text: extractedText })
  } catch (error) {
    console.error("Error extracting document text:", error)
    return NextResponse.json({ error: "Failed to extract text from document" }, { status: 500 })
  }
}
