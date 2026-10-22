import { CheckCircle2, Mail, Phone, MapPin, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { IStudentProfile } from "@/types/student"

interface ProfileSummaryCardProps {
  profile: IStudentProfile
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Card glossy className="relative overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Avatar & Core Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar size="xl" className="border-4 border-primary/20 shadow-lg">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {profile.fullName}
                </h2>
                <Badge variant="pill" className="text-xs font-semibold gap-1.5">
                  <CheckCircle2 className="size-3.5 text-status-success" />
                  <span>Verified Candidate</span>
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <span>Registration No: {profile.registrationNumber}</span>
                <span>•</span>
                <span className="text-muted-foreground">{profile.gradeLevel}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" />
                  {profile.phone}
                </span>
                {profile.institutionBranch && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    {profile.institutionBranch}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Readiness Score Visual Box */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col items-center justify-center shrink-0 min-w-36 text-center">
            <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>CBT Readiness</span>
            </div>
            <div className="mt-1 text-4xl font-extrabold text-foreground">
              {profile.readinessScore}%
            </div>
            <span className="mt-1 text-[11px] font-medium text-status-success">
              {profile.academicStanding}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
