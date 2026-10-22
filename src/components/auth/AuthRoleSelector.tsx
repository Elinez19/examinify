import { GraduationCap, BookOpenCheck, School } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"

interface AuthRoleSelectorProps {
  value: UserRole
  onChange: (role: UserRole) => void
  disabled?: boolean
}

export function AuthRoleSelector({
  value,
  onChange,
  disabled = false,
}: AuthRoleSelectorProps) {
  const roles: Array<{
    id: UserRole
    label: string
    caption: string
    icon: typeof GraduationCap
  }> = [
    {
      id: "student",
      label: "Candidate",
      caption: "Take exams & practice CBT",
      icon: GraduationCap,
    },
    {
      id: "examiner",
      label: "Examiner",
      caption: "Author questions & grades",
      icon: BookOpenCheck,
    },
    {
      id: "school_admin",
      label: "School Admin",
      caption: "Manage centers & rosters",
      icon: School,
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Select Account Role
      </span>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = value === role.id
          return (
            <button
              key={role.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(role.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer relative",
                isSelected
                  ? "border-primary bg-accent/40 text-primary shadow-xs ring-1 ring-primary/40 font-semibold"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg mb-1.5 transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-4.5" />
              </div>
              <span className="text-xs font-bold leading-tight block text-foreground">
                {role.label}
              </span>
              <span className="text-[10px] leading-tight text-muted-foreground line-clamp-1 mt-0.5">
                {role.caption}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
