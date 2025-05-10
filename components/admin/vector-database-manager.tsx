"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search, Database, RefreshCw, Trash2, Plus, X } from "lucide-react"

type VectorRecord = {
  id: string
  content: string
  metadata: {
    type?: string
    title?: string
    url?: string
    [key: string]: any
  }
  similarity?: number
}

type DatabaseStats = {
  totalDocuments: number
  byType: Record<string, number>
}

export function VectorDatabaseManager() {
  const [activeTab, setActiveTab] = useState("index")
  const [isLoading, setIsLoading] = useState(false)
  const [isIndexing, setIsIndexing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<VectorRecord[]>([])
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [newRecord, setNewRecord] = useState<{
    content: string
    type: string
    title: string
  }>({
    content: "",
    type: "custom",
    title: "",
  })
  const [statusMessage, setStatusMessage] = useState("")

  // Fetch stats on load
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/vector-db/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStatusMessage("Failed to fetch database stats")
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setStatusMessage("Searching...")

    try {
      const response = await fetch("/api/admin/vector-db/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setSearchResults(data)
      setStatusMessage(`Found ${data.length} results`)
    } catch (error) {
      console.error("Search error:", error)
      setStatusMessage("Search failed")
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleIndexAll = async () => {
    setIsIndexing(true)
    setStatusMessage("Indexing all content...")

    try {
      const response = await fetch("/api/admin/vector-db/index-all", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Indexing failed")

      const data = await response.json()
      setStatusMessage(`Indexed ${data.count} items successfully`)
      fetchStats()
    } catch (error) {
      console.error("Indexing error:", error)
      setStatusMessage("Indexing failed")
    } finally {
      setIsIndexing(false)
    }
  }

  const handleAddRecord = async () => {
    if (!newRecord.content.trim() || !newRecord.type.trim() || !newRecord.title.trim()) {
      setStatusMessage("Please fill all fields")
      return
    }

    setIsLoading(true)
    setStatusMessage("Adding record...")

    try {
      const response = await fetch("/api/admin/vector-db/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newRecord.content,
          metadata: {
            type: newRecord.type,
            title: newRecord.title,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to add record")

      setStatusMessage("Record added successfully")
      setNewRecord({
        content: "",
        type: "custom",
        title: "",
      })
      fetchStats()
    } catch (error) {
      console.error("Error adding record:", error)
      setStatusMessage("Failed to add record")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return

    setIsLoading(true)
    setStatusMessage("Deleting record...")

    try {
      const response = await fetch(`/api/admin/vector-db/records/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete record")

      setStatusMessage("Record deleted successfully")
      setSearchResults(searchResults.filter((record) => record.id !== id))
      fetchStats()
    } catch (error) {
      console.error("Error deleting record:", error)
      setStatusMessage("Failed to delete record")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {statusMessage && (
        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-md text-sm flex items-center justify-between">
          <span>{statusMessage}</span>
          <Button variant="ghost" size="sm" onClick={() => setStatusMessage("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Database Stats</h3>
              <Button variant="outline" size="sm" onClick={fetchStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Total Documents</div>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Document Types</div>
                <div className="text-2xl font-bold">{Object.keys(stats.byType).length}</div>
              </div>
            </div>
            {Object.keys(stats.byType).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Documents by Type</h4>
                <div className="space-y-2">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="index">Index Content</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="add">Add Record</TabsTrigger>
        </TabsList>

        {/* Index Content Tab */}
        <TabsContent value="index" className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Index All Content</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will index all your blog posts, projects, case studies, and other content in the vector database.
            </p>
            <Button onClick={handleIndexAll} disabled={isIndexing}>
              {isIndexing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Indexing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Index All Content
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search the vector database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading || !searchQuery.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Search Results</h3>
              {searchResults.map((result) => (
                <Card key={result.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {result.metadata.title || "Untitled"}{" "}
                          <span className="text-xs text-muted-foreground">({result.metadata.type || "unknown"})</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(result.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">{result.content}</div>
                      {result.similarity !== undefined && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Similarity: {(result.similarity * 100).toFixed(2)}%
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Add Record Tab */}
        <TabsContent value="add" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Record title"
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Input
                placeholder="Record type (e.g., custom, note)"
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Record content"
                value={newRecord.content}
                onChange={(e) => setNewRecord({ ...newRecord, content: e.target.value })}
                className="min-h-[200px]"
              />
            </div>
            <Button onClick={handleAddRecord} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
