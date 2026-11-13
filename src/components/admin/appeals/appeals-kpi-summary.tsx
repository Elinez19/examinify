"use client";

import { Lock, Scale, ShieldCheck } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { formatCurrency } from "@/lib/utils";

export interface DisputesKpiSummaryProps {
  openCount: number;
  frozenEscrow: number;
  resolvedCount: number;
}

export function DisputesKpiSummary({
  openCount,
  frozenEscrow,
  resolvedCount,
}: DisputesKpiSummaryProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StaggerItem>
        <AdminKpiCard
          label="Active Result Appeals"
          value={`${openCount}`}
          numericValue={openCount}
          badgeText="Awaiting teacher or officer review"
          badgeTone="porcelain"
          badgeIcon="dot"
          ringTone="blue"
          icon={<Scale className="h-4 w-4 text-ink-on-blue" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Paused Term Assessments"
          value={formatCurrency(frozenEscrow)}
          badgeText="Held safely during script remark"
          badgeTone="sky"
          badgeIcon="shield"
          ringTone="ink"
          icon={<Lock className="h-4 w-4 text-accent-gold" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Resolved Appeals"
          value={`${resolvedCount}`}
          numericValue={resolvedCount}
          badgeText="100% script review compliance"
          badgeTone="blue"
          badgeIcon="shield"
          ringTone="ink"
          tone="ink"
          icon={<ShieldCheck className="h-4 w-4 text-accent-sky" />}
        />
      </StaggerItem>
    </Stagger>
  );
}

