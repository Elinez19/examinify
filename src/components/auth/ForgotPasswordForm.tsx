import * as React from "react"
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { ForgotPasswordFormData, AuthErrors } from "../types/auth"

interface ForgotPasswordFormProps {
  data: ForgotPasswordFormData
  errors: AuthErrors
  isSubmitting: boolean
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
  onBackToSignIn: () => void
}

export function ForgotPasswordForm({
  data,
  errors,
  isSubmitting,
  onEmailChange,
  onSubmit,
  onBackToSignIn,
}: ForgotPasswordFormProps) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Icon Badge */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
          <KeyRound className="size-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Forgot your password?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          No worries. Enter your registered candidate or examiner email and we&apos;ll send you an encrypted recovery link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col space-y-4" noValidate>
        <FormItem error={!!errors.email}>
          <FormLabel htmlFor="forgot-email" required error={!!errors.email}>
            Registered Email Address
          </FormLabel>
          <FormControl error={!!errors.email}>
            <Input
              id="forgot-email"
              type="email"
              value={data.email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="candidate@school.edu.ng"
              error={!!errors.email}
              disabled={isSubmitting}
              autoComplete="email"
              leftIcon={<Mail className="size-4 text-muted-foreground" />}
            />
          </FormControl>
          {errors.email && <FormMessage>{errors.email}</FormMessage>}
        </FormItem>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            sheen
            disabled={isSubmitting}
            className="w-full h-11.5 text-base font-semibold"
            rightIcon={<ArrowRight className="size-4" />}
          >
            {isSubmitting ? "Sending Recovery Link..." : "Send Reset Link"}
          </Button>
        </div>
      </form>

      {/* Back to Sign In Action */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to sign in</span>
        </button>
      </div>
    </div>
  )
}
