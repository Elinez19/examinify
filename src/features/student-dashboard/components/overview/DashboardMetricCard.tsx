import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { IDashboardMetric } from "../../types/student"

interface DashboardMetricCardProps {
  metric: IDashboardMetric
  icon?: React.ReactNode
}

export function DashboardMetricCard({ metric, icon }: DashboardMetricCardProps) {
  const getStatusBg = () => {
    switch (metric.statusColor) {
      case "success":
        return "bg-status-success/10 text-status-success border-status-success/20"
      case "warning":
        return "bg-status-warning/10 text-status-warning border-status-warning/20"
      case "info":
        return "bg-status-info/10 text-status-info border-status-info/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  return (
    <Card glossy className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {metric.title}
          </span>
          {icon && (
            <div className={cn("flex size-9 items-center justify-center rounded-xl border", getStatusBg())}>
              {icon}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {metric.value}
          </span>
          {metric.unit && (
            <span className="text-xs font-semibold text-muted-foreground">
              {metric.unit}
            </span>
          )}
        </div>

        {/* Trend & Context */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {metric.trend.direction === "up" && (
            <span className="flex items-center text-status-success font-semibold">
              <ArrowUpRight className="size-3.5" />
              {metric.trend.text}
            </span>
          )}
          {metric.trend.direction === "down" && (
            <span className="flex items-center text-destructive font-semibold">
              <ArrowDownRight className="size-3.5" />
              {metric.trend.text}
            </span>
          )}
          {metric.trend.direction === "neutral" && (
            <span className="flex items-center text-muted-foreground font-medium">
              <Minus className="size-3.5" />
              {metric.trend.text}
            </span>
          )}
        </div>

        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
          {metric.description}
        </p>
      </CardContent>
    </Card>
  )
}
