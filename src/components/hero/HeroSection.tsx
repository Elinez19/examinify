import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroPreview } from "./HeroPreview"
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  School,
  FileCheck2,
  TrendingUp,
  Sparkles,
  GraduationCap,
} from "lucide-react"

interface HeroSectionProps {
  onExploreCbt: () => void
  onBookDemo: () => void
  onTryDemoAccount?: () => void
}

export function HeroSection({ onExploreCbt, onBookDemo, onTryDemoAccount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28">
      {/* Background Decorative Ambient Radial Glows */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary/20 to-sky-300/20 opacity-40 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Header Badge */}
          <div className="flex flex-col items-center text-center">
            <Badge variant="pill" className="px-4 py-1.5 text-xs font-medium gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <span className="font-semibold text-foreground">One Platform to Measure Exam Readiness</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-semibold">⚡ Go Paperless</span>
            </Badge>

            {/* Main Hero Headline */}
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              One Platform for All Your{" "}
              <span className="relative inline-block text-foreground">
                School Term Exams.
              </span>{" "}
              <span className="bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Move from Paper to CBT.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground sm:text-xl sm:leading-relaxed">
              Examinify delivers computer-based readiness assessments that simulate real exam conditions,
              benchmark performance, and reveal learning gaps early — so students, parents, and schools can make
              informed decisions with confidence.
            </p>

            {/* CTA Buttons Row using customized Button */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
              <Button
                variant="primary"
                size="xl"
                sheen
                onClick={onTryDemoAccount || onExploreCbt}
                rightIcon={<ArrowRight className="size-5" />}
                className="w-full sm:w-auto"
              >
                Launch Student Dashboard Demo
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={onExploreCbt}
                leftIcon={<GraduationCap className="size-5 text-primary" />}
                className="w-full sm:w-auto"
              >
                Try Practice CBT Simulator
              </Button>
              <Button
                variant="ghost"
                size="xl"
                onClick={onBookDemo}
                leftIcon={<School className="size-5 text-primary" />}
                className="w-full sm:w-auto text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                Move School to CBT
              </Button>
            </div>

            {/* Quick Demo Account Preview Pill */}
            {onTryDemoAccount && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-muted-foreground">Evaluating the candidate portal?</span>
                <button
                  type="button"
                  onClick={onTryDemoAccount}
                  className="font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-2.5 py-1 bg-primary/10 hover:bg-primary/15 transition-colors"
                >
                  <Sparkles className="size-3.5 fill-current" />
                  <span>Instant Student Demo Account (Amina Adeleke)</span>
                </button>
              </div>
            )}

            {/* Trust Metrics Pill Ribbon */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 text-xs font-medium text-muted-foreground">
              <div className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>
                  <strong className="text-foreground">Millions</strong> of Students Assessed
                </span>
              </div>
              <div className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2">
                <FileCheck2 className="size-4 text-primary" />
                <span>
                  <strong className="text-foreground">All Term</strong> & Promotional Exams
                </span>
              </div>
              <div className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2">
                <TrendingUp className="size-4 text-status-success" />
                <span>
                  <strong className="text-foreground">Early</strong> Learning Gap Detection
                </span>
              </div>
              <div className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>
                  <strong className="text-foreground">100%</strong> Paperless & Instant Results
                </span>
              </div>
            </div>
          </div>

        {/* Hero Interactive Showcase / Product Preview Mockup */}
        <HeroPreview onExploreCbt={onExploreCbt} />
      </div>
    </section>
  )
}
