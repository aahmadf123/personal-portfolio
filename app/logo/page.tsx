import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { LogoShowcase } from "@/components/logo-showcase"

export default function LogoPage() {
  return (
    <main className="min-h-screen text-white">
      <Header />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Logo Design</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
            Exploring visual identities that represent the intersection of AI/ML, Aerospace Engineering, and Quantum
            Computing
          </p>

          <div className="flex justify-center mb-16">
            <div className="p-8 rounded-full bg-black inline-block">
              <Logo size={200} variant="default" animated={true} />
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Design Concept</h2>
            <p className="text-muted-foreground mb-6">
              This logo represents the convergence of three cutting-edge fields: Artificial Intelligence, Aerospace
              Engineering, and Quantum Computing. The design incorporates:
            </p>

            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <strong className="text-primary">Neural Network Nodes:</strong> The interconnected nodes represent AI
                  and machine learning, showing how data flows through neural pathways.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-2">•</span>
                <span>
                  <strong className="text-secondary">Orbital Paths:</strong> The elliptical orbits symbolize aerospace
                  engineering, flight paths, and space exploration.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>
                  <strong className="text-accent">Quantum Elements:</strong> The pulsing particles and superposition
                  states represent quantum computing's fundamental principles.
                </span>
              </li>
            </ul>

            <p className="text-muted-foreground">
              The animated elements bring the logo to life, showing the dynamic nature of these technologies and how
              they interact with each other to create innovative solutions.
            </p>
          </div>
        </div>
      </section>

      <LogoShowcase />

      <Footer />
    </main>
  )
}
