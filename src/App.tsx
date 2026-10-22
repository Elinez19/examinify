import * as React from "react"
import { HomePage } from "@/pages/HomePage"
import { AuthPage } from "@/pages/AuthPage"
import { StudentDashboardPage } from "@/pages/StudentDashboardPage"
import { CbtExamPage } from "@/pages/CbtExamPage"
import { TeacherDashboardPage } from "@/pages/TeacherDashboardPage"
import type { AuthMode } from "@/types/auth"

type AppView = "home" | AuthMode | "dashboard" | "cbt" | "teacher"

export function App() {
  const getInitialView = (): AppView => {
    const rawHash = window.location.hash.replace(/^#\/?/, "").toLowerCase()
    if (rawHash === "signin" || rawHash === "signup" || rawHash === "forgot-password") {
      return rawHash as AuthMode
    }
    if (rawHash.startsWith("cbt")) {
      return "cbt"
    }
    if (rawHash.startsWith("teacher")) {
      return "teacher"
    }
    if (
      rawHash === "dashboard" ||
      rawHash === "portal" ||
      rawHash === "demo" ||
      rawHash.startsWith("dashboard") ||
      rawHash.startsWith("portal") ||
      rawHash.startsWith("demo") ||
      rawHash.startsWith("student")
    ) {
      return "dashboard"
    }
    return "home"
  }

  const getInitialCbtSessionId = (): string => {
    const rawHash = window.location.hash.replace(/^#\/?/, "")
    if (rawHash.startsWith("cbt/")) {
      const parts = rawHash.split("/")
      if (parts[1]) return parts[1]
    }
    return "exm-term2-day1"
  }

  const [currentView, setCurrentView] = React.useState<AppView>(getInitialView)
  const [cbtSessionId, setCbtSessionId] = React.useState<string>(getInitialCbtSessionId)

  // Listen to hash changes for browser back/forward buttons
  React.useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "").toLowerCase()
      if (rawHash === "signin" || rawHash === "signup" || rawHash === "forgot-password") {
        setCurrentView(rawHash as AuthMode)
      } else if (rawHash.startsWith("cbt")) {
        const parts = window.location.hash.replace(/^#\/?/, "").split("/")
        if (parts[1]) {
          setCbtSessionId(parts[1])
        }
        setCurrentView("cbt")
      } else if (rawHash.startsWith("teacher")) {
        setCurrentView("teacher")
      } else if (
        rawHash === "dashboard" ||
        rawHash === "portal" ||
        rawHash === "demo" ||
        rawHash.startsWith("dashboard") ||
        rawHash.startsWith("portal") ||
        rawHash.startsWith("demo") ||
        rawHash.startsWith("student")
      ) {
        setCurrentView("dashboard")
      } else if (!rawHash || rawHash === "" || rawHash === "home") {
        setCurrentView("home")
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const navigateToAuth = (mode: "signin" | "signup" | "forgot-password") => {
    window.location.hash = mode
    setCurrentView(mode)
  }

  const navigateToDashboard = React.useCallback(() => {
    window.location.hash = "dashboard"
    setCurrentView("dashboard")
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const navigateToTeacher = React.useCallback(() => {
    window.location.hash = "teacher"
    setCurrentView("teacher")
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const navigateToCbt = React.useCallback((sessionId = "exm-term2-day1") => {
    window.location.hash = `cbt/${sessionId}`
    setCbtSessionId(sessionId)
    setCurrentView("cbt")
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const navigateToHome = () => {
    window.location.hash = ""
    setCurrentView("home")
  }

  if (currentView === "teacher") {
    return (
      <TeacherDashboardPage
        onNavigateHome={navigateToHome}
        onLogOut={() => navigateToAuth("signin")}
      />
    )
  }

  if (currentView === "cbt") {
    return (
      <CbtExamPage
        sessionId={cbtSessionId}
        onReturnToDashboard={navigateToDashboard}
      />
    )
  }

  if (currentView === "dashboard") {
    return (
      <StudentDashboardPage
        onNavigateHome={navigateToHome}
        onLogOut={() => navigateToAuth("signin")}
        onStartExam={(examId) => navigateToCbt(examId)}
      />
    )
  }

  if (currentView !== "home") {
    return (
      <AuthPage
        initialMode={currentView}
        onNavigateHome={navigateToHome}
        onNavigateDashboard={navigateToDashboard}
        onNavigateTeacher={navigateToTeacher}
      />
    )
  }

  return (
    <HomePage
      onNavigateAuth={navigateToAuth}
      onNavigateDashboard={navigateToDashboard}
      onNavigateTeacher={navigateToTeacher}
    />
  )
}

export default App
