"use client"

import { useState } from "react"

export function NestedContainerDemo() {
  const [containerWidth, setContainerWidth] = useState(100)

  return (
    <div className="my-8 border rounded-lg p-6 bg-card/30 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-4">Interactive Demo</h3>
      <p className="mb-4">
        Adjust the slider below to see how nested container queries affect the layout at different widths.
      </p>

      <div className="mb-6">
        <label htmlFor="container-width" className="block text-sm font-medium mb-2">
          Container Width: {containerWidth}%
        </label>
        <input
          id="container-width"
          type="range"
          min="30"
          max="100"
          value={containerWidth}
          onChange={(e) => setContainerWidth(Number.parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Outer container with adjustable width */}
      <div
        className="border border-dashed border-blue-500 p-4 mb-4 mx-auto @container"
        style={{ width: `${containerWidth}%` }}
      >
        <div className="text-sm text-blue-500 mb-2">Outer Container</div>

        {/* Layout that changes based on outer container width */}
        <div className="@md:grid @md:grid-cols-2 @lg:grid-cols-3 gap-4">
          {/* First nested container */}
          <div className="border border-dashed border-green-500 p-4 mb-4 @md:mb-0 @container">
            <div className="text-sm text-green-500 mb-2">Nested Container 1</div>

            {/* Content that changes based on nested container width */}
            <div className="@sm:flex @sm:items-center @md:block">
              <div className="bg-green-500/10 rounded p-2 mb-2 @sm:mb-0 @sm:mr-4 @md:mr-0 @md:mb-2">
                <div className="@xs:text-sm @sm:text-base @md:text-lg font-medium">Adaptive Text</div>
              </div>
              <p className="text-sm @sm:text-base">This content adapts based on its container width.</p>
            </div>
          </div>

          {/* Second nested container */}
          <div className="border border-dashed border-purple-500 p-4 mb-4 @md:mb-0 @container">
            <div className="text-sm text-purple-500 mb-2">Nested Container 2</div>

            {/* Content that changes based on nested container width */}
            <div className="@xs:grid @xs:grid-cols-2 @sm:grid-cols-1 @md:grid-cols-2 gap-2">
              <div className="bg-purple-500/10 rounded p-2">Item 1</div>
              <div className="bg-purple-500/10 rounded p-2">Item 2</div>
              <div className="bg-purple-500/10 rounded p-2 @xs:col-span-2 @sm:col-span-1 @md:col-span-2">
                <span className="@xs:hidden @sm:inline @md:hidden">Narrow View</span>
                <span className="@sm:hidden @md:inline">Wide View</span>
              </div>
            </div>
          </div>

          {/* Third nested container - only visible at larger sizes */}
          <div className="border border-dashed border-orange-500 p-4 hidden @lg:block @container">
            <div className="text-sm text-orange-500 mb-2">Nested Container 3</div>

            {/* Content that changes based on nested container width */}
            <div className="@container">
              <div className="@xs:flex @xs:flex-col @sm:flex-row @sm:items-center gap-2">
                <div className="bg-orange-500/10 rounded p-2 flex-1">
                  <div className="@xs:text-sm @sm:text-base">Adaptive Content</div>
                </div>
                <button className="bg-orange-500 text-white rounded px-3 py-1 @xs:w-full @sm:w-auto">
                  <span className="@xs:inline @sm:hidden">Action</span>
                  <span className="@xs:hidden @sm:inline">Take Action</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-4">
        <p>Notice how each container adapts independently based on its own width:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>The outer container changes from a single column to a 2-column or 3-column grid</li>
          <li>Each nested container adapts its own layout based on its available width</li>
          <li>The third container only appears when the outer container is wide enough</li>
          <li>Text sizes, layouts, and visible elements all change based on container widths</li>
        </ul>
      </div>
    </div>
  )
}
