"use client";

import { Lock, Settings, Users } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export interface SettingsKpiSummaryProps {
  artisanSharePercent: string;
  platformFeePercent: string;
  dispatchRadiusKm: string;
  disputeWindowHours: string;
}

export function SettingsKpiSummary({
  artisanSharePercent,
  platformFeePercent,
  dispatchRadiusKm,
  disputeWindowHours,
}: SettingsKpiSummaryProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StaggerItem>
        <AdminKpiCard
          label="License & Platform Split"
          value={`${artisanSharePercent}% / ${platformFeePercent}%`}
          badgeText="School partner vs Platform license fee"
          badgeTone="porcelain"
          badgeIcon="dot"
          ringTone="blue"
          icon={<Lock className="h-4 w-4 text-ink-on-blue" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Offline Auto-Save Cadence"
          value={`${dispatchRadiusKm} sec`}
          badgeText="IndexedDB script & server sync interval"
          badgeTone="sky"
          badgeIcon="pin"
          ringTone="ink"
          icon={<Settings className="h-4 w-4 text-accent-gold" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Lockdown & Appeal SLA"
          value={`${disputeWindowHours}h Window`}
          badgeText="Mandatory verification & script protection"
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

