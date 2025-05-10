import { NextResponse } from "next/server"
import { getAllSkills } from "@/lib/skill-service"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic" // Never cache this route

export async function GET() {
  try {
    const skills = await getAllSkills()
    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

// Add a revalidation endpoint
export async function POST(request: Request) {
  try {
    const { secret } = await request.json()

    // Check for a secret to prevent unauthorized revalidations
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    // Revalidate the skills path
    revalidatePath("/api/skills")
    revalidatePath("/")

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error("Error revalidating:", error)
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 })
  }
}
