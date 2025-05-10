"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, Loader2 } from "lucide-react"

export function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/setup-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message || "Database setup completed successfully" })
      } else {
        setResult({ success: false, message: data.error || "Failed to set up database" })
      }
    } catch (error) {
      setResult({ success: false, message: "An error occurred during database setup" })
      console.error("Error setting up database:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup
        </CardTitle>
        <CardDescription>Create required database tables for the portfolio website</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">This will create the following tables if they don't exist:</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
          <li>case_studies</li>
          <li>case_study_metrics</li>
          <li>tags</li>
          <li>case_study_tags</li>
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
        <Button onClick={setupDatabase} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting Up Database...
            </>
          ) : (
            "Set Up Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
