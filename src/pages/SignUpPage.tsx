import { AuthPage } from "./AuthPage"

interface SignUpPageProps {
  onNavigateHome?: () => void
  onNavigateDashboard?: () => void
}

export function SignUpPage({ onNavigateHome, onNavigateDashboard }: SignUpPageProps) {
  return (
    <AuthPage
      initialMode="signup"
      onNavigateHome={onNavigateHome}
      onNavigateDashboard={onNavigateDashboard}
    />
  )
}
