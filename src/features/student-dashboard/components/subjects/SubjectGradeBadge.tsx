import { Badge } from "@/components/ui/badge"

interface SubjectGradeBadgeProps {
  grade: string
  percentage?: number
}

export function SubjectGradeBadge({ grade, percentage }: SubjectGradeBadgeProps) {
  const getVariant = () => {
    if (grade.startsWith("A")) return "success"
    if (grade.startsWith("B")) return "default"
    if (grade.startsWith("C")) return "warning"
    return "destructive"
  }

  return (
    <Badge variant={getVariant()} className="font-bold text-xs px-2 py-0.5">
      {grade} {percentage !== undefined && `(${percentage}%)`}
    </Badge>
  )
}
