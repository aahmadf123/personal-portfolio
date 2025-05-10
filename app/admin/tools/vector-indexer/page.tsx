import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VectorDatabaseManager } from "@/components/admin/vector-database-manager"
import RagTest from "@/components/rag-test"

export default function VectorIndexerPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vector Database Management</h1>
        <p className="text-muted-foreground">
          Index and manage your portfolio content for the RAG-powered AI assistant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Indexer</CardTitle>
          <CardDescription>
            Index your portfolio content (projects, blog posts, case studies, etc.) to make it searchable by the AI
            assistant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VectorDatabaseManager />
        </CardContent>
      </Card>

      <RagTest />

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Understanding how the RAG system processes and retrieves your portfolio content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Indexing Process</h3>
              <ol className="space-y-2 pl-5 list-decimal text-muted-foreground">
                <li>Content is extracted from your database (blog posts, projects, etc.)</li>
                <li>Text is chunked into smaller, manageable pieces</li>
                <li>Each chunk is converted into a vector embedding using OpenAI's embedding model</li>
                <li>Embeddings are stored in the vector database with metadata</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Retrieval Process</h3>
              <ol className="space-y-2 pl-5 list-decimal text-muted-foreground">
                <li>User query is converted into a vector embedding</li>
                <li>Vector database finds the most similar content chunks</li>
                <li>Retrieved content is used as context for the AI's response</li>
                <li>AI generates a response based on the retrieved context</li>
              </ol>
            </div>
          </div>

          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 mt-4">
            <p className="text-sm">
              <span className="font-semibold">Note:</span> You should re-index your content whenever you make
              significant updates to your portfolio to ensure the AI assistant has the most up-to-date information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
