import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to get embeddings from OpenAI
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-3-small",
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to get embedding: ${JSON.stringify(error)}`)
  }

  const { data } = await response.json()
  return data[0].embedding
}

// Function to chunk text into smaller pieces
export function chunkText(text: string, maxChunkLength = 1000): string[] {
  const chunks: string[] = []
  let currentChunk = ""

  // Split by paragraphs first
  const paragraphs = text.split(/\n\s*\n/)

  for (const paragraph of paragraphs) {
    // If paragraph is too long, split by sentences
    if (paragraph.length > maxChunkLength) {
      const sentences = paragraph.split(/(?<=[.!?])\s+/)

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxChunkLength) {
          chunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          currentChunk += " " + sentence
        }
      }
    } else {
      if (currentChunk.length + paragraph.length > maxChunkLength) {
        chunks.push(currentChunk.trim())
        currentChunk = paragraph
      } else {
        currentChunk += (currentChunk ? "\n\n" : "") + paragraph
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

// Function to store a document in the vector database
export async function storeDocument(id: string, content: string, metadata: Record<string, any> = {}): Promise<void> {
  try {
    const embedding = await getEmbedding(content)

    const { error } = await supabase.from("vector_store").insert({
      id,
      content,
      metadata,
      embedding,
    })

    if (error) {
      throw new Error(`Failed to store document: ${error.message}`)
    }
  } catch (error) {
    console.error("Error storing document:", error)
    throw error
  }
}

// Function to search for similar documents
export async function searchSimilarDocuments(query: string, threshold = 0.7, limit = 5): Promise<any[]> {
  try {
    const embedding = await getEmbedding(query)

    const { data, error } = await supabase.rpc("match_vectors", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
    })

    if (error) {
      throw new Error(`Failed to search documents: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error searching documents:", error)
    throw error
  }
}

// Function to delete a document from the vector database
export async function deleteDocument(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("vector_store").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}

// Function to get vector database stats
export async function getVectorDatabaseStats(): Promise<{
  totalDocuments: number
  byType: Record<string, number>
}> {
  try {
    const { count, error } = await supabase.from("vector_store").select("*", { count: "exact" })

    if (error) {
      throw new Error(`Failed to get stats: ${error.message}`)
    }

    const { data: typeData, error: typeError } = await supabase.from("vector_store").select("metadata->type")

    if (typeError) {
      throw new Error(`Failed to get type stats: ${typeError.message}`)
    }

    const byType: Record<string, number> = {}
    typeData.forEach((item) => {
      const type = item.metadata?.type || "unknown"
      byType[type] = (byType[type] || 0) + 1
    })

    return {
      totalDocuments: count || 0,
      byType,
    }
  } catch (error) {
    console.error("Error getting stats:", error)
    throw error
  }
}
