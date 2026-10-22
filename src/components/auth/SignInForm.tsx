import * as React from "react"
import { Mail, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { GoogleOAuthButton } from "./GoogleOAuthButton"
import { OAuthDivider } from "./OAuthDivider"
import { PasswordInputField } from "./PasswordInputField"
import { DemoAccountsBar } from "./DemoAccountsBar"
import type { SignInFormData, AuthErrors, DemoAccount } from "@/types/auth"

interface SignInFormProps {
  data: SignInFormData
  errors: AuthErrors
  isSubmitting: boolean
  isGoogleLoading: boolean
  onFieldChange: <K extends keyof SignInFormData>(field: K, value: SignInFormData[K]) => void
  onSubmit: (e: React.FormEvent) => void
  onGoogleAuth: () => void
  onForgotPasswordClick: () => void
  onSignUpClick: () => void
  onQuickDemoLogin?: (account: DemoAccount) => void
  onFillDemoCredentials?: (account: DemoAccount) => void
}

export function SignInForm({
  data,
  errors,
  isSubmitting,
  isGoogleLoading,
  onFieldChange,
  onSubmit,
  onGoogleAuth,
  onForgotPasswordClick,
  onSignUpClick,
  onQuickDemoLogin,
  onFillDemoCredentials,
}: SignInFormProps) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Form Header */}
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Student Candidate Sign In
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to access your student dashboard, subjects, and CBT exams
        </p>
      </div>

      {/* 1-Click Demo Accounts Bar */}
      {onQuickDemoLogin && onFillDemoCredentials && (
        <DemoAccountsBar
          onQuickLogin={onQuickDemoLogin}
          onFillCredentials={onFillDemoCredentials}
          disabled={isSubmitting || isGoogleLoading}
          selectedEmail={data.email}
        />
      )}

      {/* Google OAuth Option */}
      <div className="flex flex-col gap-2">
        <GoogleOAuthButton
          label="Sign in as Student with Google"
          isLoading={isGoogleLoading}
          onClick={onGoogleAuth}
          disabled={isSubmitting}
        />
        <OAuthDivider label="Or continue with email" />
      </div>

      {/* Primary Credentials Form */}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4" noValidate>
        {/* Email Address */}
        <FormItem error={!!errors.email}>
          <FormLabel htmlFor="signin-email" required error={!!errors.email}>
            Email Address
          </FormLabel>
          <FormControl error={!!errors.email}>
            <Input
              id="signin-email"
              type="email"
              value={data.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="candidate@school.edu.ng"
              error={!!errors.email}
              disabled={isSubmitting || isGoogleLoading}
              autoComplete="email"
              leftIcon={<Mail className="size-4 text-muted-foreground" />}
            />
          </FormControl>
          {errors.email && <FormMessage>{errors.email}</FormMessage>}
        </FormItem>

        {/* Password */}
        <PasswordInputField
          id="signin-password"
          label="Password"
          value={data.password}
          onChange={(val) => onFieldChange("password", val)}
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isSubmitting || isGoogleLoading}
        />

        {/* Options Row: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={data.rememberMe}
              onCheckedChange={(checked) =>
                onFieldChange("rememberMe", Boolean(checked))
              }
              disabled={isSubmitting || isGoogleLoading}
            />
            <span className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Remember this device
            </span>
          </label>

          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="text-xs font-semibold text-primary hover:underline hover:text-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            sheen
            disabled={isSubmitting || isGoogleLoading}
            className="w-full h-11.5 text-base font-semibold"
            rightIcon={<ArrowRight className="size-4" />}
          >
            {isSubmitting ? "Authenticating..." : "Sign in to Student Dashboard"}
          </Button>
        </div>
      </form>

      {/* Switch to Sign Up */}
      <div className="pt-2 text-center text-sm text-muted-foreground">
        <span>Don&apos;t have an account? </span>
        <button
          type="button"
          onClick={onSignUpClick}
          className="font-bold text-primary hover:underline hover:text-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
        >
          Create student account
        </button>
      </div>

      {/* Security badge footer note */}
      <div className="pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-status-success shrink-0" />
        <span>Secured by 256-bit encryption & anti-malpractice tokens</span>
      </div>
    </div>
  )
}
