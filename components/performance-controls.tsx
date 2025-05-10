"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import { usePerformance } from "@/contexts/performance-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

export function PerformanceControls() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    performanceLevel,
    setPerformanceLevel,
    enableBackgroundEffects,
    setEnableBackgroundEffects,
    enableAnimations,
    setEnableAnimations,
    enableParallax,
    setEnableParallax,
  } = usePerformance()

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm border-primary/20"
        onClick={() => setIsOpen(true)}
        aria-label="Performance Settings"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-lg w-full max-w-md relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6">
              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-semibold">Performance Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Adjust these settings to optimize performance on your device
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Performance Level</Label>
                  <RadioGroup
                    value={performanceLevel}
                    onValueChange={(value) => setPerformanceLevel(value as "high" | "medium" | "low")}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="cursor-pointer">
                        High Quality
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer">
                        Balanced
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="cursor-pointer">
                        Performance
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="background-effects" className="block">
                        Background Effects
                      </Label>
                      <p className="text-xs text-muted-foreground">Neural network visualization</p>
                    </div>
                    <Switch
                      id="background-effects"
                      checked={enableBackgroundEffects}
                      onCheckedChange={setEnableBackgroundEffects}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations" className="block">
                        Animations
                      </Label>
                      <p className="text-xs text-muted-foreground">UI transitions and effects</p>
                    </div>
                    <Switch id="animations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="parallax" className="block">
                        Parallax Effects
                      </Label>
                      <p className="text-xs text-muted-foreground">Depth and movement effects</p>
                    </div>
                    <Switch id="parallax" checked={enableParallax} onCheckedChange={setEnableParallax} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
