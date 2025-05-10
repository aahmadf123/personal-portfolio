import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            AI Portfolio Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ask questions about my projects, skills, blog posts, and more. The assistant uses RAG technology to provide
            accurate answers based on my portfolio content.
          </p>
        </div>

        <Card className="border border-blue-500/20 bg-gradient-to-b from-blue-950/20 to-gray-950">
          <CardHeader>
            <CardTitle className="text-blue-300">How It Works</CardTitle>
            <CardDescription>
              This AI assistant uses Retrieval-Augmented Generation (RAG) to provide accurate answers about my
              portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <div className="font-semibold text-lg mb-2 text-blue-300">1. Vector Database</div>
                <p className="text-sm text-gray-400">
                  All portfolio content is processed and stored in a vector database, allowing for semantic search.
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <div className="font-semibold text-lg mb-2 text-blue-300">2. Contextual Retrieval</div>
                <p className="text-sm text-gray-400">
                  When you ask a question, the system retrieves the most relevant information from the database.
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <div className="font-semibold text-lg mb-2 text-blue-300">3. AI Response</div>
                <p className="text-sm text-gray-400">
                  The AI uses the retrieved context to generate accurate, portfolio-specific answers to your questions.
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30 mt-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">Try asking:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• "What projects have you worked on?"</li>
                <li>• "Tell me about your quantum computing experience"</li>
                <li>• "What technologies do you use?"</li>
                <li>• "What are your skills in AI and machine learning?"</li>
                <li>• "Can you tell me about your education?"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center p-6 bg-blue-900/10 rounded-lg border border-blue-500/20">
          <p className="text-lg text-blue-300 font-medium mb-2">Ready to chat?</p>
          <p className="text-muted-foreground">
            Click the chat button in the bottom right corner to start a conversation with the AI assistant.
          </p>
        </div>
      </div>
    </div>
  )
}
