import { Logo } from "./logo"

export function LogoShowcase() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <h2 className="section-title">Logo Options</h2>
        <p className="section-subtitle">
          Exploring visual identities that represent the intersection of AI, Aerospace, and Quantum Computing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <LogoOption
            title="Convergence"
            description="A unified design representing the intersection of all three domains with neural connections, orbital paths, and quantum elements."
            variant="default"
          />

          <LogoOption
            title="Quantum Core"
            description="Emphasizing quantum computing with orbital representations of qubits and superposition states."
            variant="quantum"
          />

          <LogoOption
            title="Neural Network"
            description="Dynamic visualization of an AI neural network with nodes and connections that pulse with activity."
            variant="neural"
          />

          <LogoOption
            title="Aerospace"
            description="Focusing on flight paths, orbital mechanics, and space exploration elements."
            variant="aerospace"
          />
        </div>
      </div>
    </div>
  )
}

interface LogoOptionProps {
  title: string
  description: string
  variant: "default" | "quantum" | "neural" | "aerospace"
}

function LogoOption({ title, description, variant }: LogoOptionProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:border-primary/50 transition-all duration-300">
      <div className="mb-6 p-6 rounded-full bg-black flex items-center justify-center">
        <Logo size={120} variant={variant} animated={true} />
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
