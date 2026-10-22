import * as React from "react"
import {
  Bell,
  Search,
  Menu,
  Home,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { IStudentProfile, DashboardTab } from "../../types/student"

interface DashboardHeaderProps {
  profile: IStudentProfile
  unreadNotificationsCount: number
  onMarkNotificationsRead: () => void
  onNavigateHome?: () => void
  onTabChange: (tab: DashboardTab) => void
  onOpenMobileMenu: () => void
}

export function DashboardHeader({
  profile,
  unreadNotificationsCount,
  onMarkNotificationsRead,
  onNavigateHome,
  onTabChange,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false)

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Open sidebar navigation"
          >
            <Menu className="size-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Portal:</span>
            <Badge variant="pill" className="px-2.5 py-0.5 text-xs font-medium gap-1.5">
              <span className="size-2 rounded-full bg-status-success animate-pulse" />
              <span>{profile.gradeLevel}</span>
            </Badge>
          </div>
        </div>

        {/* Center: Search Quick Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subjects, exams, or teachers..."
              className="w-full h-9 rounded-xl border border-border bg-muted/50 pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
            />
          </div>
        </div>

        {/* Right Side: Actions, Notifications & Candidate Chip */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onNavigateHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateHome}
              leftIcon={<Home className="size-4" />}
              className="hidden lg:inline-flex text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Public Home
            </Button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown)
                if (unreadNotificationsCount > 0) {
                  onMarkNotificationsRead()
                }
              }}
              className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              aria-label="View notifications"
            >
              <Bell className="size-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-destructive text-[8px] font-bold text-white items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground">Notifications & Alerts</h4>
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    3 New
                  </Badge>
                </div>
                <div className="mt-3 flex flex-col gap-2.5 text-xs">
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-2.5 hover:bg-muted transition-colors">
                    <p className="font-semibold text-foreground">JAMB Mock 2 Testing Room Open</p>
                    <p className="text-muted-foreground mt-0.5">Biometric verification window is active for SSS 3 candidates.</p>
                    <span className="text-[10px] text-primary font-medium mt-1 inline-block">10 mins ago</span>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-2.5 hover:bg-muted transition-colors">
                    <p className="font-semibold text-foreground">Physics Continuous Assessment Graded</p>
                    <p className="text-muted-foreground mt-0.5">Scored 46/50 (A1). Mr. Balogun left feedback.</p>
                    <span className="text-[10px] text-muted-foreground mt-1 inline-block">Yesterday</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Student Profile Identity Chip */}
          <button
            type="button"
            onClick={() => onTabChange("profile")}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-muted transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="View candidate profile"
          >
            <Avatar size="default" className="border-2 border-primary/20">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground leading-none">
                  {profile.fullName}
                </span>
                <CheckCircle2 className="size-3.5 text-status-success" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground mt-0.5">
                {profile.registrationNumber}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
