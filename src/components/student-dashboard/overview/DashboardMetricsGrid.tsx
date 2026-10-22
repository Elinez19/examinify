import { Sparkles, CheckCircle2, BookOpen, Clock } from "lucide-react"
import { DashboardMetricCard } from "./DashboardMetricCard"
import type { IDashboardMetric } from "../../types/student"

interface DashboardMetricsGridProps {
  metrics: IDashboardMetric[]
}

export function DashboardMetricsGrid({ metrics }: DashboardMetricsGridProps) {
  const getIconForIndex = (index: number) => {
    switch (index) {
      case 0:
        return <Sparkles className="size-4.5" />
      case 1:
        return <CheckCircle2 className="size-4.5" />
      case 2:
        return <BookOpen className="size-4.5" />
      case 3:
        return <Clock className="size-4.5" />
      default:
        return <Sparkles className="size-4.5" />
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <DashboardMetricCard
          key={metric.id}
          metric={metric}
          icon={getIconForIndex(idx)}
        />
      ))}
    </div>
  )
}
