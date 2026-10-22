import * as React from "react"
import {
  Menu,
  School,
  LogOut,
  Home,
  CheckCircle2,
  ChevronDown,
  User,
  Users,
  FileCheck2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { ITeacherProfile, TeacherDashboardTab, TeacherSchoolLevel } from "@/types/teacher"

interface TeacherDashboardHeaderProps {
  profile: ITeacherProfile
  teacherLevel: TeacherSchoolLevel
  onSwitchTeacherLevel: (level: TeacherSchoolLevel) => void
  onOpenMobileSidebar: () => void
  onNavigateHome?: () => void
  onLogOut?: () => void
  onTabChange?: (tab: TeacherDashboardTab) => void
}

export function TeacherDashboardHeader({
  profile,
  teacherLevel,
  onSwitchTeacherLevel,
  onOpenMobileSidebar,
  onNavigateHome,
  onLogOut,
  onTabChange,
}: TeacherDashboardHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false)
  const profileRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Extract clean 2-letter uppercase initials ignoring common honorifics
  const initials = React.useMemo(() => {
    const clean = profile.fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Engr\.|Barr\.)\s*/i, "").trim()
    const parts = clean.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return clean.slice(0, 2).toUpperCase() || "TC"
  }, [profile.fullName])

  const handleLogOut = () => {
    setShowProfileDropdown(false)
    if (onLogOut) {
      onLogOut()
    } else if (onNavigateHome) {
      onNavigateHome()
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <Badge
            variant={teacherLevel === "secondary" ? "primary" : "default"}
            className="text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wide gap-1"
          >
            <School className="size-3" />
            <span>{teacherLevel === "secondary" ? "Secondary School" : "Primary School"}</span>
          </Badge>
          <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
            {profile.branchName}
          </span>
        </div>
      </div>

      {/* Right: Switch Demo Account + Home + Teacher Profile Avatar + Log Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Instant Multi-School Demo Switcher */}
        <div className="flex items-center rounded-xl border border-border bg-muted/40 p-0.5 sm:p-1">
          <button
            type="button"
            onClick={() => onSwitchTeacherLevel("secondary")}
            className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
              teacherLevel === "secondary"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Switch to Secondary School (Mr. Babatunde Adeleke)"
          >
            <span className="hidden md:inline">Secondary (Mr. Babatunde)</span>
            <span className="md:hidden">Secondary</span>
          </button>
          <button
            type="button"
            onClick={() => onSwitchTeacherLevel("primary")}
            className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all cursor-pointer ${
              teacherLevel === "primary"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Switch to Primary School (Mrs. Folake Oladele)"
          >
            <span className="hidden md:inline">Primary (Mrs. Folake)</span>
            <span className="md:hidden">Primary</span>
          </button>
        </div>

        {/* Home Link */}
        {onNavigateHome && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onNavigateHome}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground hidden lg:flex"
            leftIcon={<Home className="size-3.5" />}
          >
            Home
          </Button>
        )}

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Teacher Profile Avatar Menu Chip */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 rounded-xl p-1 sm:p-1.5 hover:bg-muted transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label="Teacher profile menu"
            aria-expanded={showProfileDropdown}
          >
            <Avatar size="sm" className="size-9 border-2 border-primary/25 shadow-xs">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px] md:max-w-[160px]">
                  {profile.fullName}
                </span>
                <CheckCircle2 className="size-3.5 text-status-success shrink-0" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground leading-tight mt-0.5 truncate max-w-[120px] md:max-w-[160px]">
                {profile.staffId}
              </span>
            </div>

            <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
              {/* Profile Card Header */}
              <div className="p-3 border-b border-border space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar size="default" className="size-11 border-2 border-primary/25">
                    <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-foreground text-sm truncate">
                      {profile.fullName}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate font-mono">
                      {profile.staffId}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Badge variant="pill" className="text-[10px] font-semibold text-primary">
                    {profile.assignedClassRole || (teacherLevel === "secondary" ? "Secondary Teacher" : "Primary Teacher")}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {profile.branchName}
                  </span>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="py-1.5 space-y-0.5">
                {onTabChange && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("profile")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <User className="size-4 text-muted-foreground" />
                      <span>Profile & Timetable</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("classes")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <Users className="size-4 text-muted-foreground" />
                      <span>Assigned Classes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("assessments")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <FileCheck2 className="size-4 text-muted-foreground" />
                      <span>CBT & Assessments</span>
                    </button>
                  </>
                )}
              </div>

              {/* Log Out inside dropdown */}
              <div className="pt-1.5 border-t border-border">
                <button
                  type="button"
                  onClick={handleLogOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="size-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Top-Level Log Out Button */}
        {onLogOut && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLogOut}
            className="text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
            leftIcon={<LogOut className="size-3.5" />}
          >
            <span>Log Out</span>
          </Button>
        )}
      </div>
    </header>
  )
}
