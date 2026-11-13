"use client";

import * as React from "react";
import { CreditCard, Lock, TrendingUp } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { formatCurrency } from "@/lib/utils";

export interface PaymentsKpiSummaryProps {
  totalVolume: number;
  heldVolume: number;
  totalFee: number;
  totalTransactionsCount: number;
}

export function PaymentsKpiSummary({
  totalVolume,
  heldVolume,
  totalFee,
  totalTransactionsCount,
}: PaymentsKpiSummaryProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StaggerItem>
        <AdminKpiCard
          label="Total License Billing"
          value={formatCurrency(totalVolume)}
          badgeText={`${totalTransactionsCount} recorded invoices`}
          badgeTone="porcelain"
          badgeIcon="dot"
          ringTone="blue"
          icon={<CreditCard className="h-4 w-4 text-ink-on-blue" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Pending Settlement"
          value={formatCurrency(heldVolume)}
          badgeText="Awaiting bursar confirmation"
          badgeTone="sky"
          badgeIcon="shield"
          ringTone="ink"
          icon={<Lock className="h-4 w-4 text-accent-gold" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Hosting & Support Reserve (10%)"
          value={formatCurrency(totalFee)}
          badgeText="90% allocated to school deployment"
          badgeTone="blue"
          badgeIcon="shield"
          ringTone="ink"
          tone="ink"
          icon={<TrendingUp className="h-4 w-4 text-accent-sky" />}
        />
      </StaggerItem>
    </Stagger>
  );
}

