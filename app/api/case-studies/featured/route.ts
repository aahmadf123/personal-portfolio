import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return empty object for now
    return NextResponse.json({ caseStudy: null })
  } catch (error) {
    console.error("Error fetching featured case study:", error)
    return NextResponse.json({ error: "Failed to fetch featured case study" }, { status: 500 })
  }
}
