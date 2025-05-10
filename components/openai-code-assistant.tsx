"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Code2, Copy, Check, RefreshCw, Sparkles, Lightbulb } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type CodeLanguage = "javascript" | "typescript" | "python" | "java" | "csharp" | "go" | "rust" | "html" | "css" | "sql"
type CodeTask = "explain" | "refactor" | "optimize" | "document" | "debug" | "convert" | "generate"

export function OpenAICodeAssistant() {
  const [code, setCode] = useState("")
  const [task, setTask] = useState<CodeTask>("explain")
  const [language, setLanguage] = useState<CodeLanguage>("javascript")
  const [targetLanguage, setTargetLanguage] = useState<CodeLanguage>("typescript")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState("")
  const [activeTab, setActiveTab] = useState<"input" | "output">("input")
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const processCode = async () => {
    if (!code.trim() || isProcessing) return

    setIsProcessing(true)
    setResult("")

    try {
      let prompt = ""

      switch (task) {
        case "explain":
          prompt = `Explain the following ${language} code in detail, breaking down how it works:\n\n${code}`
          break
        case "refactor":
          prompt = `Refactor the following ${language} code to make it more readable, maintainable, and follow best practices. Explain the improvements:\n\n${code}`
          break
        case "optimize":
          prompt = `Optimize the following ${language} code for better performance. Explain the optimizations:\n\n${code}`
          break
        case "document":
          prompt = `Add comprehensive documentation to the following ${language} code, including function/method descriptions, parameter explanations, and return value details:\n\n${code}`
          break
        case "debug":
          prompt = `Debug the following ${language} code. Identify potential issues, bugs, or edge cases and suggest fixes:\n\n${code}`
          break
        case "convert":
          prompt = `Convert the following ${language} code to ${targetLanguage}. Ensure it maintains the same functionality:\n\n${code}`
          break
        case "generate":
          prompt = `Generate ${language} code based on this description:\n\n${code}`
          break
      }

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.3,
        maxTokens: 2000,
      })

      setResult(text)
      setActiveTab("output")

      // Scroll to result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      console.error("Error processing code:", error)
      setResult("Error processing code. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getExampleCode = () => {
    const examples = {
      javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      typescript: `function mergeSort<T>(array: T[]): T[] {
  if (array.length <= 1) return array;
  
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  
  return merge(mergeSort(left), mergeSort(right));
}

function merge<T>(left: T[], right: T[]): T[] {
  const result: T[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`,
      python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))`,
      java: `public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            }
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13};
        int target = 7;
        int result = binarySearch(arr, target);
        System.out.println("Element found at index: " + result);
    }
}`,
    }

    return examples[language] || examples.javascript
  }

  const useExampleCode = () => {
    setCode(getExampleCode())
  }

  return (
    <Card className="w-full overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black">
      <CardHeader className="bg-black/50 border-b border-gray-800">
        <CardTitle className="flex items-center">
          <Code2 className="h-5 w-5 mr-2 text-cyan-400" />
          OpenAI Code Assistant
        </CardTitle>
        <CardDescription>Explain, refactor, optimize, document, debug, or convert code using AI</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "input" | "output")} className="w-full">
          <TabsList className="w-full rounded-none border-b border-gray-800">
            <TabsTrigger value="input" className="flex-1">
              Input
            </TabsTrigger>
            <TabsTrigger value="output" className="flex-1">
              Output
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="m-0">
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label>Task</Label>
                  <Select value={task} onValueChange={(value) => setTask(value as CodeTask)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-2">
                      <SelectValue placeholder="Select task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="explain">Explain Code</SelectItem>
                      <SelectItem value="refactor">Refactor Code</SelectItem>
                      <SelectItem value="optimize">Optimize Code</SelectItem>
                      <SelectItem value="document">Document Code</SelectItem>
                      <SelectItem value="debug">Debug Code</SelectItem>
                      <SelectItem value="convert">Convert Language</SelectItem>
                      <SelectItem value="generate">Generate Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as CodeLanguage)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 mt-2">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {task === "convert" && (
                  <div className="flex-1">
                    <Label>Target Language</Label>
                    <Select value={targetLanguage} onValueChange={(value) => setTargetLanguage(value as CodeLanguage)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 mt-2">
                        <SelectValue placeholder="Select target language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="code-input">{task === "generate" ? "Description" : "Code"}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={useExampleCode}
                    className="h-7 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Use Example
                  </Button>
                </div>
                <Textarea
                  id="code-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={
                    task === "generate"
                      ? "Describe what code you want to generate..."
                      : `Enter your ${language} code here...`
                  }
                  className="min-h-[300px] font-mono text-sm bg-gray-800 border-gray-700"
                />
              </div>

              <Button
                onClick={processCode}
                disabled={!code.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {task === "explain"
                      ? "Explain Code"
                      : task === "refactor"
                        ? "Refactor Code"
                        : task === "optimize"
                          ? "Optimize Code"
                          : task === "document"
                            ? "Document Code"
                            : task === "debug"
                              ? "Debug Code"
                              : task === "convert"
                                ? `Convert to ${targetLanguage}`
                                : "Generate Code"}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="output" className="m-0">
            <div className="p-6" ref={resultRef}>
              {result ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Result</h3>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs">
                      {copied ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 overflow-auto max-h-[500px]">
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("input")}>
                      Back to Input
                    </Button>
                    <Button variant="outline" onClick={processCode} disabled={isProcessing}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Code2 className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Result Yet</h3>
                  <p className="text-muted-foreground mb-4">Process your code to see the result here</p>
                  <Button variant="outline" onClick={() => setActiveTab("input")}>
                    Back to Input
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper component for the label
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  )
}
