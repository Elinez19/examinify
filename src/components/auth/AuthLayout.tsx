import * as React from "react"
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Users,
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthLayoutProps {
  children: React.ReactNode
  onBackToHome?: () => void
  currentMode?: "signin" | "signup" | "forgot-password" | "reset-success"
  onModeChange?: (mode: "signin" | "signup") => void
}

export function AuthLayout({
  children,
  onBackToHome,
  currentMode = "signin",
  onModeChange,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Top Header for Mobile & Quick Navigation */}
      <header className="w-full border-b border-border/70 bg-card/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Brand Logo Link */}
          <button
            type="button"
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-left transition-transform duration-200 active:scale-95 cursor-pointer"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck className="size-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground leading-none">
                Examinify
              </span>
              <span className="text-[9px] font-bold tracking-wider text-primary uppercase mt-0.5">
                School & Readiness CBT
              </span>
            </div>
          </button>

          {/* Quick Nav / Mode Switcher in Header */}
          <div className="flex items-center gap-3">
            {onModeChange && (
              <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-muted text-xs">
                <button
                  type="button"
                  onClick={() => onModeChange("signin")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    currentMode === "signin"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("signup")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    currentMode === "signup"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Branding Showcase (Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between pr-4 xl:pr-8 space-y-8">
            {/* Header / Intro */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold border border-primary/20">
                <Sparkles className="size-3.5 text-primary" />
                <span>Enterprise Grade CBT Examination Cloud</span>
              </div>

              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Secure, High-Speed CBT Assessments For Schools & Candidates
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                Examinify powers term examinations, mock UTME/WAEC drills, and institutional certifications with offline resilience and anti-cheating analytics.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-status-success/15 text-status-success shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Zero-Latency Answer Syncing</h4>
                  <p className="text-xs text-muted-foreground">Local persistence ensures candidate answers are never lost during power or network hiccups.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0 mt-0.5">
                  <ShieldCheck className="size-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Anti-Malpractice & Tab-Lock Proctoring</h4>
                  <p className="text-xs text-muted-foreground">Real-time alerts, browser restriction, and randomized question shuffling per candidate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-7 items-center justify-center rounded-lg bg-status-info/15 text-status-info shrink-0 mt-0.5">
                  <Award className="size-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Instant Automated Scorecards & Analytics</h4>
                  <p className="text-xs text-muted-foreground">Comprehensive subject mastery breakdowns and exportable ministry-format broadsheets.</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="glossy-card p-5 rounded-2xl border border-border space-y-3">
              <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
                &ldquo;Examinify transformed our term exam administration. Over 1,400 students completed their CBT promotion tests concurrently with zero server downtime.&rdquo;
              </p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    OA
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Dr. O. Adeleke</div>
                    <div className="text-[10px] text-muted-foreground">Principal, Corona College Lagos</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Verified School
                </Badge>
              </div>
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/80">
              <div>
                <div className="text-xl font-extrabold text-foreground">250,000+</div>
                <div className="text-[11px] text-muted-foreground">Tests Administered</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-primary">99.98%</div>
                <div className="text-[11px] text-muted-foreground">Platform Reliability</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-foreground">120+</div>
                <div className="text-[11px] text-muted-foreground">Partner Centers</div>
              </div>
            </div>
          </div>

          {/* Right Form Container Column */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto">
            <div className="glossy-surface rounded-3xl p-6 sm:p-8 border border-border shadow-md">
              {children}
            </div>

            {/* Security Guarantee Under Form */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3.5 text-muted-foreground" />
                <span>SSL Encrypted</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="size-3.5 text-muted-foreground" />
                <span>Academic Standard</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5 text-muted-foreground" />
                <span>NDPR Compliant</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Global Minimal Footer */}
      <footer className="w-full border-t border-border/70 py-4 px-4 sm:px-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Examinify Systems Ltd. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Candidate Code of Conduct</a>
            <a href="#" className="hover:text-foreground transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
