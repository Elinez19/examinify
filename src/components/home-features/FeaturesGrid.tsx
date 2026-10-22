import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Sparkles,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  School,
} from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      id: "simulation",
      icon: GraduationCap,
      badge: "Exam Readiness",
      title: "Authentic Exam Simulation",
      description:
        "Accurately simulates real exam conditions with timed practice and clean navigation, preparing students for high-stakes exams without test day anxiety.",
      actionText: "Experience exam conditions",
    },
    {
      id: "gaps",
      icon: TrendingUp,
      badge: "Early Detection",
      title: "Uncover Learning Gaps Early",
      description:
        "Identifies misunderstood concepts and weak subject areas weeks before finals, allowing teachers and parents to make informed decisions and intervene proactively.",
      actionText: "See diagnostic reporting",
    },
    {
      id: "paperless",
      icon: School,
      badge: "Go Paperless",
      title: "All Term & Promotional Exams",
      description:
        "Run mid-term tests, end-of-term examinations, and promotional tests in one unified digital platform. Move from paper to CBT and eliminate printing costs.",
      actionText: "Explore school workflows",
    },
    {
      id: "content",
      icon: CheckCircle2,
      badge: "Curriculum Aligned",
      title: "High Quality Content",
      description:
        "Well-constructed, relevant, and effective questions that assess a student’s true knowledge and understanding across all core subjects and classes.",
      actionText: "Browse question standards",
    },
    {
      id: "analytics",
      icon: BarChart3,
      badge: "Empower Educators",
      title: "Quick Performance Analysis",
      description:
        "Enables educators with immediate score summaries and class-wide trends, revealing student strengths and helping teachers refine classroom strategies.",
      actionText: "View educator tools",
    },
    {
      id: "reliability",
      icon: ShieldCheck,
      badge: "Reliable Testing",
      title: "Worry-Free Auto-Save",
      description:
        "Every keystroke and answer selection is saved continuously. If a computer restarts or power flickers, students immediately resume with zero lost answers.",
      actionText: "Learn about test protection",
    },
  ]

  return (
    <div id="features-grid" className="mt-20 sm:mt-28">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="default" className="gap-2 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="size-3.5" />
          <span>Core Capabilities</span>
        </Badge>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Everything Required for <span className="text-primary">Stress-Free CBT</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          One platform for all your school term and promotional exams. Deliver readiness assessments
          that simulate real exam conditions, benchmark performance, and reveal learning gaps early.
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.id}
              glossy
              className="flex flex-col justify-between rounded-2xl p-6 sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Icon className="size-6 stroke-[2]" />
                  </div>
                  <Badge variant="secondary" className="px-2.5 py-1 text-[11px] font-semibold">
                    {feature.badge}
                  </Badge>
                </div>

                <h3 className="mt-6 text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>{feature.actionText}</span>
                <ArrowRight className="size-3.5" />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
