"use client";

import * as React from "react";
import { CheckCircle2, ShieldCheck, UserCheck, Users } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export interface ArtisansKpiSummaryProps {
  counts: {
    all: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  customersCount?: number;
  adminsCount?: number;
}

export function ArtisansKpiSummary({
  counts,
  customersCount = 0,
  adminsCount = 0,
}: ArtisansKpiSummaryProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
      <StaggerItem>
        <AdminKpiCard
          label="Registered Teachers"
          value={`${counts.all} Teachers`}
          badgeText={`${counts.verified} verified · ${counts.pending} pending review`}
          badgeTone="sky"
          badgeIcon="pin"
          ringTone="blue"
          icon={<Users className="h-4 w-4 text-ink-on-blue" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Enrolled Students"
          value={`${customersCount} Students`}
          badgeText="Primary 1–6 & JSS 1–SSS 3 candidates"
          badgeTone="porcelain"
          badgeIcon="dot"
          ringTone="ink"
          icon={<UserCheck className="h-4 w-4 text-accent-success" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="School Administrators"
          value={`${adminsCount} Admins`}
          badgeText="Exam officers, verifiers & CBT staff"
          badgeTone="blue"
          badgeIcon="shield"
          ringTone="ink"
          tone="ink"
          icon={<ShieldCheck className="h-4 w-4 text-accent-gold" />}
        />
      </StaggerItem>
    </Stagger>
  );
}
