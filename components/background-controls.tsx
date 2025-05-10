"use client"

import { usePerformance } from "@/contexts/performance-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function BackgroundControls() {
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
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Performance Settings</h3>
        <p className="text-sm text-muted-foreground">Adjust these settings to optimize performance on your device</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Performance Level</Label>
          <RadioGroup
            value={performanceLevel}
            onValueChange={(value) => setPerformanceLevel(value as "high" | "medium" | "low")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high">High Quality</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Balanced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Performance</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="background-effects">Background Effects</Label>
          <Switch
            id="background-effects"
            checked={enableBackgroundEffects}
            onCheckedChange={setEnableBackgroundEffects}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="animations">Animations</Label>
          <Switch id="animations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="parallax">Parallax Effects</Label>
          <Switch id="parallax" checked={enableParallax} onCheckedChange={setEnableParallax} />
        </div>
      </div>
    </div>
  )
}
