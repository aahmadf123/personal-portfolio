"use client"

import { useState } from "react"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])
  }

  const sendMessage = async (content: string, systemPrompt?: string) => {
    if (!content.trim()) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content }
    addMessage(userMessage)
    setIsLoading(true)
    setError(null)

    try {
      // Prepare messages for the API
      const messagesToSend: Message[] = [
        ...(systemPrompt
          ? [
              {
                role: "system",
                content: systemPrompt,
              },
            ]
          : []),
        ...messages,
        userMessage,
      ]

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesToSend }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      // Add assistant response to chat
      addMessage({
        role: "assistant",
        content: data.response,
      })

      return data.response
    } catch (err) {
      console.error("Error sending message:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    isLoading,
    error,
    addMessage,
    sendMessage,
    clearMessages,
  }
}
