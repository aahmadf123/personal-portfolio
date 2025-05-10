"use client"

import { useState, useEffect } from "react"
import { Database, AlertCircle, CheckCircle2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DbConnectionStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState("Checking database connection...")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/admin/db-connection-check")

        if (response.ok) {
          setStatus("connected")
          setMessage("Database connection is healthy")
        } else {
          const data = await response.json()
          setStatus("error")
          setMessage(data.error || "Database connection failed")
        }
      } catch (err) {
        setStatus("error")
        setMessage("Unable to check database connection")
      }
    }

    checkConnection()

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-2 text-sm">
            {status === "loading" && (
              <>
                <Database className="h-4 w-4 text-gray-400 animate-pulse" />
                <span className="text-gray-400">Connecting...</span>
              </>
            )}

            {status === "connected" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-green-500">DB Connected</span>
              </>
            )}

            {status === "error" && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500">DB Error</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
