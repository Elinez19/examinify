import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResetSuccessViewProps {
  email: string
  resendCooldown: number
  isSubmitting: boolean
  onResend: () => void
  onBackToSignIn: () => void
}

export function ResetSuccessView({
  email,
  resendCooldown,
  isSubmitting,
  onResend,
  onBackToSignIn,
}: ResetSuccessViewProps) {
  return (
    <div className="flex flex-col space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Success Icon */}
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-status-success/15 text-status-success shadow-xs">
        <MailCheck className="size-8 stroke-[2.2]" />
      </div>

      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Check your email
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          We sent a password reset link to{" "}
          <span className="font-semibold text-foreground break-all">{email}</span>.
          Follow the instructions in the email to access your account.
        </p>
      </div>

      {/* Helpful Box */}
      <div className="rounded-xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground text-left">
        <p className="font-medium text-foreground mb-1">Didn&apos;t receive the email?</p>
        <p>Check your spam or junk folder, or verify that the email address was entered correctly.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onResend}
          disabled={resendCooldown > 0 || isSubmitting}
          className="w-full h-11 text-sm font-semibold"
          leftIcon={<RefreshCw className={`size-4 ${isSubmitting ? "animate-spin" : ""}`} />}
        >
          {resendCooldown > 0
            ? `Resend email in ${resendCooldown}s`
            : isSubmitting
            ? "Sending..."
            : "Resend reset email"}
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          sheen
          onClick={onBackToSignIn}
          className="w-full h-11 text-sm font-semibold"
          leftIcon={<ArrowLeft className="size-4" />}
        >
          Return to sign in
        </Button>
      </div>
    </div>
  )
}
