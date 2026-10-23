import * as React from "react"
import {
  Menu,
  LogOut,
  Home,
  User,
  Users,
  BookOpen,
  FileCheck2,
  Settings,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { ITeacherProfile, TeacherDashboardTab } from "@/types/teacher"

interface TeacherDashboardHeaderProps {
  profile: ITeacherProfile
  onOpenMobileSidebar: () => void
  onNavigateHome?: () => void
  onLogOut?: () => void
  onTabChange?: (tab: TeacherDashboardTab) => void
  onOpenAiCreation?: () => void
}

export function TeacherDashboardHeader({
  profile,
  onOpenMobileSidebar,
  onNavigateHome,
  onLogOut,
  onTabChange,
  onOpenAiCreation,
}: TeacherDashboardHeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false)
  const profileRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Extract clean uppercase initials
  const initials = React.useMemo(() => {
    const clean = profile.fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s*/i, "").trim()
    const parts = clean.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return clean.slice(0, 2).toUpperCase() || "EN"
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Sidebar Trigger & Brand Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted md:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="size-5" />
        </button>

        {/* Brand Logo (Matching ACADAI styling in reference images) */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="size-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-foreground">
              Examinify
            </span>
          </div>
        </div>
      </div>

      {/* Right: Teacher Profile Avatar Menu Chip (No Credit pill badge, pure minimalist) */}
      <div className="flex items-center gap-3">
        {/* AI Creation Action Chip (Matching Acad AI styling in reference image) */}
        {onOpenAiCreation && (
          <button
            type="button"
            onClick={onOpenAiCreation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 transition-all cursor-pointer shadow-2xs"
            title="Generate Questions with Acad AI"
          >
            <Sparkles className="size-3.5 fill-current" />
            <span>AI Creation</span>
            <ChevronDown className="size-3 stroke-[2.5] opacity-75" />
          </button>
        )}

        {onNavigateHome && (
          <button
            type="button"
            onClick={onNavigateHome}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </button>
        )}

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 rounded-2xl p-1.5 hover:bg-muted/60 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer group"
            aria-label="Teacher profile menu"
            aria-expanded={showProfileDropdown}
          >
            {/* Teacher Details */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {profile.fullName}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground leading-tight mt-0.5">
                Teacher
              </span>
            </div>

            {/* Avatar with subtle red status dot as in reference image */}
            <div className="relative">
              <Avatar size="sm" className="size-9.5 border-2 border-primary/20 shadow-xs">
                <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-destructive border-2 border-card" />
            </div>

            <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block group-hover:text-foreground transition-colors" />
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              {/* Header inside popover */}
              <div className="p-3 border-b border-border space-y-1">
                <div className="font-bold text-foreground text-sm truncate">
                  {profile.fullName}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono truncate">
                  {profile.staffId}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {profile.email}
                </div>
              </div>

              {/* Navigation items */}
              <div className="py-1.5 space-y-0.5">
                {onTabChange && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("overview")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <User className="size-4 text-muted-foreground" />
                      <span>Overview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("students")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <Users className="size-4 text-muted-foreground" />
                      <span>Students</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("subjects")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <BookOpen className="size-4 text-muted-foreground" />
                      <span>Subjects</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("exams")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <FileCheck2 className="size-4 text-muted-foreground" />
                      <span>Exams</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange("settings")
                        setShowProfileDropdown(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      <span>Settings</span>
                    </button>
                  </>
                )}
              </div>

              {/* Log Out */}
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
      </div>
    </header>
  )
}
