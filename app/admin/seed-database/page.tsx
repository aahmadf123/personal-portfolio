"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function SeedDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; count?: number }>({})
  const [authKey, setAuthKey] = useState("")

  const seedDatabase = async () => {
    if (!authKey) return

    setIsLoading(true)
    setResult({})

    try {
      const response = await fetch("/api/admin/vector-db/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorization: authKey }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Database seeded successfully!",
          count: data.count,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to seed database",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while seeding the database",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearDatabase = async () => {
    if (!authKey) return

    setIsLoading(true)
    setResult({})

    try {
      const response = await fetch("/api/admin/vector-db/seed", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorization: authKey }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Database cleared successfully!",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to clear database",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while clearing the database",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Seed Vector Database</CardTitle>
          <CardDescription>Populate the vector database with portfolio content for the AI assistant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="auth-key" className="text-sm font-medium">
              Admin Authorization Key
            </label>
            <Input
              id="auth-key"
              type="password"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              placeholder="Enter admin key"
              className="mt-1"
            />
          </div>

          {result.message && (
            <div
              className={`p-3 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span>{result.message}</span>
              </div>
              {result.count && <div className="mt-1 text-sm">Added {result.count} documents</div>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearDatabase} disabled={isLoading || !authKey}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Clear Database
          </Button>
          <Button onClick={seedDatabase} disabled={isLoading || !authKey}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Seed Database
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
