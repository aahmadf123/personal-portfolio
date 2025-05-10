"use client"

import { useState } from "react"
import { QuantumParticleLogo, type QuantumParticleLogoProps } from "./quantum-particle-logo"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Sparkles, RefreshCw } from "lucide-react"

const PRESET_COLORS = [
  "#00BFFF", // Default blue
  "#FF1493", // Deep pink
  "#7B68EE", // Medium slate blue
  "#00FF7F", // Spring green
  "#FFD700", // Gold
  "#FF4500", // Orange red
  "#9370DB", // Medium purple
  "#1E90FF", // Dodger blue
  "#32CD32", // Lime green
  "#FF8C00", // Dark orange
]

const BEHAVIOR_OPTIONS = [
  { value: "orbital", label: "Orbital" },
  { value: "bouncy", label: "Bouncy" },
  { value: "chaotic", label: "Chaotic" },
]

export function QuantumLogoCustomizer() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<QuantumParticleLogoProps>({
    size: 200,
    color: "#00BFFF",
    particleCount: 12,
    particleSize: 1.5,
    orbitSpeed: 1,
    showOrbits: true,
    showConnections: true,
    particleBehavior: "orbital",
    glowIntensity: 0.5,
    centerSize: 0.1,
  })

  const updateConfig = (updates: Partial<QuantumParticleLogoProps>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const resetConfig = () => {
    setConfig({
      size: 200,
      color: "#00BFFF",
      particleCount: 12,
      particleSize: 1.5,
      orbitSpeed: 1,
      showOrbits: true,
      showConnections: true,
      particleBehavior: "orbital",
      glowIntensity: 0.5,
      centerSize: 0.1,
    })
  }

  const generateRandomConfig = () => {
    setConfig({
      size: 200,
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      particleCount: Math.floor(Math.random() * 20) + 5,
      particleSize: Math.random() * 2 + 0.5,
      orbitSpeed: Math.random() * 2 + 0.5,
      showOrbits: Math.random() > 0.3,
      showConnections: Math.random() > 0.3,
      particleBehavior: BEHAVIOR_OPTIONS[Math.floor(Math.random() * BEHAVIOR_OPTIONS.length)].value as any,
      glowIntensity: Math.random() * 0.8 + 0.2,
      centerSize: Math.random() * 0.15 + 0.05,
    })
  }

  const copyConfigAsCode = () => {
    const code = `<QuantumParticleLogo
  size={${config.size}}
  color="${config.color}"
  particleCount={${config.particleCount}}
  particleSize={${config.particleSize}}
  orbitSpeed={${config.orbitSpeed}}
  showOrbits={${config.showOrbits}}
  showConnections={${config.showConnections}}
  particleBehavior="${config.particleBehavior}"
  glowIntensity={${config.glowIntensity}}
  centerSize={${config.centerSize}}
/>`
    navigator.clipboard.writeText(code)
    alert("Configuration copied to clipboard!")
  }

  return (
    <div className="relative">
      {/* Logo display */}
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gray-800">
        <QuantumParticleLogo {...config} interactive={!isOpen} onCustomize={() => setIsOpen(true)} />
        {!isOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="mt-6 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-200"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Customize Logo
          </Button>
        )}
      </div>

      {/* Customizer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-white">Quantum Logo Customizer</CardTitle>
                  <CardDescription>Adjust the parameters to customize the animation</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="appearance" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4 bg-gray-800">
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    <TabsTrigger value="effects">Effects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-4">
                    {/* Color selection */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-300">Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full transition-all ${
                              config.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateConfig({ color })}
                          />
                        ))}
                        <input
                          type="color"
                          value={config.color}
                          onChange={(e) => updateConfig({ color: e.target.value })}
                          className="w-8 h-8 rounded-full bg-gray-800 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Size */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-gray-300">Size</Label>
                        <span className="text-xs text-gray-400">{config.size}px</span>
                      </div>
                      <Slider
                        value={[config.size || 200]}
                        min={40}
                        max={400}
                        step={10}
                        onValueChange={(value) => updateConfig({ size: value[0] })}
                      />
                    </div>

                    {/* Particle Count */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-gray-300">Particle Count</Label>
                        <span className="text-xs text-gray-400">{config.particleCount}</span>
                      </div>
                      <Slider
                        value={[config.particleCount || 12]}
                        min={3}
                        max={30}
                        step={1}
                        onValueChange={(value) => updateConfig({ particleCount: value[0] })}
                      />
                    </div>

                    {/* Particle Size */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-gray-300">Particle Size</Label>
                        <span className="text-xs text-gray-400">{config.particleSize?.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[config.particleSize || 1.5]}
                        min={0.5}
                        max={4}
                        step={0.1}
                        onValueChange={(value) => updateConfig({ particleSize: value[0] })}
                      />
                    </div>

                    {/* Center Size */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-gray-300">Center Size</Label>
                        <span className="text-xs text-gray-400">{config.centerSize?.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[config.centerSize || 0.1]}
                        min={0.05}
                        max={0.2}
                        step={0.01}
                        onValueChange={(value) => updateConfig({ centerSize: value[0] })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-4">
                    {/* Behavior Type */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-300">Particle Behavior</Label>
                      <Select
                        value={config.particleBehavior as string}
                        onValueChange={(value) => updateConfig({ particleBehavior: value as any })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select behavior" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {BEHAVIOR_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Orbit Speed */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-gray-300">Animation Speed</Label>
                        <span className="text-xs text-gray-400">{config.orbitSpeed?.toFixed(1)}x</span>
                      </div>
                      <Slider
                        value={[config.orbitSpeed || 1]}
                        min={0.1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) => updateConfig({ orbitSpeed: value[0] })}
                      />
                    </div>

                    {/* Show Orbits */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-300">Show Orbital Paths</Label>
                      <Switch
                        checked={config.showOrbits}
                        onCheckedChange={(checked) => updateConfig({ showOrbits: checked })}
                      />
                    </div>

                    {/* Show Connections */}
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-300">Show Connection Lines</Label>
                      <Switch
                        checked={config.showConnections}
                        onCheckedChange={(checked) => updateConfig({ showConnections: checked })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="effects" className="space-y-4">
                    {/* Glow Intensity */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm text-gray-300">Glow Intensity</Label>
                        <span className="text-xs text-gray-400">{config.glowIntensity?.toFixed(1)}</span>
                      </div>
                      <Slider
                        value={[config.glowIntensity || 0.5]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={(value) => updateConfig({ glowIntensity: value[0] })}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetConfig}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-200"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomConfig}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-200"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Random
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyConfigAsCode}
                    className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-gray-200"
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
