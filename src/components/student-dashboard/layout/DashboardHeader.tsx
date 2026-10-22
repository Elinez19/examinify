import * as React from "react"
import {
  Bell,
  Search,
  Menu,
  Home,
  CheckCircle2,
  Sparkles,
  LogOut,
  User,
  FileText,
  BookOpen,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { IStudentProfile, DashboardTab } from "@/types/student"

interface DashboardHeaderProps {
  profile: IStudentProfile
  unreadNotificationsCount: number
  onMarkNotificationsRead: () => void
  onNavigateHome?: () => void
  onLogOut?: () => void
  onTabChange: (tab: DashboardTab) => void
  onOpenMobileMenu: () => void
}

export function DashboardHeader({
  profile,
  unreadNotificationsCount,
  onMarkNotificationsRead,
  onNavigateHome,
  onLogOut,
  onTabChange,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false)

  const profileRef = React.useRef<HTMLDivElement>(null)
  const notifRef = React.useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const handleLogOut = () => {
    setShowProfileDropdown(false)
    if (onLogOut) {
      onLogOut()
    } else if (onNavigateHome) {
      onNavigateHome()
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Menu Button & Brand Class Pill */}
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
            <span className="text-xs font-semibold text-muted-foreground">Class:</span>
            <Badge variant="pill" className="px-2.5 py-0.5 text-xs font-bold gap-1.5">
              <span className="size-2 rounded-full bg-status-success animate-pulse" />
              <span>{profile.enrolledClass?.name || profile.gradeLevel}</span>
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

        {/* Right Side: Actions, Notifications & Profile Avatar with Log Out */}
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
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown)
                setShowProfileDropdown(false)
                if (unreadNotificationsCount > 0) {
                  onMarkNotificationsRead()
                }
              }}
              className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
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
                    2 New
                  </Badge>
                </div>
                <div className="mt-3 flex flex-col gap-2.5 text-xs">
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-2.5 hover:bg-muted transition-colors">
                    <p className="font-semibold text-foreground">Day 1 Mid-Term CBT Active</p>
                    <p className="text-muted-foreground mt-0.5">Mathematics (09:00 AM) and English (11:30 AM) sittings open today.</p>
                    <span className="text-[10px] text-primary font-medium mt-1 inline-block">Today</span>
                  </div>
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-2.5 hover:bg-muted transition-colors">
                    <p className="font-semibold text-foreground">Physics Constant Sheet Pinned</p>
                    <p className="text-muted-foreground mt-0.5">Mr. Balogun uploaded formula revision for Day 2.</p>
                    <span className="text-[10px] text-muted-foreground mt-1 inline-block">Yesterday</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Student Profile Identity Chip with Log Out Action */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
                setShowNotificationsDropdown(false)
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label="Student profile menu"
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

              <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
            </button>

            {/* Profile Dropdown Popover with Log Out */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
                {/* Candidate Overview */}
                <div className="p-3 border-b border-border space-y-1">
                  <div className="font-bold text-foreground text-sm">
                    {profile.fullName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Reg: {profile.registrationNumber}
                  </div>
                  <div className="pt-1">
                    <Badge variant="pill" className="text-[10px] font-semibold">
                      {profile.enrolledClass?.name || profile.gradeLevel}
                    </Badge>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange("profile")
                      setShowProfileDropdown(false)
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                  >
                    <User className="size-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onTabChange("exams")
                      setShowProfileDropdown(false)
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer text-left"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                    <span>Exams & Schedule</span>
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
                    <span>Subjects Table</span>
                  </button>
                </div>

                {/* Log Out Action */}
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
      </div>
    </header>
  )
}
