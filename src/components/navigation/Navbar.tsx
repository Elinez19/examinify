import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Menu, X, ArrowUpRight, GraduationCap, School } from "lucide-react"

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void
  onNavigateAuth?: (mode: "signin" | "signup") => void
  onNavigateDashboard?: () => void
  onNavigateTeacher?: () => void
}

export function Navbar({
  onScrollToSection,
  onNavigateAuth,
  onNavigateDashboard,
  onNavigateTeacher,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Main Navigation"
          className="glossy-surface flex h-16 items-center justify-between rounded-2xl px-4 sm:px-6"
        >
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105">
                <ShieldCheck className="size-5.5 stroke-[2.2]" />
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => onScrollToSection("info-section")}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Benefits
            </button>
            <button
              onClick={() => onScrollToSection("simulator-section")}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground flex items-center gap-1.5"
            >
              <span>Practice CBT</span>
              <Badge variant="default" className="text-[10px] px-1.5 py-0.2">
                Live
              </Badge>
            </button>
            <button
              onClick={() => onScrollToSection("features-grid")}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Features
            </button>
            <button
              onClick={() => onScrollToSection("compliance-section")}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Term & Promotional Exams
            </button>
          </div>

          {/* Action CTAs using customized Button */}
          <div className="hidden sm:flex items-center gap-2">
            {onNavigateDashboard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateDashboard}
                leftIcon={<GraduationCap className="size-4 text-primary" />}
                className="text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
              >
                Student Portal
              </Button>
            )}
            {onNavigateTeacher && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateTeacher}
                leftIcon={<School className="size-4 text-primary" />}
                className="text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary"
              >
                Teacher Portal
              </Button>
            )}
            {onNavigateAuth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateAuth("signin")}
                className="text-xs font-semibold text-foreground/80 hover:text-foreground"
              >
                Sign In
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScrollToSection("simulator-section")}
              leftIcon={<GraduationCap className="size-4 text-primary" />}
            >
              Practice Demo
            </Button>
            <Button
              variant="primary"
              size="sm"
              sheen
              onClick={() =>
                onNavigateAuth ? onNavigateAuth("signup") : onScrollToSection("cta-section")
              }
              rightIcon={<ArrowUpRight className="size-4" />}
            >
              Move to CBT
            </Button>
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
          <div className="glossy-surface mt-2 flex flex-col gap-3 rounded-2xl p-4 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                onScrollToSection("info-section")
                setMobileMenuOpen(false)
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
            >
              <span>Benefits</span>
              <School className="size-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => {
                onScrollToSection("simulator-section")
                setMobileMenuOpen(false)
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
            >
              <span>Practice CBT</span>
              <GraduationCap className="size-4 text-primary" />
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
            <button
              onClick={() => {
                onScrollToSection("compliance-section")
                setMobileMenuOpen(false)
              }}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
            >
              <span>Term & Promotional Exams</span>
              <School className="size-4 text-muted-foreground" />
            </button>
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {onNavigateDashboard && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    onNavigateDashboard()
                    setMobileMenuOpen(false)
                  }}
                  leftIcon={<GraduationCap className="size-4 text-primary" />}
                  className="font-semibold justify-center"
                >
                  Candidate Portal
                </Button>
              )}
              {onNavigateTeacher && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    onNavigateTeacher()
                    setMobileMenuOpen(false)
                  }}
                  leftIcon={<School className="size-4 text-primary" />}
                  className="font-semibold justify-center text-primary border-primary/30"
                >
                  Teacher Portal
                </Button>
              )}
              {onNavigateAuth && (
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => {
                    onNavigateAuth("signin")
                    setMobileMenuOpen(false)
                  }}
                  className="font-semibold justify-center"
                >
                  Sign In to CBT Portal
                </Button>
              )}
              <Button
                variant="outline"
                size="default"
                onClick={() => {
                  onScrollToSection("simulator-section")
                  setMobileMenuOpen(false)
                }}
              >
                Practice Demo
              </Button>
              <Button
                variant="primary"
                size="default"
                sheen
                onClick={() => {
                  if (onNavigateAuth) {
                    onNavigateAuth("signup")
                  } else {
                    onScrollToSection("cta-section")
                  }
                  setMobileMenuOpen(false)
                }}
              >
                Create Candidate Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
