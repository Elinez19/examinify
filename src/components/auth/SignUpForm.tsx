import * as React from "react"
import { Mail, User, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { GoogleOAuthButton } from "./GoogleOAuthButton"
import { OAuthDivider } from "./OAuthDivider"
import { PasswordInputField } from "./PasswordInputField"
import type { SignUpFormData, AuthErrors } from "@/types/auth"

interface SignUpFormProps {
  data: SignUpFormData
  errors: AuthErrors
  isSubmitting: boolean
  isGoogleLoading: boolean
  onFieldChange: <K extends keyof SignUpFormData>(field: K, value: SignUpFormData[K]) => void
  onSubmit: (e: React.FormEvent) => void
  onGoogleAuth: () => void
  onSignInClick: () => void
}

export function SignUpForm({
  data,
  errors,
  isSubmitting,
  isGoogleLoading,
  onFieldChange,
  onSubmit,
  onGoogleAuth,
  onSignInClick,
}: SignUpFormProps) {
  return (
    <div className="flex flex-col space-y-5">
      {/* Form Header */}
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Badge variant="pill" className="text-xs font-semibold gap-1.5 px-2.5 py-0.5">
            <GraduationCap className="size-3.5 text-primary" />
            <span>Candidate Registration</span>
          </Badge>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create Student Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Register to access your student dashboard, courses, and CBT examinations
        </p>
      </div>

      {/* Google OAuth Option */}
      <div className="flex flex-col gap-2 pt-1">
        <GoogleOAuthButton
          label="Sign up as Student with Google"
          isLoading={isGoogleLoading}
          onClick={onGoogleAuth}
          disabled={isSubmitting}
        />
        <OAuthDivider label="Or register with email" />
      </div>

      {/* Primary Credentials Form */}
      <form onSubmit={onSubmit} className="flex flex-col space-y-3.5" noValidate>
        {/* Full Legal Name */}
        <FormItem error={!!errors.fullName}>
          <FormLabel htmlFor="signup-name" required error={!!errors.fullName}>
            Full Legal Name
          </FormLabel>
          <FormControl error={!!errors.fullName}>
            <Input
              id="signup-name"
              type="text"
              value={data.fullName}
              onChange={(e) => onFieldChange("fullName", e.target.value)}
              placeholder="e.g. Amina Adeleke"
              error={!!errors.fullName}
              disabled={isSubmitting || isGoogleLoading}
              autoComplete="name"
              leftIcon={<User className="size-4 text-muted-foreground" />}
            />
          </FormControl>
          {errors.fullName && <FormMessage>{errors.fullName}</FormMessage>}
        </FormItem>

        {/* Email Address */}
        <FormItem error={!!errors.email}>
          <FormLabel htmlFor="signup-email" required error={!!errors.email}>
            Email Address
          </FormLabel>
          <FormControl error={!!errors.email}>
            <Input
              id="signup-email"
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

        {/* Password with Strength Meter */}
        <PasswordInputField
          id="signup-password"
          label="Password (min. 8 characters)"
          value={data.password}
          onChange={(val) => onFieldChange("password", val)}
          error={errors.password}
          required
          showStrengthMeter
          autoComplete="new-password"
          disabled={isSubmitting || isGoogleLoading}
        />

        {/* Confirm Password */}
        <PasswordInputField
          id="signup-confirm-password"
          label="Confirm Password"
          value={data.confirmPassword}
          onChange={(val) => onFieldChange("confirmPassword", val)}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={isSubmitting || isGoogleLoading}
        />

        {/* Terms Agreement Checkbox */}
        <div className="flex flex-col gap-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <Checkbox
              checked={data.agreeTerms}
              onCheckedChange={(checked) =>
                onFieldChange("agreeTerms", Boolean(checked))
              }
              disabled={isSubmitting || isGoogleLoading}
              className="mt-0.5"
            />
            <span className="text-xs text-muted-foreground leading-snug">
              I certify that my details are accurate and agree to the{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                Terms of Examination
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                Anti-Malpractice Policy
              </a>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <FormMessage className="ml-7">{errors.agreeTerms}</FormMessage>
          )}
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
            {isSubmitting ? "Creating Student Account..." : "Create Student Account"}
          </Button>
        </div>
      </form>

      {/* Switch to Sign In */}
      <div className="pt-2 text-center text-sm text-muted-foreground">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSignInClick}
          className="font-bold text-primary hover:underline hover:text-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
        >
          Sign in here
        </button>
      </div>

      {/* Verification footer note */}
      <div className="pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-status-success shrink-0" />
        <span>Instant candidate matriculation & biometric authentication ready</span>
      </div>
    </div>
  )
}
