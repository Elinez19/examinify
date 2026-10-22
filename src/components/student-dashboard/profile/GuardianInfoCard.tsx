import { Users, Phone, Mail, MapPin, Shield } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { IStudentGuardian } from "../../types/student"

interface GuardianInfoCardProps {
  guardian: IStudentGuardian
}

export function GuardianInfoCard({ guardian }: GuardianInfoCardProps) {
  return (
    <Card glossy>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-status-info/10 text-status-info">
            <Users className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Guardian & Emergency Information</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified parent or primary academic sponsor
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" />
              Guardian Name & Relationship
            </span>
            <p className="font-bold text-foreground text-sm">
              {guardian.fullName}
            </p>
            <p className="text-muted-foreground">
              {guardian.relationship}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="size-3.5 text-primary" />
              Direct Emergency Phone
            </span>
            <p className="font-bold text-foreground text-sm">
              {guardian.phone}
            </p>
            <p className="text-muted-foreground">
              SMS exam notification enabled
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" />
              Guardian Email Address
            </span>
            <p className="font-bold text-foreground text-sm">
              {guardian.email}
            </p>
            <p className="text-muted-foreground">
              Receives bi-weekly gradebook digest
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              Residential Address
            </span>
            <p className="font-bold text-foreground text-sm">
              {guardian.address}
            </p>
            <p className="text-muted-foreground">
              Lagos State, Nigeria
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
