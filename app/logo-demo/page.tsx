"use client"

import { useState } from "react"
import { EnhancedLogo } from "@/components/enhanced-logo"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function LogoDemoPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [animated, setAnimated] = useState(true)
  const [interactive, setInteractive] = useState(true)

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <h1 className="text-3xl font-bold mb-8">Enhanced Logo Demo</h1>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
        <Card className={`p-12 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          <EnhancedLogo size={150} darkMode={darkMode} animated={animated} interactive={interactive} />
        </Card>

        <Card className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animated">Animated</Label>
              <Switch id="animated" checked={animated} onCheckedChange={setAnimated} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="interactive">Interactive</Label>
              <Switch id="interactive" checked={interactive} onCheckedChange={setInteractive} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <EnhancedLogo size={80} darkMode={darkMode} />
          </div>
          <p className="mt-2 text-center">Static Logo</p>
        </div>

        <div className="flex flex-col items-center">
          <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <EnhancedLogo size={80} darkMode={!darkMode} />
          </div>
          <p className="mt-2 text-center">Inverted Colors</p>
        </div>

        <div className="flex flex-col items-center">
          <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
            <EnhancedLogo size={80} darkMode={darkMode} interactive={true} />
          </div>
          <p className="mt-2 text-center">Interactive (Hover)</p>
        </div>
      </div>

      <div className="mt-12 max-w-2xl text-center">
        <h2 className="text-xl font-semibold mb-4">Implementation Guide</h2>
        <p className="mb-4">
          To use this logo in your project, import the EnhancedLogo component and add it to your layout or header:
        </p>
        <pre className={`p-4 rounded text-left overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
          {`import { EnhancedLogo } from "@/components/enhanced-logo"

// In your component:
<EnhancedLogo 
  size={40} 
  darkMode={true} 
  animated={true} 
  interactive={true} 
/>`}
        </pre>
      </div>
    </div>
  )
}
