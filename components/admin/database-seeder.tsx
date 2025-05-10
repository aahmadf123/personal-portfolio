"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react"

export function DatabaseSeeder() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const seedDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/seed-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message || "Database seeded successfully" })
      } else {
        setResult({ success: false, message: data.error || "Failed to seed database" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during database seeding" })
      console.error("Error seeding database:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Seeder
        </CardTitle>
        <CardDescription>Seed your database with sample data for testing</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">This will add sample data to the following tables:</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
          <li>categories</li>
          <li>blog_posts</li>
          <li>projects</li>
          <li>skills</li>
        </ul>

        {result && (
          <div
            className={`p-3 rounded-md flex items-start gap-2 text-sm ${
              result.success ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
            }`}
          >
            {result.success ? (
              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <p>{result.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={seedDatabase} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Database...
            </>
          ) : (
            "Seed Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
