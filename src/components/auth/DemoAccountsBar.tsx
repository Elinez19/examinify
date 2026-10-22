import * as React from "react"
import { Sparkles, ArrowRight, GraduationCap, School, CheckCircle2 } from "lucide-react"
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
  const [selectedIdx, setSelectedIdx] = React.useState<number>(() => {
    if (selectedEmail) {
      const foundIdx = DEMO_ACCOUNTS.findIndex((a) => a.email === selectedEmail)
      if (foundIdx !== -1) return foundIdx
    }
    return 0
  })
  const activeAccount = DEMO_ACCOUNTS[selectedIdx] || DEMO_ACCOUNTS[0]

  if (!activeAccount) return null

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
              Multi-Role Demo Accounts
            </span>
            <p className="text-[11px] text-muted-foreground">
              Instant login for Student Candidate or School Teachers
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-[10px] font-bold gap-1">
          <CheckCircle2 className="size-3" />
          <span>Active Demos</span>
        </Badge>
      </div>

      {/* Role Picker Pills */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/40 border border-border">
        {DEMO_ACCOUNTS.map((acc, idx) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all truncate cursor-pointer ${
              selectedIdx === idx
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {acc.label}
          </button>
        ))}
      </div>

      {/* Account Profile Snapshot Card */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 space-y-2.5 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              {activeAccount.role === "student" ? (
                <GraduationCap className="size-5" />
              ) : (
                <School className="size-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">
                  {activeAccount.name}
                </span>
                <Badge variant="pill" className="text-[10px] px-1.5 py-0.2">
                  {activeAccount.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {activeAccount.email}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {activeAccount.description}
        </p>

        {/* Buttons Row */}
        <div className="pt-2 border-t border-border/60 flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            sheen
            disabled={disabled}
            onClick={() => onQuickLogin(activeAccount)}
            className="flex-1 h-9 text-xs font-bold"
            rightIcon={<ArrowRight className="size-3.5" />}
          >
            1-Click {activeAccount.label} Login
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onFillCredentials(activeAccount)}
            className="h-9 text-xs font-semibold px-3"
          >
            Fill
          </Button>
        </div>
      </div>
    </div>
  )
}
