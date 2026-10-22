import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle2, Sparkles, School } from "lucide-react"

export function TrustProofCards() {
  const testimonials = [
    {
      id: "principal",
      quote:
        "Moving our school term exams from paper to CBT with Examinify was transformative. We eliminated printing costs, and our teachers now spot learning gaps weeks before promotional exams, giving every student a real chance to improve.",
      author: "Mrs. Beatrice Okonjo",
      role: "Head of School & Principal",
      organization: "St. Claire International Academy",
      badge: "School Leadership",
      rating: 5,
    },
    {
      id: "dean",
      quote:
        "The quick performance analytics empower our teachers like never before. Instead of spending weeks grading paper exams, our educators immediately see student strengths and areas for improvement, helping us tailor teaching strategies effectively.",
      author: "Dr. Alistair Vance",
      role: "Academic Director & Curriculum Lead",
      organization: "Horizon Educational Group",
      badge: "Educator Perspective",
      rating: 5,
    },
    {
      id: "student",
      quote:
        "Practicing at my own pace with high quality questions and seeing my personalized learning path built my confidence. When I sat for my final exams, I felt completely prepared because the CBT simulation felt just like the real thing.",
      author: "Liam Chen",
      role: "National CBT Merit Candidate (Top 1% Score)",
      organization: "Batch of 2026 Candidate",
      badge: "Student Success",
      rating: 5,
    },
  ]

  return (
    <div id="compliance-section" className="mt-20 sm:mt-28">
      {/* School Readiness Assurance Ribbon */}
      <Card glossy className="rounded-3xl p-6 sm:p-10 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs font-semibold">
              <School className="size-3.5" />
              <span>Institutional Readiness</span>
            </Badge>
            <h3 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
              One Platform for All Your School Term & Promotional Exams
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Transition smoothly from paper to digital testing. Measure readiness, uncover learning gaps, and go paperless.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-foreground">
            <span className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2 border border-border">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Term & Mid-Term Exams</span>
            </span>
            <span className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2 border border-border">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Promotional Tests</span>
            </span>
            <span className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2 border border-border">
              <CheckCircle2 className="size-4 text-primary" />
              <span>High-Stakes Mock Prep</span>
            </span>
            <span className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2 border border-border">
              <CheckCircle2 className="size-4 text-primary" />
              <span>100% Paperless</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Testimonials Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="default" className="gap-2 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          <span>Real Impact</span>
        </Badge>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Used by Millions to Assess <span className="text-primary">Exam Readiness</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          See how schools, educators, and students make informed decisions and achieve better outcomes with Examinify.
        </p>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card
            key={t.id}
            glossy
            className="flex flex-col justify-between rounded-2xl p-6 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="px-3 py-1 text-[11px] font-bold">
                  {t.badge}
                </Badge>
                <div className="flex items-center gap-1 text-status-warning">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-status-warning text-status-warning" />
                  ))}
                </div>
              </div>

              <blockquote className="mt-5 text-sm sm:text-base font-medium text-foreground leading-relaxed italic">
                "{t.quote}"
              </blockquote>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="font-bold text-foreground text-base">{t.author}</div>
              <div className="text-xs text-primary font-medium">{t.role}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t.organization}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
