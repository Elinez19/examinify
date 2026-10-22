import { AuthPage } from "./AuthPage"

interface SignInPageProps {
  onNavigateHome?: () => void
  onNavigateDashboard?: () => void
}

export function SignInPage({ onNavigateHome, onNavigateDashboard }: SignInPageProps) {
  return (
    <AuthPage
      initialMode="signin"
      onNavigateHome={onNavigateHome}
      onNavigateDashboard={onNavigateDashboard}
    />
  )
}
