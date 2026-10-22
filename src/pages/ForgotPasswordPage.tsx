import { AuthPage } from "./AuthPage"

interface ForgotPasswordPageProps {
  onNavigateHome?: () => void
}

export function ForgotPasswordPage({ onNavigateHome }: ForgotPasswordPageProps) {
  return <AuthPage initialMode="forgot-password" onNavigateHome={onNavigateHome} />
}
