"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EnhancedVectorLogo } from "@/components/enhanced-vector-logo"
import { TechCircuitLogo } from "@/components/tech-circuit-logo"
import { NeuralLogo } from "@/components/neural-logo"
import { QuantumParticleLogo } from "@/components/quantum-particle-logo"

export default function LogoShowcasePage() {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<number>(100)
  const [selectedColor, setSelectedColor] = useState<string>("#38bdf8")
  const [selectedSecondaryColor, setSelectedSecondaryColor] = useState<string>("#0ea5e9")
  const [selectedTertiaryColor, setSelectedTertiaryColor] = useState<string>("#0284c7")

  const logos = [
    {
      id: "enhanced-default",
      name: "Enhanced Vector Logo (Default)",
      component: (
        <EnhancedVectorLogo
          size={selectedSize}
          animated={true}
          color={selectedColor}
          secondaryColor={selectedSecondaryColor}
          variant="default"
          interactive={true}
        />
      ),
    },
    {
      id: "enhanced-complex",
      name: "Enhanced Vector Logo (Complex)",
      component: (
        <EnhancedVectorLogo
          size={selectedSize}
          animated={true}
          color={selectedColor}
          secondaryColor={selectedSecondaryColor}
          variant="complex"
          interactive={true}
        />
      ),
    },
    {
      id: "enhanced-quantum",
      name: "Enhanced Vector Logo (Quantum)",
      component: (
        <EnhancedVectorLogo
          size={selectedSize}
          animated={true}
          color={selectedColor}
          secondaryColor={selectedSecondaryColor}
          variant="quantum"
          interactive={true}
        />
      ),
    },
    {
      id: "tech-circuit",
      name: "Tech Circuit Logo",
      component: (
        <TechCircuitLogo
          size={selectedSize}
          animated={true}
          primaryColor={selectedColor}
          secondaryColor={selectedSecondaryColor}
          tertiaryColor={selectedTertiaryColor}
          interactive={true}
        />
      ),
    },
    {
      id: "neural-low",
      name: "Neural Logo (Low Complexity)",
      component: (
        <NeuralLogo
          size={selectedSize}
          animated={true}
          primaryColor={selectedColor}
          secondaryColor={selectedSecondaryColor}
          tertiaryColor={selectedTertiaryColor}
          interactive={true}
          complexity="low"
        />
      ),
    },
    {
      id: "neural-medium",
      name: "Neural Logo (Medium Complexity)",
      component: (
        <NeuralLogo
          size={selectedSize}
          animated={true}
          primaryColor={selectedColor}
          secondaryColor={selectedSecondaryColor}
          tertiaryColor={selectedTertiaryColor}
          interactive={true}
          complexity="medium"
        />
      ),
    },
    {
      id: "neural-high",
      name: "Neural Logo (High Complexity)",
      component: (
        <NeuralLogo
          size={selectedSize}
          animated={true}
          primaryColor={selectedColor}
          secondaryColor={selectedSecondaryColor}
          tertiaryColor={selectedTertiaryColor}
          interactive={true}
          complexity="high"
        />
      ),
    },
    {
      id: "quantum-particle",
      name: "Quantum Particle Logo",
      component: (
        <QuantumParticleLogo
          size={selectedSize}
          animated={true}
          primaryColor={selectedColor}
          secondaryColor={selectedSecondaryColor}
          tertiaryColor={selectedTertiaryColor}
          interactive={true}
          particleCount={15}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Logo Showcase</h1>

        <div className="mb-8 p-6 bg-gray-900/50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Customize</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <input
                type="range"
                min="40"
                max="200"
                value={selectedSize}
                onChange={(e) => setSelectedSize(Number.parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-400 mt-1">{selectedSize}px</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedSecondaryColor}
                  onChange={(e) => setSelectedSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedSecondaryColor}
                  onChange={(e) => setSelectedSecondaryColor(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tertiary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedTertiaryColor}
                  onChange={(e) => setSelectedTertiaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedTertiaryColor}
                  onChange={(e) => setSelectedTertiaryColor(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedLogo === logo.id
                  ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-cyan-500/30"
                  : "bg-gray-900/30 hover:bg-gray-900/50 border border-gray-800"
              }`}
              onClick={() => setSelectedLogo(logo.id === selectedLogo ? null : logo.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 p-4 bg-black/40 rounded-full">{logo.component}</div>
                <h3 className="text-lg font-medium text-center">{logo.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedLogo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-12 p-8 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-lg border border-gray-800 flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-6">{logos.find((l) => l.id === selectedLogo)?.name}</h2>
            <div className="p-8 bg-black/60 rounded-full mb-8">
              {logos.find((l) => l.id === selectedLogo)?.component}
            </div>
            <p className="text-gray-400 text-center max-w-2xl">
              This logo is fully customizable with different colors, sizes, and animation options. Hover over the logo
              to see interactive effects.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
