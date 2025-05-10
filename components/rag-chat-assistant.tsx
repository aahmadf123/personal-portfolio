"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X, Minimize, Maximize, Send, Loader2 } from "lucide-react"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

export function RAGChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you with the portfolio today?",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatHistory])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage("")

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Prepare messages for the API
      const messagesToSend = [
        ...chatHistory.filter((msg) => msg.role !== "system"),
        { role: "user", content: userMessage },
      ]

      // Call our server-side API route instead of OpenAI directly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messagesToSend }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Add assistant response to chat
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error sending message:", error)
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-[1000]">
      {/* Chat toggle button - removed animation */}
      <Button
        onClick={toggleChat}
        className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-2 border-white dark:border-gray-800"
        aria-label="Toggle chat assistant"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`absolute bottom-16 left-0 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-xl transition-all duration-200 overflow-hidden ${
            isMinimized ? "h-12" : "h-[500px] max-h-[80vh]"
          }`}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-sm">Portfolio AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat messages */}
              <div className="p-3 overflow-y-auto h-[calc(100%-110px)] space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === "user" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : "bg-muted"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-3 border-t border-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-muted rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    size="icon"
                    className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
