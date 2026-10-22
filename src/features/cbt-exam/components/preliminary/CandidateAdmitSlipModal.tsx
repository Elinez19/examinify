import {
  GraduationCap,
  Monitor,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { ICbtCandidateInfo, ICbtSubject } from "../../types/cbt"

interface CandidateAdmitSlipModalProps {
  candidate: ICbtCandidateInfo
  subjects: ICbtSubject[]
  durationMinutes: number
  onProceed: () => void
  onCancel?: () => void
}

export function CandidateAdmitSlipModal({
  candidate,
  subjects,
  durationMinutes,
  onProceed,
  onCancel,
}: CandidateAdmitSlipModalProps) {
  return (
    <Card className="max-w-2xl w-full border-border bg-card shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
      {/* Official Header Strip */}
      <div className="bg-primary/10 border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              National Examination Verification & Admit Slip
            </h3>
            <p className="text-xs text-muted-foreground">
              Official Candidate Identity & Seat Allocation Record
            </p>
          </div>
        </div>
        <Badge variant="pill" className="text-xs font-semibold px-3 py-1">
          {candidate.terminalId}
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Candidate Bio-Data Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-muted/40 border border-border">
          {candidate.avatarUrl ? (
            <img
              src={candidate.avatarUrl}
              alt={candidate.fullName}
              className="size-24 rounded-2xl object-cover border-2 border-primary/20 shadow-xs shrink-0"
            />
          ) : (
            <div className="size-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="size-10" />
            </div>
          )}

          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <Badge variant="default" className="text-[11px] font-bold">
                {candidate.registrationNumber}
              </Badge>
              <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30">
                {candidate.seatNumber}
              </Badge>
            </div>

            <h2 className="text-lg font-bold text-foreground">
              {candidate.fullName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <GraduationCap className="size-3.5 text-primary" />
                <span>{candidate.department}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Building2 className="size-3.5 text-primary" />
                <span className="truncate">{candidate.institution}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start sm:col-span-2">
                <Monitor className="size-3.5 text-primary" />
                <span className="truncate">{candidate.examCenter}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Subjects for This Sitting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Registered Subjects in This CBT Sitting ({subjects.length} Subjects)
            </h4>
            <span className="text-xs font-semibold text-primary">
              Allocated Time: {durationMinutes} Minutes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {subjects.map((sub, idx) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/80 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    0{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{sub.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{sub.code}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {sub.totalQuestions} Questions
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Check Alert */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-status-success/10 border border-status-success/20 text-xs text-foreground">
          <CheckCircle2 className="size-4 text-status-success shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Candidate Verification Notice:</strong> By clicking proceed, you confirm that your identity, photograph, registration number, and subject combinations are accurate.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          {onCancel ? (
            <Button
              variant="outline"
              size="default"
              onClick={onCancel}
              className="w-full sm:w-auto text-xs font-semibold"
            >
              Cancel & Return
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="primary"
            size="default"
            sheen
            onClick={onProceed}
            rightIcon={<ArrowRight className="size-4" />}
            className="w-full sm:w-auto text-xs font-bold"
          >
            Confirm Details & View Regulations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
