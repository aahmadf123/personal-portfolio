import { NextResponse, type NextRequest } from "next/server"
import { getResearchProjectById, updateResearchProject, deleteResearchProject } from "@/lib/research-project-service"

export const dynamic = "force-dynamic" // Make this route dynamic

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const project = await getResearchProjectById(id)

    if (!project) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error(`Error fetching research project with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch research project" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const project = await getResearchProjectById(id)

    if (!project) {
      return NextResponse.json({ error: "Research project not found" }, { status: 404 })
    }

    const data = await request.json()

    // Update only the fields that are provided
    const updatedProject = await updateResearchProject(id, {
      ...project,
      ...data,
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error(`Error updating research project with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update research project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const success = await deleteResearchProject(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete research project" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting research project with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete research project" }, { status: 500 })
  }
}
