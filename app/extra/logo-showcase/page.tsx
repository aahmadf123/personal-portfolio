"use client"

import { useState } from "react"
import { TechGradientLogo } from "@/components/tech-gradient-logo"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LogoShowcasePage() {
  const [animated, setAnimated] = useState(true)
  const [interactive, setInteractive] = useState(true)
  const [size, setSize] = useState(200)
  const [showInitialAnimation, setShowInitialAnimation] = useState(false)

  const resetAnimation = () => {
    setShowInitialAnimation(false)
    setTimeout(() => setShowInitialAnimation(true), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto py-16 px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tech Gradient Logo Showcase
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-12 bg-gray-900/50 backdrop-blur border-gray-800 flex items-center justify-center">
              <TechGradientLogo
                size={size}
                animated={animated}
                interactive={interactive}
                initialAnimation={showInitialAnimation}
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 bg-gray-900/50 backdrop-blur border-gray-800">
              <h2 className="text-xl font-semibold mb-6">Logo Controls</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="size-slider">Size: {size}px</Label>
                  </div>
                  <Slider
                    id="size-slider"
                    min={40}
                    max={400}
                    step={10}
                    value={[size]}
                    onValueChange={(value) => setSize(value[0])}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animated-switch">Animated</Label>
                  <Switch id="animated-switch" checked={animated} onCheckedChange={setAnimated} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="interactive-switch">Interactive (Hover Effects)</Label>
                  <Switch id="interactive-switch" checked={interactive} onCheckedChange={setInteractive} />
                </div>

                <Button
                  onClick={resetAnimation}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  Replay Initial Animation
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="p-8 bg-gray-900/50 backdrop-blur border-gray-800">
              <h2 className="text-2xl font-semibold mb-4">Logo Variants</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-center h-40">
                    <TechGradientLogo size={100} animated={false} />
                  </div>
                  <p className="mt-2 text-center">Static</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-center h-40">
                    <TechGradientLogo size={100} animated={true} interactive={false} />
                  </div>
                  <p className="mt-2 text-center">Animated</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-center h-40">
                    <TechGradientLogo size={100} animated={true} interactive={true} />
                  </div>
                  <p className="mt-2 text-center">Interactive</p>
                </div>
              </div>

              <div className="mt-8 text-gray-300">
                <h3 className="text-lg font-medium mb-2">Implementation</h3>
                <pre className="bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                  {`import { TechGradientLogo } from "@/components/tech-gradient-logo"

// Basic usage
<TechGradientLogo size={60} />

// Animated with hover effects
<TechGradientLogo size={80} animated={true} interactive={true} />

// With initial animation sequence
<TechGradientLogo size={100} initialAnimation={true} />`}
                </pre>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
