"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TailwindV4Showcase() {
  const [activeTab, setActiveTab] = useState<"logical" | "container" | "text" | "arbitrary">("logical")

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gradient-expanded">Tailwind CSS v4 Features</h2>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant={activeTab === "logical" ? "default" : "outline"} onClick={() => setActiveTab("logical")}>
            Logical Properties
          </Button>
          <Button variant={activeTab === "container" ? "default" : "outline"} onClick={() => setActiveTab("container")}>
            Container Queries
          </Button>
          <Button variant={activeTab === "text" ? "default" : "outline"} onClick={() => setActiveTab("text")}>
            Text Wrapping
          </Button>
          <Button variant={activeTab === "arbitrary" ? "default" : "outline"} onClick={() => setActiveTab("arbitrary")}>
            Arbitrary Properties
          </Button>
        </div>

        {activeTab === "logical" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Logical Properties</CardTitle>
                <CardDescription>Direction-aware spacing and sizing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="border border-primary p-4 rounded-md">
                    <p className="mb-2 font-semibold">Traditional Properties:</p>
                    <div className="bg-muted p-4 rounded-md">
                      <code className="text-sm">ml-4 mr-4 mt-2 mb-2</code>
                    </div>
                  </div>

                  <div className="border border-accent p-4 rounded-md">
                    <p className="mb-2 font-semibold">Logical Properties (v4):</p>
                    <div className="bg-muted p-4 rounded-md">
                      <code className="text-sm">ms-4 me-4 mt-2 mb-2</code>
                      <p className="text-sm mt-2 text-muted-foreground">
                        ms = margin-inline-start (left in LTR, right in RTL)
                        <br />
                        me = margin-inline-end (right in LTR, left in RTL)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Logical properties automatically adapt to the text direction, making your site more accessible for RTL
                  languages.
                </p>
              </CardFooter>
            </Card>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>LTR Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-md" dir="ltr">
                    <div className="bg-primary size-12 rounded-md"></div>
                    <div className="ms-4 bg-secondary size-12 rounded-md"></div>
                    <div className="me-4 bg-tertiary size-12 rounded-md"></div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Notice how <code>ms-4</code> adds margin to the left and <code>me-4</code> adds margin to the right
                    in LTR mode.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RTL Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-md" dir="rtl">
                    <div className="bg-primary size-12 rounded-md"></div>
                    <div className="ms-4 bg-secondary size-12 rounded-md"></div>
                    <div className="me-4 bg-tertiary size-12 rounded-md"></div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    In RTL mode, <code>ms-4</code> adds margin to the right and <code>me-4</code> adds margin to the
                    left.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "container" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Container Queries</CardTitle>
                <CardDescription>Style based on parent container size, not viewport</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Container queries allow you to apply styles based on the size of a parent container, not just the
                  viewport size. This is perfect for reusable components that need to adapt to different contexts.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <code className="text-sm">
                    @container (min-width: 400px) &#123;
                    <br />
                    &nbsp;&nbsp;/* Styles for containers wider than 400px */
                    <br />
                    &#125;
                  </code>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  In Tailwind v4, you can use container query utilities like <code>@[breakpoint]:</code> to apply styles
                  based on container size.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Container Query Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Resize the browser or view on different devices to see how the cards adapt:</p>

                  <div className="@container">
                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="text-lg @md:text-xl font-semibold">Card 1</h3>
                        <p className="@md:mt-2 text-sm @md:text-base">
                          This card adapts based on its container width, not the viewport.
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-md">
                        <h3 className="text-lg @md:text-xl font-semibold">Card 2</h3>
                        <p className="@md:mt-2 text-sm @md:text-base">
                          This card adapts based on its container width, not the viewport.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nested Container Queries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="@container">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h3 className="text-lg @md:text-xl @xl:text-2xl font-semibold">Adaptive Component</h3>
                      <p className="mt-1 @md:mt-2 text-sm @md:text-base @xl:text-lg">
                        This text changes size based on the container width.
                      </p>
                      <div className="mt-4 @md:mt-6 @container">
                        <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
                          <div className="bg-background p-3 rounded-md">
                            <h4 className="text-base @sm:text-lg font-medium">Nested Item 1</h4>
                            <p className="text-xs @sm:text-sm">This has its own container query context.</p>
                          </div>
                          <div className="bg-background p-3 rounded-md">
                            <h4 className="text-base @sm:text-lg font-medium">Nested Item 2</h4>
                            <p className="text-xs @sm:text-sm">This has its own container query context.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Wrapping Controls</CardTitle>
                <CardDescription>New text-wrap utilities for better typography</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Tailwind CSS v4 includes new utilities for the CSS <code>text-wrap</code> property, giving you more
                  control over how text wraps.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">text-wrap-normal (default)</h3>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <p>
                        This is a paragraph with the default text wrapping behavior. Long words like
                        supercalifragilisticexpialidocious will break at the edge of the container.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">text-wrap-pretty</h3>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <p className="text-pretty">
                        This is a paragraph with text-wrap: pretty. It improves the appearance of text by preventing
                        orphans (single words on the last line) and adjusting line breaks for better readability. Long
                        words like supercalifragilisticexpialidocious will break at the edge of the container.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">text-wrap-balance</h3>
                    <div className="bg-muted/30 p-4 rounded-md">
                      <p className="text-balance">
                        This is a paragraph with text-wrap: balance. It attempts to balance the length of each line for
                        a more aesthetically pleasing appearance, especially for headings and short paragraphs.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practical Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Headings with text-balance</h3>

                    <div className="bg-muted/30 p-4 rounded-md mb-4">
                      <h2 className="text-2xl font-bold">
                        This is a heading without text-balance that might have awkward line breaks
                      </h2>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md">
                      <h2 className="text-2xl font-bold text-balance">
                        This is a heading with text-balance that distributes text more evenly across lines
                      </h2>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Article paragraphs with text-pretty</h3>

                    <div className="bg-muted/30 p-4 rounded-md">
                      <p className="text-pretty">
                        Using text-pretty for article content improves readability by preventing orphans and widows.
                        This makes your content look more professional and polished. Notice how the last line won't have
                        just a single word hanging there by itself. The browser will adjust line breaks to create a more
                        balanced appearance throughout the paragraph.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Card Titles</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-card p-4 rounded-md">
                        <h3 className="text-xl font-bold mb-2">Regular card title with potentially awkward breaks</h3>
                        <p className="text-sm text-muted-foreground">Card description goes here</p>
                      </div>

                      <div className="bg-card p-4 rounded-md">
                        <h3 className="text-xl font-bold mb-2 text-balance">
                          Balanced card title with more even line distribution
                        </h3>
                        <p className="text-sm text-muted-foreground">Card description goes here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "arbitrary" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Arbitrary Properties</CardTitle>
                <CardDescription>More powerful arbitrary value support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Tailwind CSS v4 enhances the arbitrary value syntax, making it more powerful and flexible.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Basic Arbitrary Values</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <code className="text-sm">
                        bg-[#ff5733]
                        <br />
                        text-[22px]
                        <br />
                        p-[2.5rem]
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Arbitrary Properties (v4)</h3>
                    <div className="bg-muted p-4 rounded-md">
                      <code className="text-sm">
                        [mask-image:linear-gradient(to_bottom,black,transparent)]
                        <br />
                        [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Arbitrary Properties Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Gradient Mask Effect</h3>
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/abstract-digital-pattern.png')" }}
                      ></div>
                      <div
                        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
                        style={{ backgroundImage: "url('/abstract-digital-pattern.png')" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Clip Path Shapes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-gradient-to-r from-primary to-secondary [clip-path:polygon(0_0,100%_0,100%_75%,0_100%)]"></div>
                      <div className="h-32 bg-gradient-to-r from-tertiary to-accent [clip-path:circle(50%_at_50%_50%)]"></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Custom Animation</h3>
                    <div className="h-16 w-16 bg-primary rounded-md [animation:spin_3s_linear_infinite] [transform-origin:center]"></div>
                    <style jsx>{`
                      @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
