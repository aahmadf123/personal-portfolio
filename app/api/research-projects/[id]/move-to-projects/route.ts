import { NextResponse, type NextRequest } from "next/server"
import { moveToProjects } from "@/lib/research-project-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const success = await moveToProjects(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to move research project to projects" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error moving research project with ID ${params.id} to projects:`, error)
    return NextResponse.json({ error: "Failed to move research project to projects" }, { status: 500 })
  }
}
