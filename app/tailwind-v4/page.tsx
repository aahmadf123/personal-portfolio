import { TailwindV4Showcase } from "@/components/tailwind-v4-showcase"

export const metadata = {
  title: "Tailwind CSS v4 Features",
  description: "Exploring the new features in Tailwind CSS v4",
}

export default function TailwindV4Page() {
  return (
    <main className="min-h-screen">
      <TailwindV4Showcase />
    </main>
  )
}
