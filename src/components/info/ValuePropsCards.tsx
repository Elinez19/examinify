import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  School,
  GraduationCap,
  BookOpen,
  TrendingUp,
  BarChart3,
  Clock,
  Target,
  LineChart,
  FileCheck2,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react"

interface ValuePropsCardsProps {
  onCtaClick: () => void
}

export function ValuePropsCards({ onCtaClick }: ValuePropsCardsProps) {
  return (
    <div>
      <Tabs defaultValue="students" className="w-full">
        {/* Audience Switcher Tabs */}
        <div className="flex justify-center">
          <TabsList className="p-1.5 rounded-2xl">
            <TabsTrigger value="students" className="flex items-center gap-2.5 px-5 py-2.5">
              <GraduationCap className="size-4 text-primary" />
              <span>For Learners & Students</span>
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex items-center gap-2.5 px-5 py-2.5">
              <School className="size-4 text-primary" />
              <span>For Teachers & Educators</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: For Learners & Students */}
        <TabsContent value="students">
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Discover how we support success for every learner</span>
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: High Quality Contents */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <BookOpen className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Syllabus Standards
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  High Quality Content
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Well-constructed, relevant, and effective questions that assess a student’s knowledge
                  and understanding of the subject and assess their readiness for exams.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">100% Curriculum</div>
                <div className="text-xs font-medium text-muted-foreground">Aligned across all core subjects</div>
              </div>
            </Card>

            {/* Card 2: Personalized Learning Paths */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <TrendingUp className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Adaptive Practice
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Personalized Learning Paths
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Learners and students practice at their own pace. Our CBT system adapts to individual
                  learning styles and pace, offering personalized learning paths that cater to their specific needs.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Self-Paced</div>
                <div className="text-xs font-medium text-muted-foreground">Tailored practice for every learner</div>
              </div>
            </Card>

            {/* Card 3: Detailed Analytics */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <BarChart3 className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Progress Tracking
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Detailed Analytics
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Comprehensive performance analytics help students track their progress, identify areas
                  for improvement, and tailor their study plans accordingly.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Topic-by-Topic</div>
                <div className="text-xs font-medium text-muted-foreground">Identify gaps before test day</div>
              </div>
            </Card>

            {/* Card 4: Authentic Exam Simulation */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Clock className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Exam Simulation
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Simulate Real Conditions
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Deliver CBT-based readiness assessments that simulate real exam conditions, benchmark
                  performance, and build genuine confidence for high-stakes test days.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Zero Anxiety</div>
                <div className="text-xs font-medium text-muted-foreground">Familiar exam runner environment</div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: For Teachers & Educators */}
        <TabsContent value="schools">
          <div className="mt-8 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Tools that empower teachers and educators</span>
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Quick Performance Analysis */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <LineChart className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Educator Tools
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Quick Performance Analysis
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  This technology enables educators with quick performance analysis, revealing student
                  strengths and areas for improvement at a glance across classes and subjects.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Instant Insights</div>
                <div className="text-xs font-medium text-muted-foreground">Spot classroom learning gaps early</div>
              </div>
            </Card>

            {/* Card 2: Refine Teaching Strategies */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Target className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Teaching Strategies
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Adaptable Assessments
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Its adaptability in tailoring assessments enables educators to refine teaching
                  strategies for a personalized learning experience that meets every student's needs.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Targeted Revision</div>
                <div className="text-xs font-medium text-muted-foreground">Focus lessons where help is needed</div>
              </div>
            </Card>

            {/* Card 3: Move from Paper to CBT */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileCheck2 className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  All School Exams
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Move from Paper to CBT
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  One platform for all your school term exams and promotional exams. Move from paper-based
                  to CBT exams. Go paperless, save printing costs, and eliminate manual grading errors.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Go Paperless</div>
                <div className="text-xs font-medium text-muted-foreground">For term & promotional exams</div>
              </div>
            </Card>

            {/* Card 4: Informed Decisions for Parents & Schools */}
            <Card glossy className="flex flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Users className="size-6 stroke-[2]" />
                </div>
                <div className="mt-5 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                  Informed Decisions
                </div>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  Benchmark Performance
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Reveal learning gaps early so students, parents, and schools can make informed decisions
                  with confidence, tracking readiness before high-stakes promotional exams.
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="text-xl font-black text-foreground">Confidence</div>
                <div className="text-xs font-medium text-muted-foreground">Clear reports for parents & schools</div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Callout Bar */}
      <div className="mt-12 rounded-2xl bg-card border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <School className="size-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">
              One platform for all your school term exams and promotional exams.
            </h4>
            <p className="text-sm text-muted-foreground">
              Move from paper-based to CBT exams. Go paperless, save administrative time, and reveal learning gaps early.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="default"
          sheen
          onClick={onCtaClick}
          rightIcon={<ArrowRight className="size-4" />}
          className="shrink-0"
        >
          Move Your School to CBT
        </Button>
      </div>
    </div>
  )
}
