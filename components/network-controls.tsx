"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function NetworkControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [speed, setSpeed] = useState(50)
  const [density, setDensity] = useState(50)

  const updateOpacity = (value: number[]) => {
    setOpacity(value[0])
    const canvas = document.querySelector("canvas")
    if (canvas) {
      canvas.style.opacity = (value[0] / 100).toString()
    }
  }

  const updateSpeed = (value: number[]) => {
    setSpeed(value[0])
    // This would need to be implemented in the network visualization component
    window.dispatchEvent(new CustomEvent("network-speed-change", { detail: value[0] / 50 }))
  }

  const updateDensity = (value: number[]) => {
    setDensity(value[0])
    // This would need to be implemented in the network visualization component
    window.dispatchEvent(new CustomEvent("network-density-change", { detail: value[0] / 50 }))
  }

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
        onClick={() => setIsOpen(true)}
        size="sm"
      >
        Adjust Network
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 rounded-lg border border-gray-700 text-white w-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Network Controls</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
          ✕
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Opacity</span>
            <span>{opacity}%</span>
          </div>
          <Slider defaultValue={[opacity]} max={100} step={1} onValueChange={updateOpacity} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Speed</span>
            <span>{speed}%</span>
          </div>
          <Slider defaultValue={[speed]} max={100} step={1} onValueChange={updateSpeed} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Density</span>
            <span>{density}%</span>
          </div>
          <Slider defaultValue={[density]} max={100} step={1} onValueChange={updateDensity} />
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span>Color Theme</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["tech", "ocean", "cyberpunk", "aurora", "sunset"].map((theme) => (
              <button
                key={theme}
                className="px-2 py-1 text-xs capitalize bg-black/50 hover:bg-black/70 border border-gray-700 rounded"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("network-theme-change", { detail: theme }))
                }}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
