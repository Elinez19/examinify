import { Badge } from "@/components/ui/badge"
import { ValuePropsCards } from "./ValuePropsCards"
import { TrustProofCards } from "./TrustProofCards"
import { Sparkles } from "lucide-react"

interface InfoSectionProps {
  onCtaClick: () => void
}

export function InfoSection({ onCtaClick }: InfoSectionProps) {
  return (
    <section id="info-section" className="py-20 sm:py-28 bg-muted/30 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="default" className="gap-2 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Discover How We Support Success</span>
          </Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Built for Every <span className="text-primary">Learner</span>. Empowering Every{" "}
            <span className="text-foreground">Educator</span>.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Examinify delivers CBT-based readiness assessments that simulate real exam conditions,
            benchmark performance, and reveal learning gaps early so students, parents, and schools can
            make informed decisions with confidence.
          </p>
        </div>

        {/* 1. Benefits Cards (Schools & Students) */}
        <ValuePropsCards onCtaClick={onCtaClick} />

        {/* 2. Trust Proof, Compliance & Testimonials */}
        <TrustProofCards />
      </div>
    </section>
  )
}
