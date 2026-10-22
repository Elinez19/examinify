import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

export function CtaSection() {
  const [submitted, setSubmitted] = React.useState(false)
  const [email, setEmail] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section id="cta-section" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glossy-surface glow-ambient relative overflow-hidden rounded-3xl p-8 sm:p-14 lg:p-16 border border-border">
          {/* Subtle Ambient Radial Highlights */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <Badge variant="default" className="gap-2 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Go Paperless Today</span>
            </Badge>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              One Platform for All Your <span className="text-primary">School Term Exams</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Move from paper-based to CBT exams. Deliver readiness assessments that simulate real
              exam conditions, benchmark performance, and reveal learning gaps early so students,
              parents, and schools can make informed decisions with confidence.
            </p>

            {/* Form or Success State */}
            {submitted ? (
              <div className="mt-8 rounded-2xl bg-status-success/10 border border-status-success/30 p-6 text-center animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="mx-auto size-10 text-status-success" />
                <h3 className="mt-3 text-lg font-bold text-foreground">
                  Demo Walkthrough Reserved!
                </h3>
                <p className="mt-1 text-sm text-status-success font-medium">
                  Our education team will contact you within 2 business hours to schedule your personalized school walkthrough.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your school or educator email..."
                  required
                  className="w-full sm:w-96"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  sheen
                  rightIcon={<ArrowRight className="size-4" />}
                  className="w-full sm:w-auto"
                >
                  Schedule a School Demo
                </Button>
              </form>
            )}

            {/* Reassurance Checklist */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Free Setup for Your School</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Works on Any Computer or Tablet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span>Easy for Teachers & Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
