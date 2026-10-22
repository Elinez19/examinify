import { SimulatorSection } from "./SimulatorSection"
import { FeaturesGrid } from "./FeaturesGrid"

export function HomeFeaturesSection() {
  return (
    <section id="home-features" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Interactive CBT Runner Simulator */}
        <SimulatorSection />

        {/* 2. Six Core Enterprise Features Grid */}
        <FeaturesGrid />
      </div>
    </section>
  )
}
