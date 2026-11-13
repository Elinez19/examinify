"use client";

import { ShieldCheck, Star, ThumbsUp } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/ui/admin-kpi-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export interface ReviewsKpiSummaryProps {
  avgRating: string;
  verifiedCount: number;
}

export function ReviewsKpiSummary({
  avgRating,
  verifiedCount,
}: ReviewsKpiSummaryProps) {
  return (
    <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StaggerItem>
        <AdminKpiCard
          label="Exam Experience Rating"
          value={`${avgRating} / 5.0`}
          badgeText="Across submitted CBT sessions"
          badgeTone="porcelain"
          badgeIcon="dot"
          ringTone="blue"
          icon={<Star className="h-4 w-4 text-accent-gold" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Verified Feedback Items"
          value={`${verifiedCount}`}
          numericValue={verifiedCount}
          badgeText="Approved by exam officers"
          badgeTone="sky"
          badgeIcon="shield"
          ringTone="ink"
          icon={<ShieldCheck className="h-4 w-4 text-accent-success" />}
        />
      </StaggerItem>

      <StaggerItem>
        <AdminKpiCard
          label="Candidate Satisfaction"
          value="98.4%"
          badgeText="Smooth offline CBT completion rate"
          badgeTone="blue"
          badgeIcon="shield"
          ringTone="ink"
          tone="ink"
          icon={<ThumbsUp className="h-4 w-4 text-accent-sky" />}
        />
      </StaggerItem>
    </Stagger>
  );
}

