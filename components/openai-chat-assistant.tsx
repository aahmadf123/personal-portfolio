"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Sparkles, RefreshCw, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SiteLogo } from "./site-logo"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

type ChatMode = "portfolio" | "technical" | "creative"

export function OpenAIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant powered by OpenAI. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>("portfolio")
  const [lastResponse, setLastResponse] = useState("")
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // System prompts for different chat modes
  const systemPrompts = {
    portfolio:
      "You are an AI assistant for a personal portfolio website of a professional with expertise in AI, quantum computing, and aerospace engineering. Answer questions about the portfolio owner's projects, skills, and background. Be helpful, concise, and professional.",
    technical:
      "You are a technical AI assistant with expertise in programming, AI/ML, quantum computing, and aerospace engineering. Provide detailed technical explanations, code examples, and best practices. Be precise and informative.",
    creative:
      "You are a creative AI assistant that helps generate ideas, content, and creative solutions. Be imaginative, inspiring, and think outside the box while still being helpful and relevant.",
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      // Prepare the messages array for the API
      const messagesToSend: Message[] = [
        { role: "system", content: systemPrompts[chatMode] },
        ...messages.filter((m) => m.role !== "system"),
        { role: "user", content: userMessage },
      ]

      const { text } = await generateText({
        model: openai("gpt-4o"),
        messages: messagesToSend,
        temperature: chatMode === "creative" ? 0.8 : 0.3,
        maxTokens: 1000,
      })

      setLastResponse(text)
      setMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lastResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. How can I help you today?",
      },
    ])
    setLastResponse("")
  }

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </motion.button>

      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative w-full max-w-2xl h-[700px] max-h-[90vh] bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-800"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <SiteLogo size={28} animated={false} />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center">
                      OpenAI Assistant
                      <Sparkles className="h-4 w-4 ml-2 text-cyan-400" />
                    </h3>
                    <p className="text-xs text-muted-foreground">Powered by GPT-4o</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    title="Clear chat"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-800"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Chat mode selector */}
              <div className="px-4 py-2 border-b border-gray-800 bg-black/30">
                <Tabs value={chatMode} onValueChange={(value) => setChatMode(value as ChatMode)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="creative">Creative</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(
                  (message, index) =>
                    message.role !== "system" && (
                      <motion.div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                              : "bg-gray-800 text-white flex items-start gap-2"
                          }`}
                        >
                          {message.role === "assistant" && <SiteLogo size={20} animated={false} variant="minimal" />}
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </motion.div>
                    ),
                )}

                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-white flex items-center gap-2">
                      <SiteLogo size={20} animated={false} variant="minimal" />
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Copy last response */}
              {lastResponse && (
                <div className="px-4 py-2 border-t border-gray-800 bg-black/30 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8 text-xs text-gray-400 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy response
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-black/50">
                <div className="flex items-center gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[60px] max-h-[120px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed h-[60px] w-[60px] flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
