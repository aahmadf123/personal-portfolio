import { AdaptiveGrid, AdaptiveItem } from "@/components/adaptive-grid"

export default function TailwindV4DemoPage() {
  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">Tailwind CSS v4 Features Demo</h1>

      <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12 text-pretty">
        This page demonstrates new Tailwind CSS v4 features like container queries, better typography with text-balance
        and text-pretty, and improved responsive design. Resize the browser or adjust the column controls to see how
        elements adapt.
      </p>

      <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 mb-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-balance">Text Balancing Demo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Without text-balance:</h3>
            <p className="text-lg font-semibold text-primary mb-2">
              This is a long headline that might have awkward line breaks without proper text balancing
            </p>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">With text-balance:</h3>
            <p className="text-lg font-semibold text-primary mb-2 text-balance">
              This is a long headline that might have awkward line breaks without proper text balancing
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-balance">Text Pretty Demo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Without text-pretty:</h3>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas vel nulla eget libero
              dictum facilisis at at urna. Phasellus efficitur turpis sed orci facilisis, in ultricies nisl lacinia.
            </p>
          </div>

          <div className="border border-border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">With text-pretty:</h3>
            <p className="mb-2 text-pretty">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas vel nulla eget libero
              dictum facilisis at at urna. Phasellus efficitur turpis sed orci facilisis, in ultricies nisl lacinia.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8 text-balance">Container Queries Demo</h2>

      <div className="p-4 border border-border rounded-lg mb-8">
        <h3 className="text-xl font-bold mb-4">Resize this container to see how items adapt:</h3>

        <div className="border-2 border-primary/50 p-2 sm:p-4 md:p-6 resize-x overflow-auto min-w-[300px] max-w-full rounded-lg mb-4">
          <AdaptiveGrid className="w-full" gap={4}>
            {Array.from({ length: 6 }).map((_, i) => (
              <AdaptiveItem key={i}>
                <h3 className="text-lg @md:text-xl font-bold mb-2 text-balance">
                  Card #{i + 1} with Container Queries
                </h3>
                <p className="text-muted-foreground text-pretty">
                  This card adapts based on its container's width, not just the viewport. Resize the container to see
                  how it changes.
                </p>
              </AdaptiveItem>
            ))}
          </AdaptiveGrid>
        </div>

        <div className="p-4 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Note:</strong> The items above use container queries to adapt their layout:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Grid columns adapt based on container width (not viewport)</li>
            <li>Text size adjusts based on container size</li>
            <li>Padding, borders, and shadows change with container size</li>
            <li>Gracefully fallbacks to viewport queries if container queries aren't supported</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
