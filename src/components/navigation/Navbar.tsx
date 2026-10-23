import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  BookOpenCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  School,
  GraduationCap,
  Users,
  ShieldCheck,
} from "lucide-react"

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void
  onNavigateAuth?: (mode: "signin" | "signup") => void
  onNavigateDashboard?: () => void
  onNavigateTeacher?: () => void
}

export function Navbar({
  onScrollToSection,
  onNavigateAuth,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [solutionsOpen, setSolutionsOpen] = React.useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = React.useState(true)
  const solutionsRef = React.useRef<HTMLDivElement>(null)

  // Close solutions dropdown on click outside or escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSolutionsOpen(false)
      }
    }

    if (solutionsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [solutionsOpen])

  const handleSolutionClick = () => {
    onScrollToSection("info-section")
    setSolutionsOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Main Navigation"
          className="glossy-surface flex h-16 items-center justify-between rounded-2xl px-4 sm:px-6"
        >
          {/* Brand Logo with improved educational examination emblem */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105">
                <BookOpenCheck className="size-5.5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Examinify
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                  School & Readiness CBT
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1.5 lg:gap-3">
            {/* Solutions Dropdown Menu */}
            <div
              className="relative"
              ref={solutionsRef}
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSolutionsOpen((prev) => !prev)}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted flex items-center gap-1",
                  solutionsOpen ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    solutionsOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Solutions Submenu Panel */}
              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-76 rounded-2xl bg-card/95 border border-border shadow-xl backdrop-blur-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Tailored CBT Solutions
                  </div>

                  <button
                    type="button"
                    onClick={handleSolutionClick}
                    className="w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted group/item cursor-pointer"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <School className="size-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                        For Schools
                      </div>
                      <div className="text-xs text-muted-foreground leading-snug">
                        Term & promotional exam management with paperless reporting.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleSolutionClick}
                    className="w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted group/item cursor-pointer"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <GraduationCap className="size-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                        For Teachers
                      </div>
                      <div className="text-xs text-muted-foreground leading-snug">
                        Exam authoring, instant grading, and automated gradebooks.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleSolutionClick}
                    className="w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted group/item cursor-pointer"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <Users className="size-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                        For Students
                      </div>
                      <div className="text-xs text-muted-foreground leading-snug">
                        Readiness assessments, self-paced practice, and analytics.
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onScrollToSection("info-section")}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Benefits
            </button>
            <button
              onClick={() => onScrollToSection("features-grid")}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Features
            </button>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            {onNavigateAuth && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateAuth("signin")}
                  className="text-xs font-semibold text-foreground/80 hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  sheen
                  onClick={() => onNavigateAuth("signup")}
                  className="text-xs font-semibold shadow-xs"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="glossy-surface mt-2 flex flex-col gap-2 rounded-2xl p-4 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile Solutions Section */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setMobileSolutionsOpen((prev) => !prev)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    mobileSolutionsOpen && "rotate-180"
                  )}
                />
              </button>

              {mobileSolutionsOpen && (
                <div className="ml-3 my-1 pl-3 border-l-2 border-primary/30 flex flex-col gap-1 animate-in fade-in duration-150">
                  <button
                    type="button"
                    onClick={handleSolutionClick}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <School className="size-4 text-primary" />
                    <span>For Schools</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSolutionClick}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <GraduationCap className="size-4 text-primary" />
                    <span>For Teachers</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSolutionClick}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Users className="size-4 text-primary" />
                    <span>For Students</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onScrollToSection("info-section")
                setMobileMenuOpen(false)
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
            >
              <span>Benefits</span>
              <Sparkles className="size-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => {
                onScrollToSection("features-grid")
                setMobileMenuOpen(false)
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
            >
              <span>Features</span>
              <ShieldCheck className="size-4 text-muted-foreground" />
            </button>

            {onNavigateAuth && (
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    onNavigateAuth("signin")
                    setMobileMenuOpen(false)
                  }}
                  className="font-semibold justify-center"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  sheen
                  onClick={() => {
                    onNavigateAuth("signup")
                    setMobileMenuOpen(false)
                  }}
                  className="font-semibold justify-center"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

