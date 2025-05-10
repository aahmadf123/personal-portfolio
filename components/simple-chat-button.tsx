"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

export function SimpleChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (!message.trim()) return
    alert(`Message sent: ${message}`)
    setMessage("")
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {/* Always visible chat button - removed animation */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-200"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">Chat Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat content */}
          <div className="p-3 h-64 overflow-y-auto">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg inline-block max-w-[80%] mb-2">
              How can I help you today?
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
