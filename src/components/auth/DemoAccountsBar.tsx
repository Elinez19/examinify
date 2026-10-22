import { Sparkles, ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEMO_ACCOUNTS } from "@/services/auth/demoAccounts"
import type { DemoAccount } from "@/types/auth"

interface DemoAccountsBarProps {
  onQuickLogin: (account: DemoAccount) => void
  onFillCredentials: (account: DemoAccount) => void
  disabled?: boolean
  selectedEmail?: string
}

export function DemoAccountsBar({
  onQuickLogin,
  onFillCredentials,
  disabled = false,
  selectedEmail,
}: DemoAccountsBarProps) {
  const studentDemo = DEMO_ACCOUNTS[0]

  if (!studentDemo) return null

  const isSelected = selectedEmail === studentDemo.email

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="size-4 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Student Demo Account
            </span>
            <p className="text-[11px] text-muted-foreground">
              Instant candidate login without registering
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-[10px] font-bold gap-1">
          <CheckCircle2 className="size-3" />
          <span>Active Demo</span>
        </Badge>
      </div>

      {/* Student Profile Snapshot Card */}
      <div
        className={`rounded-xl border p-3.5 space-y-2.5 transition-all duration-200 ${
          isSelected
            ? "border-primary bg-card shadow-sm"
            : "border-border/80 bg-card/80 hover:border-primary/40"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">
                  {studentDemo.name}
                </span>
                <Badge variant="pill" className="text-[10px] px-1.5 py-0.2">
                  SSS 3 STEM
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {studentDemo.email}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {studentDemo.description} • King&apos;s Crest Model College
        </p>

        {/* Buttons Row */}
        <div className="pt-2 border-t border-border/60 flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            sheen
            disabled={disabled}
            onClick={() => onQuickLogin(studentDemo)}
            className="flex-1 h-9 text-xs font-bold"
            rightIcon={<ArrowRight className="size-3.5" />}
          >
            1-Click Student Login
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onFillCredentials(studentDemo)}
            className="h-9 text-xs font-semibold px-3"
          >
            Fill Credentials
          </Button>
        </div>
      </div>
    </div>
  )
}
