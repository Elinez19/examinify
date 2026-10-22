import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroPalette } from "./HeroPalette"
import {
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  GraduationCap,
  School,
  Target,
  CheckCheck,
} from "lucide-react"

interface HeroPreviewProps {
  onExploreCbt: () => void
}

export function HeroPreview({ onExploreCbt }: HeroPreviewProps) {
  const [activePreviewTab, setActivePreviewTab] = React.useState<"student" | "proctor">("student")
  const [selectedHeroAnswer, setSelectedHeroAnswer] = React.useState("a")
  const [heroFlagged, setHeroFlagged] = React.useState(false)

  return (
    <div className="mt-14 sm:mt-18">
      <div className="glossy-surface glow-ambient overflow-hidden rounded-3xl p-2 sm:p-4">
        {/* Window Header Bar with View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border px-4 py-3 bg-card/70 rounded-2xl">
          {/* Fake Window Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="size-3 rounded-full bg-destructive/80 inline-block" />
            <span className="size-3 rounded-full bg-status-warning inline-block" />
            <span className="size-3 rounded-full bg-status-success inline-block" />
            <span className="ml-2 text-xs font-mono text-muted-foreground hidden md:inline">
              examinify.com/exams/term-readiness
            </span>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setActivePreviewTab("student")}
              className={`cursor-pointer flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activePreviewTab === "student"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="size-3.5 text-primary" />
              <span>Student Practice View</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewTab("proctor")}
              className={`cursor-pointer flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activePreviewTab === "proctor"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <School className="size-3.5 text-primary" />
              <span>Teacher & School Dashboard</span>
            </button>
          </div>

          {/* Connection Status indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-status-success inline-block" />
            <span className="font-medium text-foreground">Auto-Saved & Ready</span>
          </div>
        </div>

        {/* View 1: Student CBT Runner */}
        {activePreviewTab === "student" && (
          <div className="p-4 sm:p-8 bg-card/90 rounded-2xl mt-2 animate-in fade-in duration-300">
            {/* Exam Sub-Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary">
                  Exam Readiness Assessment • Term 2 Mock Practice
                </span>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Mathematics & Quantitative Reasoning
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Countdown Timer with urgency badge */}
                <div className="glossy-pill flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-foreground border border-border">
                  <Clock className="size-4 text-primary" />
                  <span className="font-mono text-base font-bold text-primary">42:15</span>
                  <span className="text-[11px] text-muted-foreground font-normal">rem.</span>
                </div>

                {/* Auto-save status */}
                <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-status-success/10 border border-status-success/20 px-3 py-2 text-xs font-medium text-status-success">
                  <CheckCircle2 className="size-3.5 text-status-success" />
                  <span>Saved automatically</span>
                </div>
              </div>
            </div>

            {/* Question & Palette Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Main Question Display (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="px-2.5 py-1 text-xs">
                      Question 14 of 40
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setHeroFlagged(!heroFlagged)}
                      className={`cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        heroFlagged
                          ? "text-status-warning font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Bookmark
                        className={`size-3.5 ${
                          heroFlagged ? "fill-status-warning text-status-warning" : ""
                        }`}
                      />
                      <span>{heroFlagged ? "Flagged for Review" : "Flag for Review"}</span>
                    </button>
                  </div>

                  <p className="mt-4 text-base sm:text-lg font-medium text-foreground leading-relaxed">
                    Solve for <span className="font-mono font-semibold text-primary">x</span> in the quadratic equation:
                    <span className="my-2 block rounded-xl bg-muted p-3 font-mono text-sm sm:text-base font-semibold text-foreground border border-border">
                      2x² - 7x + 3 = 0
                    </span>
                    Select the correct pair of values:
                  </p>

                  {/* Interactive Radio Options */}
                  <div className="mt-6 space-y-3">
                    {[
                      { id: "a", label: "A", text: "x = 3 or x = 1/2" },
                      { id: "b", label: "B", text: "x = -3 or x = 2" },
                      { id: "c", label: "C", text: "x = 1 or x = 3/2" },
                      { id: "d", label: "D", text: "x = 2 or x = -1/2" },
                    ].map((option) => {
                      const isSelected = selectedHeroAnswer === option.id
                      return (
                        <label
                          key={option.id}
                          onClick={() => setSelectedHeroAnswer(option.id)}
                          className={`cursor-pointer group flex items-center justify-between rounded-xl p-3.5 sm:p-4 border transition-all duration-200 ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary"
                              : "bg-card border-border hover:border-border/80 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex size-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="text-sm sm:text-base font-medium text-foreground">
                              {option.text}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="size-5 text-primary" />}
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                  <Button variant="outline" size="sm">
                    Previous Question
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Quick Practice Mode
                    </span>
                    <Button variant="primary" size="sm" rightIcon={<ChevronRight className="size-4" />}>
                      Next Question
                    </Button>
                  </div>
                </div>
              </div>

              {/* Question Jump Palette (4 cols) */}
              <div className="lg:col-span-4">
                <HeroPalette
                  currentQuestionNumber={14}
                  heroFlagged={heroFlagged}
                  onExploreCbt={onExploreCbt}
                />
              </div>
            </div>
          </div>
        )}

        {/* View 2: Teacher & School Dashboard */}
        {activePreviewTab === "proctor" && (
          <div className="p-4 sm:p-8 bg-card/90 rounded-2xl mt-2 animate-in fade-in duration-300">
            {/* Teacher Top Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary">
                  Tools That Empower Teachers & Educators
                </span>
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  Class 10A • Term Exam Readiness Overview
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-xl bg-status-success/10 px-3 py-1.5 text-xs font-semibold text-status-success border border-status-success/20">
                  <CheckCheck className="size-3.5 text-status-success" />
                  <span>38 of 40 Students Completed</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary border border-primary/20">
                  <Target className="size-3.5" />
                  <span>Promotional Exam Prep</span>
                </span>
              </div>
            </div>

            {/* Teacher Metrics Grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Class Readiness Score
                </div>
                <div className="mt-1 text-2xl font-bold text-foreground">78.4%</div>
                <div className="mt-1 text-xs text-status-success font-medium">
                  +6.2% improvement from mid-term
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Identified Learning Gaps
                </div>
                <div className="mt-1 text-2xl font-bold text-status-warning">3 Topics</div>
                <div className="mt-1 text-xs text-muted-foreground">Quadratic equations, word problems</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Automated Grading
                </div>
                <div className="mt-1 text-2xl font-bold text-foreground">100% Instant</div>
                <div className="mt-1 text-xs text-status-success font-medium">Zero paper marking hours</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground uppercase">
                  Teaching Strategy
                </div>
                <div className="mt-1 text-2xl font-bold text-primary">Tailored</div>
                <div className="mt-1 text-xs text-primary font-medium">Adaptive revision groups ready</div>
              </div>
            </div>

            {/* Quick Performance Analysis: Student Strengths & Areas for Improvement */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Quick Performance Analysis: Student Strengths & Improvement Areas
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Revealing student strengths early so educators can refine teaching strategies
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary">
                  Class 10A • Continuous Assessment
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    name: "David Adeleke",
                    score: "36/40 (90%)",
                    status: "ready",
                    label: "High Readiness",
                    strength: "Strong in Algebra & Geometry",
                    action: "Advanced extension topics",
                  },
                  {
                    name: "Amina Yusuf",
                    score: "34/40 (85%)",
                    status: "ready",
                    label: "High Readiness",
                    strength: "Excellent problem-solving pace",
                    action: "Ready for promotional exam",
                  },
                  {
                    name: "Chinedu Okeke",
                    score: "22/40 (55%)",
                    status: "review",
                    label: "Learning Gap Found",
                    strength: "Good basic calculations",
                    action: "Needs review: Quadratic equations",
                  },
                  {
                    name: "Fatima Bello",
                    score: "31/40 (78%)",
                    status: "ready",
                    label: "On Track",
                    strength: "Solid subject understanding",
                    action: "Practice time management",
                  },
                ].map((candidate) => (
                  <div
                    key={candidate.name}
                    className={`rounded-xl p-3.5 border transition-all ${
                      candidate.status === "review"
                        ? "border-status-warning/40 bg-status-warning/5"
                        : "border-border bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{candidate.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          candidate.status === "review"
                            ? "bg-status-warning/20 text-status-warning"
                            : "bg-status-success/15 text-status-success"
                        }`}
                      >
                        {candidate.label}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-foreground">
                      Score: {candidate.score}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <strong className="text-foreground">Strength:</strong> {candidate.strength}
                    </div>
                    <div className="mt-1 text-xs text-primary font-medium">
                      → {candidate.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
