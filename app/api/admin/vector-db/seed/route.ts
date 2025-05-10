import { NextResponse } from "next/server"
import { seedVectorDatabase, clearVectorDatabase } from "@/lib/seed-vector-db"

export async function POST(request: Request) {
  try {
    // Check for admin authorization (in a real app, you'd implement proper auth)
    // This is just a simple example
    const { authorization } = await request.json()

    if (authorization !== "admin-secret") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await seedVectorDatabase()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in seed API:", error)
    return NextResponse.json({ error: "Failed to seed vector database" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Check for admin authorization
    const { authorization } = await request.json()

    if (authorization !== "admin-secret") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await clearVectorDatabase()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in clear API:", error)
    return NextResponse.json({ error: "Failed to clear vector database" }, { status: 500 })
  }
}
