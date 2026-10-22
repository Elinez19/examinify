import { useAuthFlow } from "@/features/auth/hooks/useAuthFlow"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { SignInForm } from "@/features/auth/components/SignInForm"
import { SignUpForm } from "@/features/auth/components/SignUpForm"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"
import { ResetSuccessView } from "@/features/auth/components/ResetSuccessView"
import type { AuthMode } from "@/features/auth/types/auth"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

interface AuthPageProps {
  initialMode?: AuthMode
  onNavigateHome?: () => void
  onNavigateDashboard?: () => void
}

export function AuthPage({
  initialMode = "signin",
  onNavigateHome,
  onNavigateDashboard,
}: AuthPageProps) {
  const {
    mode,
    switchMode,
    isSubmitting,
    isGoogleLoading,
    feedbackMessage,
    errors,
    resendCooldown,
    signInData,
    updateSignInField,
    handleSignInSubmit,
    handleDemoLogin,
    handleFillDemoCredentials,
    signUpData,
    updateSignUpField,
    handleSignUpSubmit,
    forgotPasswordData,
    updateForgotPasswordEmail,
    handleForgotPasswordSubmit,
    handleResendResetEmail,
    handleGoogleAuth,
  } = useAuthFlow({
    initialMode,
    onSuccess: () => {
      onNavigateDashboard?.()
    },
  })

  return (
    <AuthLayout
      currentMode={mode}
      onModeChange={(newMode) => switchMode(newMode)}
      onBackToHome={onNavigateHome}
    >
      {/* Dynamic Feedback Banner */}
      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-4 flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium animate-in fade-in duration-200 ${
            feedbackMessage.type === "success"
              ? "bg-status-success/10 border-status-success/30 text-status-success"
              : feedbackMessage.type === "error"
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : "bg-status-info/10 border-status-info/30 text-status-info"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 stroke-[2.5] mt-0.5" />
          ) : feedbackMessage.type === "error" ? (
            <AlertCircle className="size-4 shrink-0 stroke-[2.5] mt-0.5" />
          ) : (
            <Info className="size-4 shrink-0 stroke-[2.5] mt-0.5" />
          )}
          <span className="leading-relaxed">{feedbackMessage.text}</span>
        </div>
      )}

      {/* View Switcher */}
      {mode === "signin" && (
        <SignInForm
          data={signInData}
          errors={errors}
          isSubmitting={isSubmitting}
          isGoogleLoading={isGoogleLoading}
          onFieldChange={updateSignInField}
          onSubmit={handleSignInSubmit}
          onGoogleAuth={handleGoogleAuth}
          onQuickDemoLogin={handleDemoLogin}
          onFillDemoCredentials={handleFillDemoCredentials}
          onForgotPasswordClick={() => switchMode("forgot-password")}
          onSignUpClick={() => switchMode("signup")}
        />
      )}

      {mode === "signup" && (
        <SignUpForm
          data={signUpData}
          errors={errors}
          isSubmitting={isSubmitting}
          isGoogleLoading={isGoogleLoading}
          onFieldChange={updateSignUpField}
          onSubmit={handleSignUpSubmit}
          onGoogleAuth={handleGoogleAuth}
          onSignInClick={() => switchMode("signin")}
        />
      )}

      {mode === "forgot-password" && (
        <ForgotPasswordForm
          data={forgotPasswordData}
          errors={errors}
          isSubmitting={isSubmitting}
          onEmailChange={updateForgotPasswordEmail}
          onSubmit={handleForgotPasswordSubmit}
          onBackToSignIn={() => switchMode("signin")}
        />
      )}

      {mode === "reset-success" && (
        <ResetSuccessView
          email={forgotPasswordData.email}
          resendCooldown={resendCooldown}
          isSubmitting={isSubmitting}
          onResend={handleResendResetEmail}
          onBackToSignIn={() => switchMode("signin")}
        />
      )}
    </AuthLayout>
  )
}
