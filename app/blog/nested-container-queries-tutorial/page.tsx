import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NestedContainerDemo } from "@/components/blog/nested-container-demo"
import { GitHubContributionGraph } from "@/components/github-contribution-graph"

export const metadata = {
  title: "A Comprehensive Guide to Implementing Nested Container Queries",
  description: "Learn how to create sophisticated responsive layouts with nested container queries in modern CSS",
  openGraph: {
    title: "A Comprehensive Guide to Implementing Nested Container Queries",
    description: "Learn how to create sophisticated responsive layouts with nested container queries in modern CSS",
    type: "article",
    url: "https://yoursite.com/blog/nested-container-queries-tutorial",
  },
}

export default function NestedContainerQueriesTutorial() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-6">A Comprehensive Guide to Implementing Nested Container Queries</h1>

          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <time dateTime="2023-05-07">May 7, 2023</time>
            <span className="mx-2">•</span>
            <span>15 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
            <Image
              src="/responsive-nested-containers.png"
              alt="Nested container queries visualization"
              fill
              className="object-cover"
              priority
            />
          </div>

          <h2>Introduction</h2>
          <p>
            For years, web developers have relied on media queries to create responsive designs. While effective, media
            queries have a significant limitation: they're based on the viewport size, not the size of the component's
            container. This means that the same component might need to look different depending on where it's placed in
            your layout, but media queries can't help with that.
          </p>
          <p>
            Enter <strong>container queries</strong> — a revolutionary feature that allows components to adapt based on
            their container's size rather than the viewport. And when we nest these container queries, we unlock even
            more powerful responsive design possibilities.
          </p>

          {/* Interactive Demo */}
          <NestedContainerDemo />

          <h2>What Are Container Queries?</h2>
          <p>
            Container queries allow you to apply styles to an element based on the size of its containing element rather
            than the size of the viewport. This means components can be truly responsive and adapt to their immediate
            context, regardless of where they're placed in your layout.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold mb-4">Key Benefits of Container Queries</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Component Independence</strong>: Components can be placed anywhere in your application and will
                adapt appropriately
              </li>
              <li>
                <strong>Reusability</strong>: The same component can adapt to different contexts without needing
                different variants
              </li>
              <li>
                <strong>Maintainability</strong>: Changes to one component don't affect others, making your codebase
                easier to maintain
              </li>
              <li>
                <strong>Flexibility</strong>: Design systems become more flexible and adaptable to different layouts
              </li>
            </ul>
          </div>

          <h2>What Are Nested Container Queries?</h2>
          <p>
            Nested container queries take this concept a step further by establishing container query contexts at
            multiple levels of your component hierarchy. Each component can then adapt based on its own container size,
            creating a cascading effect of responsive design.
          </p>
          <p>
            This approach enables sophisticated layouts that adapt at multiple levels simultaneously, providing an
            unparalleled level of control over how your components respond to their environment.
          </p>

          <h2>Browser Support</h2>
          <p>
            Container queries are supported in all modern browsers including Chrome, Firefox, Safari, and Edge. However,
            it's always a good idea to check the latest browser support before implementing them in production.
          </p>

          <h2>Basic Implementation</h2>
          <p>Let's start with the basics of implementing container queries:</p>

          <h3>1. Define a Container</h3>
          <p>First, you need to define an element as a container:</p>

          <pre className="language-css">
            <code>{`.parent {
  container-type: inline-size;
  container-name: parent;
}`}</code>
          </pre>

          <p>
            There are three values for <code>container-type</code>:
          </p>
          <ul>
            <li>
              <code>size</code>: Creates a query container for both dimensions
            </li>
            <li>
              <code>inline-size</code>: Creates a query container for the inline dimension only (width in horizontal
              writing modes)
            </li>
            <li>
              <code>normal</code>: The element is not a query container
            </li>
          </ul>

          <p>
            You can also use the shorthand <code>container</code> property:
          </p>

          <pre className="language-css">
            <code>{`.parent {
  container: parent / inline-size;
}`}</code>
          </pre>

          <h3>2. Query the Container</h3>
          <p>Now you can apply styles based on the container's size:</p>

          <pre className="language-css">
            <code>{`@container parent (min-width: 400px) {
  .child {
    font-size: 1.5rem;
  }
}`}</code>
          </pre>

          <p>
            This will apply the styles to <code>.child</code> when its container (<code>.parent</code>) is at least
            400px wide.
          </p>

          <h2>Implementing Nested Container Queries</h2>
          <p>
            Now, let's explore how to implement nested container queries. The key is to establish container query
            contexts at multiple levels of your component hierarchy.
          </p>

          <h3>1. Define Multiple Containers</h3>
          <p>First, define multiple elements as containers:</p>

          <pre className="language-css">
            <code>{`.grandparent {
  container-type: inline-size;
  container-name: grandparent;
}

.parent {
  container-type: inline-size;
  container-name: parent;
}

.child {
  container-type: inline-size;
  container-name: child;
}`}</code>
          </pre>

          <h3>2. Query Each Container</h3>
          <p>Now you can apply styles based on each container's size:</p>

          <pre className="language-css">
            <code>{`/* Styles based on grandparent size */
@container grandparent (min-width: 800px) {
  .parent {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

/* Styles based on parent size */
@container parent (min-width: 500px) {
  .child {
    padding: 2rem;
  }
}

/* Styles based on child size */
@container child (min-width: 300px) {
  .grandchild {
    font-size: 1.2rem;
  }
}`}</code>
          </pre>

          <h2>Using Container Queries with Tailwind CSS</h2>
          <p>
            If you're using Tailwind CSS, you can leverage the <code>@container</code> directive to create container
            query variants. Here's how to set it up:
          </p>

          <h3>1. Configure Tailwind</h3>
          <p>
            First, update your <code>tailwind.config.js</code> file:
          </p>

          <pre className="language-javascript">
            <code>{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Define your container query breakpoints
      containers: {
        xs: '20rem',   // 320px
        sm: '24rem',   // 384px
        md: '28rem',   // 448px
        lg: '32rem',   // 512px
        xl: '36rem',   // 576px
        '2xl': '42rem', // 672px
        '3xl': '48rem', // 768px
        '4xl': '56rem', // 896px
        '5xl': '64rem', // 1024px
        '6xl': '72rem', // 1152px
        '7xl': '80rem', // 1280px
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}`}</code>
          </pre>

          <h3>2. Use Container Query Classes</h3>
          <p>Now you can use container query classes in your HTML:</p>

          <pre className="language-html">
            <code>{`<div class="@container">
  <!-- This element is now a container query context -->
  <div class="@sm:text-lg @md:text-xl @lg:text-2xl">
    <!-- This text will change size based on the container width -->
  </div>
</div>`}</code>
          </pre>

          <p>
            The <code>@container</code> class establishes a container query context, and the <code>@sm:</code>,{" "}
            <code>@md:</code>, and <code>@lg:</code> prefixes apply styles at different container widths.
          </p>

          <h3>3. Nesting Container Queries with Tailwind</h3>
          <p>
            To implement nested container queries with Tailwind, simply nest the <code>@container</code> classes:
          </p>

          <pre className="language-html">
            <code>{`<div class="@container">
  <!-- Outer container -->
  <div class="@md:grid @md:grid-cols-2 @lg:grid-cols-3 gap-4">
    
    <div class="@container">
      <!-- Nested container -->
      <div class="@sm:flex @sm:items-center @md:block">
        <div class="@container">
          <!-- Deeply nested container -->
          <p class="@xs:text-sm @sm:text-base @md:text-lg">
            This text responds to its immediate container's width
          </p>
        </div>
      </div>
    </div>
    
  </div>
</div>`}</code>
          </pre>

          <h2>Practical Example: A Card Component with Nested Container Queries</h2>
          <p>
            Let's build a practical example: a card component that adapts at multiple levels using nested container
            queries.
          </p>

          <h3>HTML Structure</h3>

          <pre className="language-html">
            <code>{`<div class="@container">
  <!-- Card container -->
  <div class="border rounded-lg overflow-hidden @container">
    
    <!-- Card header -->
    <div class="p-4 bg-gray-100 @container">
      <h2 class="@sm:text-lg @md:text-xl font-bold">Card Title</h2>
      <p class="@sm:block @xs:hidden text-sm text-gray-500">Card subtitle that appears at wider sizes</p>
    </div>
    
    <!-- Card content -->
    <div class="p-4 @container">
      <!-- Content layout changes based on card width -->
      <div class="@md:flex @md:gap-4">
        <!-- Image container -->
        <div class="@md:w-1/3 mb-4 @md:mb-0">
          <img src="image.jpg" alt="Card image" class="w-full h-auto rounded" />
        </div>
        
        <!-- Text content -->
        <div class="@md:w-2/3 @container">
          <p class="@sm:text-base text-sm mb-4">
            This is the card content that adapts based on the available space.
            The text size, layout, and visible elements all change depending on
            the width of each container.
          </p>
          
          <!-- Actions container -->
          <div class="@sm:flex @sm:justify-between @sm:items-center">
            <button class="bg-blue-500 text-white px-4 py-2 rounded">
              Primary Action
            </button>
            
            <!-- Secondary actions only visible at wider sizes -->
            <div class="@md:flex @md:gap-2 mt-2 @sm:mt-0 hidden @sm:block">
              <button class="text-blue-500 @md:px-4 @md:py-2">
                Secondary Action
              </button>
              <button class="text-gray-500 @md:px-4 @md:py-2 hidden @lg:block">
                Tertiary Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Card footer -->
    <div class="p-4 bg-gray-50 border-t @container">
      <div class="@sm:flex @sm:justify-between @sm:items-center">
        <div class="text-sm text-gray-500 mb-2 @sm:mb-0">Last updated: May 7, 2023</div>
        <div class="@sm:flex @sm:gap-2 hidden @xs:block">
          <span class="text-sm text-gray-500">Category: Technology</span>
        </div>
      </div>
    </div>
    
  </div>
</div>`}</code>
          </pre>

          <p>In this example, we've created a card component with nested container queries at multiple levels:</p>

          <ol>
            <li>The outer container controls the overall card layout</li>
            <li>The card container controls the internal layout of the card</li>
            <li>The header, content, and footer sections each have their own container contexts</li>
            <li>The text content area has its own container context for fine-grained control</li>
          </ol>

          <p>
            This creates a highly adaptive component that can respond to its environment at multiple levels, providing
            an optimal user experience regardless of where it's placed in your layout.
          </p>

          <h2>React Implementation with Tailwind CSS</h2>
          <p>Let's implement the same card component using React and Tailwind CSS:</p>

          <pre className="language-jsx">
            <code>{`import React from 'react';

function AdaptiveCard({ title, subtitle, image, content, category, updatedDate }) {
  return (
    <div className="@container">
      {/* Card container */}
      <div className="border rounded-lg overflow-hidden @container">
        
        {/* Card header */}
        <div className="p-4 bg-gray-100 @container">
          <h2 className="@sm:text-lg @md:text-xl font-bold">{title}</h2>
          <p className="@sm:block @xs:hidden text-sm text-gray-500">{subtitle}</p>
        </div>
        
        {/* Card content */}
        <div className="p-4 @container">
          {/* Content layout changes based on card width */}
          <div className="@md:flex @md:gap-4">
            {/* Image container */}
            <div className="@md:w-1/3 mb-4 @md:mb-0">
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-auto rounded" />
            </div>
            
            {/* Text content */}
            <div className="@md:w-2/3 @container">
              <p className="@sm:text-base text-sm mb-4">{content}</p>
              
              {/* Actions container */}
              <div className="@sm:flex @sm:justify-between @sm:items-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Primary Action
                </button>
                
                {/* Secondary actions only visible at wider sizes */}
                <div className="@md:flex @md:gap-2 mt-2 @sm:mt-0 hidden @sm:block">
                  <button className="text-blue-500 @md:px-4 @md:py-2">
                    Secondary Action
                  </button>
                  <button className="text-gray-500 @md:px-4 @md:py-2 hidden @lg:block">
                    Tertiary Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card footer */}
        <div className="p-4 bg-gray-50 border-t @container">
          <div className="@sm:flex @sm:justify-between @sm:items-center">
            <div className="text-sm text-gray-500 mb-2 @sm:mb-0">Last updated: {updatedDate}</div>
            <div className="@sm:flex @sm:gap-2 hidden @xs:block">
              <span className="text-sm text-gray-500">Category: {category}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AdaptiveCard;`}</code>
          </pre>

          <h2>Advanced Techniques</h2>

          <h3>1. Container Query Units</h3>
          <p>Container queries introduce new relative units that are based on the dimensions of the query container:</p>

          <ul>
            <li>
              <code>cqw</code>: 1% of a query container's width
            </li>
            <li>
              <code>cqh</code>: 1% of a query container's height
            </li>
            <li>
              <code>cqi</code>: 1% of a query container's inline size
            </li>
            <li>
              <code>cqb</code>: 1% of a query container's block size
            </li>
            <li>
              <code>cqmin</code>: The smaller value of cqi or cqb
            </li>
            <li>
              <code>cqmax</code>: The larger value of cqi or cqb
            </li>
          </ul>

          <p>Example usage:</p>

          <pre className="language-css">
            <code>{`.child {
  font-size: calc(1rem + 0.5cqi);
  padding: 2cqw;
  margin-bottom: 3cqh;
}`}</code>
          </pre>

          <h3>2. Style Queries</h3>
          <p>Container queries also support querying based on style properties, not just size:</p>

          <pre className="language-css">
            <code>{`@container style(--theme: dark) {
  .child {
    background-color: #333;
    color: white;
  }
}`}</code>
          </pre>

          <p>This allows components to adapt based on theme variables or other style properties of their container.</p>

          <h3>3. Combining with Media Queries</h3>
          <p>You can combine container queries with media queries for even more control:</p>

          <pre className="language-css">
            <code>{`@media (prefers-color-scheme: dark) {
  @container (min-width: 400px) {
    .child {
      /* Styles for dark mode and container width >= 400px */
    }
  }
}`}</code>
          </pre>

          <h2>Best Practices</h2>

          <h3>1. Start with the Smallest Size</h3>
          <p>
            Design for the smallest container size first, then progressively enhance for larger sizes. This
            "container-first" approach ensures your components work well in all contexts.
          </p>

          <h3>2. Use Logical Properties</h3>
          <p>
            Use logical properties (<code>inline-size</code>, <code>block-size</code>) instead of physical properties (
            <code>width</code>, <code>height</code>) to better support different writing modes and internationalization.
          </p>

          <h3>3. Avoid Deep Nesting</h3>
          <p>
            While nested container queries are powerful, avoid excessive nesting (more than 3-4 levels) as it can become
            difficult to manage and may impact performance.
          </p>

          <h3>4. Test in Different Contexts</h3>
          <p>
            Test your components in various layout contexts to ensure they adapt correctly regardless of where they're
            placed.
          </p>

          <h3>5. Document Container Requirements</h3>
          <p>
            Document the minimum and maximum container sizes your components are designed for to help other developers
            use them correctly.
          </p>

          <h2>Common Pitfalls and Solutions</h2>

          <h3>1. Circular References</h3>
          <p>
            Be careful not to create circular references where a container query affects the size of its own container,
            as this can lead to infinite loops.
          </p>

          <h3>2. Performance Considerations</h3>
          <p>
            While container queries are generally performant, having too many on a page can impact performance. Use them
            judiciously and test performance in real-world scenarios.
          </p>

          <h3>3. Fallbacks for Older Browsers</h3>
          <p>
            Always provide fallbacks for browsers that don't support container queries. This can be done using feature
            detection or by providing a base styling that works reasonably well without container queries.
          </p>

          <pre className="language-css">
            <code>{`@supports (container-type: inline-size) {
  .parent {
    container-type: inline-size;
  }
  
  @container (min-width: 400px) {
    .child {
      /* Container query styles */
    }
  }
}

/* Fallback styles for browsers without container query support */
.child {
  /* Base styles */
}`}</code>
          </pre>

          <section className="my-12 border-t-2 border-b-2 border-gray-200 dark:border-gray-800 py-8">
            <div className="container mx-auto">
              <h2 className="flex items-center gap-3 text-3xl font-bold mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                GitHub Integration
              </h2>
              <p className="text-lg mb-6">
                Track your container query implementation progress with GitHub. Below is a visualization of contribution
                activity for this project:
              </p>
              <div className="mb-8">
                <GitHubContributionGraph />
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4">Setting Up GitHub for Container Query Projects</h3>
                <p>
                  Using GitHub for your container query projects allows you to track changes, collaborate with others,
                  and showcase your work. Here are some best practices for setting up your repository:
                </p>
                <ul>
                  <li>Create a dedicated branch for container query experiments</li>
                  <li>Set up GitHub Pages to showcase your demos</li>
                  <li>Use GitHub Actions to automatically test your container queries across browsers</li>
                  <li>Document your findings in the README.md file</li>
                </ul>
              </div>
            </div>
          </section>

          <h2>Conclusion</h2>
          <p>
            Nested container queries represent a significant advancement in responsive web design, enabling components
            to adapt to their context at multiple levels. By establishing container query contexts throughout your
            component hierarchy, you can create sophisticated layouts that provide an optimal user experience regardless
            of where they're placed.
          </p>
          <p>
            As browser support continues to improve, container queries will become an essential tool in every web
            developer's toolkit. Start experimenting with them today to future-proof your components and create truly
            responsive designs.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 my-8">
            <h3 className="text-xl font-semibold mb-4">Key Takeaways</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Container queries allow components to adapt based on their container's size, not just the viewport
              </li>
              <li>
                Nested container queries enable sophisticated layouts that adapt at multiple levels simultaneously
              </li>
              <li>Tailwind CSS provides excellent support for container queries through the @container directive</li>
              <li>Start with the smallest container size and progressively enhance for larger sizes</li>
              <li>Always provide fallbacks for browsers that don't support container queries</li>
            </ul>
          </div>

          <p>
            Ready to take your responsive design to the next level? Start implementing nested container queries in your
            projects today and experience the power of truly contextual components.
          </p>
        </article>
      </div>
    </div>
  )
}
