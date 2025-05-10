import { portfolioContent } from "@/data/portfolio-content"
import { storeDocument, deleteDocument } from "@/lib/vector-database"

/**
 * Seeds the vector database with portfolio content
 */
export async function seedVectorDatabase() {
  try {
    console.log("Starting vector database seeding...")

    // Process each content item
    for (const item of portfolioContent) {
      console.log(`Processing: ${item.title}`)

      // Store the document in the vector database
      await storeDocument(item.id, item.content, {
        type: item.type,
        title: item.title,
      })
    }

    console.log("Vector database seeding completed successfully")
    return { success: true, count: portfolioContent.length }
  } catch (error) {
    console.error("Error seeding vector database:", error)
    return { success: false, error: String(error) }
  }
}

/**
 * Clears all portfolio content from the vector database
 */
export async function clearVectorDatabase() {
  try {
    console.log("Clearing vector database...")

    // Delete each document
    for (const item of portfolioContent) {
      await deleteDocument(item.id)
    }

    console.log("Vector database cleared successfully")
    return { success: true }
  } catch (error) {
    console.error("Error clearing vector database:", error)
    return { success: false, error: String(error) }
  }
}
