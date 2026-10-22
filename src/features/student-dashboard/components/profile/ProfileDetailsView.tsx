import { ShieldCheck, Download, Edit3, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileSummaryCard } from "./ProfileSummaryCard"
import { AcademicRecordCard } from "./AcademicRecordCard"
import { GuardianInfoCard } from "./GuardianInfoCard"
import type { IStudentProfile } from "../../types/student"

interface ProfileDetailsViewProps {
  profile: IStudentProfile
}

export function ProfileDetailsView({ profile }: ProfileDetailsViewProps) {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Candidate Profile & Identity
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your verified institutional registration and CBT candidate dossier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="size-3.5 text-primary" />}
            className="text-xs font-semibold"
          >
            Download Exam Slip
          </Button>
          <Button
            variant="primary"
            size="sm"
            sheen
            leftIcon={<Edit3 className="size-3.5" />}
            className="text-xs font-semibold"
          >
            Edit Bio
          </Button>
        </div>
      </div>

      {/* Main Profile Summary Hero */}
      <ProfileSummaryCard profile={profile} />

      {/* Verification & Biometric Note */}
      <div className="flex items-center gap-3 rounded-2xl border border-status-success/30 bg-status-success/10 p-4 text-xs text-status-success">
        <CheckCircle2 className="size-5 shrink-0 stroke-[2.2]" />
        <div className="flex-1">
          <span className="font-bold">Biometric ID Verification Confirmed: </span>
          <span>
            Candidate photo, fingerprint capture, and school registration are verified for all 2026 WAEC & JAMB CBT sessions.
          </span>
        </div>
        <Badge variant="success" className="shrink-0 text-[10px]">
          Verified
        </Badge>
      </div>

      {/* 2-Column Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AcademicRecordCard profile={profile} />
        <GuardianInfoCard guardian={profile.guardian} />
      </div>

      {/* Bottom Privacy & Integrity Disclaimer */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
        <ShieldCheck className="size-4 text-primary" />
        <span>Secured candidate records registered with National Educational Boards</span>
      </div>
    </div>
  )
}
