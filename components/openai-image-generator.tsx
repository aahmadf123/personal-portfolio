"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Loader2, Download, RefreshCw, ImageIcon, Sparkles, Wand2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type ImageStyle = "photorealistic" | "digital-art" | "3d-render" | "pixel-art" | "sketch" | "painting" | "anime"
type ImageSize = "1024x1024" | "1024x1792" | "1792x1024"

export function OpenAIImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [imageStyle, setImageStyle] = useState<ImageStyle>("digital-art")
  const [imageSize, setImageSize] = useState<ImageSize>("1024x1024")
  const [quality, setQuality] = useState(75)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const stylePrompts = {
    photorealistic: "photorealistic, highly detailed, sharp focus, professional photography",
    "digital-art": "digital art, vibrant colors, detailed, concept art, trending on artstation",
    "3d-render": "3D render, octane render, realistic textures, volumetric lighting, ray tracing",
    "pixel-art": "pixel art, 16-bit, retro game style, pixelated",
    sketch: "pencil sketch, hand-drawn, detailed linework, shading",
    painting: "oil painting, textured canvas, detailed brushstrokes, artistic",
    anime: "anime style, cel shaded, vibrant, detailed, studio ghibli inspired",
  }

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      // In a real implementation, this would call the OpenAI API
      // For this demo, we'll simulate the API call and use a placeholder

      // Construct the full prompt with style
      const fullPrompt = `${prompt}. ${stylePrompts[imageStyle]}`

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate a placeholder image URL based on the prompt
      // In a real implementation, this would be the URL returned by the OpenAI API
      const placeholderUrl = `/placeholder.svg?height=${imageSize.split("x")[1]}&width=${imageSize.split("x")[0]}&query=${encodeURIComponent(fullPrompt)}`

      setGeneratedImage(placeholderUrl)
    } catch (err) {
      console.error("Error generating image:", err)
      setError("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = generatedImage
    link.download = `generated-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getExamplePrompt = () => {
    const examples = [
      "A futuristic quantum computer laboratory with holographic displays",
      "An AI neural network visualized as a glowing brain with digital connections",
      "A spacecraft navigating through a nebula with advanced propulsion technology",
      "A detailed circuit board forming the shape of a human profile",
      "A robotic hand and human hand touching, similar to Michelangelo's Creation of Adam",
    ]
    return examples[Math.floor(Math.random() * examples.length)]
  }

  const useExamplePrompt = () => {
    setPrompt(getExamplePrompt())
  }

  return (
    <Card className="w-full overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black">
      <CardHeader className="bg-black/50 border-b border-gray-800">
        <CardTitle className="flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-cyan-400" />
          OpenAI Image Generator
        </CardTitle>
        <CardDescription>Create custom images for your projects using AI</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Image Prompt</Label>
              <div className="relative">
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-gray-800 border-gray-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={useExamplePrompt}
                  className="absolute bottom-2 right-2 h-7 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Example
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Image Style</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="h-7 text-xs"
                >
                  {showAdvanced ? "Hide Advanced" : "Show Advanced"}
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(["photorealistic", "digital-art", "3d-render", "anime"] as ImageStyle[]).map((style) => (
                  <Button
                    key={style}
                    variant={imageStyle === style ? "default" : "outline"}
                    className={imageStyle === style ? "bg-cyan-600 hover:bg-cyan-700 border-cyan-500" : ""}
                    onClick={() => setImageStyle(style)}
                  >
                    {style
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Button>
                ))}
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="negative-prompt">Negative Prompt</Label>
                      <Textarea
                        id="negative-prompt"
                        placeholder="Elements to exclude from the image..."
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        className="min-h-[80px] bg-gray-800 border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image-size">Image Size</Label>
                      <Select value={imageSize} onValueChange={(value) => setImageSize(value as ImageSize)}>
                        <SelectTrigger id="image-size" className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1024x1024">Square (1024×1024)</SelectItem>
                          <SelectItem value="1024x1792">Portrait (1024×1792)</SelectItem>
                          <SelectItem value="1792x1024">Landscape (1792×1024)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="quality">Quality</Label>
                        <span className="text-sm text-muted-foreground">{quality}%</span>
                      </div>
                      <Slider
                        id="quality"
                        min={25}
                        max={100}
                        step={25}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(["pixel-art", "sketch", "painting"] as ImageStyle[]).map((style) => (
                        <Button
                          key={style}
                          variant={imageStyle === style ? "default" : "outline"}
                          className={imageStyle === style ? "bg-cyan-600 hover:bg-cyan-700 border-cyan-500" : ""}
                          onClick={() => setImageStyle(style)}
                          size="sm"
                        >
                          {style
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-700 bg-gray-800/50">
              {generatedImage ? (
                <Image src={generatedImage || "/placeholder.svg"} alt="Generated image" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-sm text-center px-8">Your generated image will appear here</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-cyan-400 mb-4" />
                    <p className="text-cyan-400 animate-pulse">Generating your image...</p>
                  </div>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={downloadImage}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={generateImage} disabled={isGenerating}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
