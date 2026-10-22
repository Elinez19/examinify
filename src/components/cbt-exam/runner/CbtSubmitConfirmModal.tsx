import * as React from "react"
import { SendHorizontal, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubjectStat {
  subjectId: string
  subjectName: string
  totalQuestions: number
  answeredCount: number
  unansweredCount: number
  flaggedCount: number
}

interface CbtSubmitConfirmModalProps {
  isOpen: boolean
  subjectStats: SubjectStat[]
  onConfirmSubmit: () => void
  onClose: () => void
}

export function CbtSubmitConfirmModal({
  isOpen,
  subjectStats,
  onConfirmSubmit,
  onClose,
}: CbtSubmitConfirmModalProps) {
  const [hasConfirmed, setHasConfirmed] = React.useState(false)

  if (!isOpen) return null

  const totalQuestions = subjectStats.reduce((acc, s) => acc + s.totalQuestions, 0)
  const totalAnswered = subjectStats.reduce((acc, s) => acc + s.answeredCount, 0)
  const totalUnanswered = totalQuestions - totalAnswered
  const totalFlagged = subjectStats.reduce((acc, s) => acc + s.flaggedCount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div className="max-w-xl w-full bg-card rounded-3xl border border-border shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <SendHorizontal className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Final Examination Submission
              </h3>
              <p className="text-xs text-muted-foreground">
                Review your completion status across all subjects
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Multi-Subject Breakdown Table */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            Subject Performance Summary
          </span>

          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[11px] text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Answered</th>
                  <th className="p-3 text-center">Unanswered</th>
                  <th className="p-3 text-center">Flagged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {subjectStats.map((stat) => (
                  <tr key={stat.subjectId} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground">{stat.subjectName}</td>
                    <td className="p-3 text-center font-mono">{stat.totalQuestions}</td>
                    <td className="p-3 text-center font-mono text-status-success font-bold">
                      {stat.answeredCount}
                    </td>
                    <td className="p-3 text-center font-mono text-muted-foreground">
                      {stat.unansweredCount}
                    </td>
                    <td className="p-3 text-center font-mono text-status-warning font-bold">
                      {stat.flaggedCount}
                    </td>
                  </tr>
                ))}
                {/* Aggregate Row */}
                <tr className="bg-muted/40 font-bold border-t-2 border-border">
                  <td className="p-3 text-foreground">Combined Total</td>
                  <td className="p-3 text-center font-mono">{totalQuestions}</td>
                  <td className="p-3 text-center font-mono text-status-success">
                    {totalAnswered} ({Math.round((totalAnswered / Math.max(1, totalQuestions)) * 100)}%)
                  </td>
                  <td className="p-3 text-center font-mono text-muted-foreground">
                    {totalUnanswered}
                  </td>
                  <td className="p-3 text-center font-mono text-status-warning">
                    {totalFlagged}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Unanswered Questions Warning Banner */}
        {totalUnanswered > 0 && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-status-warning/10 border border-status-warning/30 text-xs">
            <AlertCircle className="size-4 text-status-warning shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed">
              <strong>Notice:</strong> You still have <strong>{totalUnanswered} unanswered question{totalUnanswered > 1 ? "s" : ""}</strong>. Remember there is no negative marking, so it is advantageous to attempt every question.
            </p>
          </div>
        )}

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
          <input
            type="checkbox"
            checked={hasConfirmed}
            onChange={(e) => setHasConfirmed(e.target.checked)}
            className="mt-0.5 size-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
          />
          <span className="text-xs text-foreground font-medium select-none">
            I confirm that I have reviewed my answers across all registered subjects and am ready to conclude this CBT session.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="default"
            onClick={onClose}
            className="text-xs font-semibold"
          >
            Return to Questions
          </Button>

          <Button
            variant="primary"
            size="default"
            sheen={hasConfirmed}
            disabled={!hasConfirmed}
            onClick={onConfirmSubmit}
            rightIcon={<SendHorizontal className="size-4" />}
            className="text-xs font-bold"
          >
            Finalize & Submit Examination
          </Button>
        </div>
      </div>
    </div>
  )
}
