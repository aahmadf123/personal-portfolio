import { QuantumLogoCustomizer } from "@/components/quantum-logo-customizer"

export default function QuantumLogoDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black py-16">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 inline-block mb-4">
              Quantum Particle Logo Customizer
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Customize the quantum particle logo animation with various parameters. Adjust colors, particle behavior,
              and visual effects to create your own unique version.
            </p>
          </div>

          <QuantumLogoCustomizer />

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Use this customizer to create your own quantum particle logo for your projects. Once you're happy with the
              design, you can copy the code to use it in your own applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
