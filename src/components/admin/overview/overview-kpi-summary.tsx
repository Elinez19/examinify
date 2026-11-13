"use client";

import { CalendarCheck, Lock, TrendingUp, Users } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { formatCurrency } from "@/lib/utils";
import type { OverviewKpiData } from "./types";

export interface OverviewKpiSummaryProps {
  kpis: OverviewKpiData;
}

export function OverviewKpiSummary({ kpis }: OverviewKpiSummaryProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      <StaggerItem>
        <AdminKpiCard
          label="Gross Term Billing"
          value={formatCurrency(kpis.totalGmv)}
          badgeText={`${formatCurrency(kpis.totalCommission)} platform license fee (10%)`}
          badgeTone="porcelain"
          badgeIcon="dot"
          ringTone="blue"
          icon={<TrendingUp className="h-4 w-4 text-ink-on-blue" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Term Fees Pending Sync"
          value={formatCurrency(kpis.escrowHeldAmount)}
          badgeText="Awaiting exam term clearance & sign-off"
          badgeTone="sky"
          badgeIcon="shield"
          ringTone="ink"
          icon={<Lock className="h-4 w-4 text-accent-gold" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Total Exam Sessions"
          value={`${kpis.totalBookingsCount}`}
          numericValue={kpis.totalBookingsCount}
          badgeText={`Across ${kpis.categoriesCount} curriculum subjects`}
          badgeTone="sky"
          badgeIcon="pin"
          ringTone="porcelain"
          icon={<CalendarCheck className="h-4 w-4 text-brand-600" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Teachers & Staff Checks"
          value={`${kpis.verifiedArtisansCount} Verified`}
          badgeText={`${kpis.pendingKycArtisansCount} teachers pending verification`}
          badgeTone="blue"
          badgeIcon="shield"
          ringTone="ink"
          tone="ink"
          icon={<Users className="h-4 w-4 text-accent-sky" />}
        />
      </StaggerItem>
    </Stagger>
  );
}

