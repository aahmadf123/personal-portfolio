"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function RagTest() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testRag = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/rag/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test RAG System</CardTitle>
        <CardDescription>Test if your RAG system is working by querying your vector database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a test query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && testRag()}
            />
            <Button onClick={testRag} disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Test
            </Button>
          </div>

          {error && <div className="p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}

          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Retrieved Contexts:</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {result.contexts.map((context: any, i: number) => (
                    <div key={i} className="p-3 bg-muted rounded-md">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>
                          {context.metadata?.type || "Unknown"}: {context.metadata?.title || "Untitled"}
                        </span>
                        <span>Similarity: {(context.similarity * 100).toFixed(1)}%</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{context.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        This tool helps you verify that your vector database is properly populated and the retrieval system is working.
      </CardFooter>
    </Card>
  )
}
