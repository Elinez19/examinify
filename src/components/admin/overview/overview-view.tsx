"use client";

import { CalendarCheck, Users } from "lucide-react";
import { AdminHeroBanner, AdminWorkspaceSlab } from "@/components/admin/ui/admin-hero-banner";
import { OffsetRing } from "@/components/brand/offset-ring";
import { RoadDispatchStrip } from "@/components/landing/composites/exam-marquee-card";
import { Float } from "@/components/motion/float";
import { useOverviewDashboard } from "@/hooks/admin/use-overview-dashboard";
import { OverviewKpiSummary } from "./overview-kpi-summary";
import { OverviewRecentBookingsTable } from "./overview-recent-exams-table";
import { OverviewPendingKycQueue } from "./overview-pending-verification-queue";
import { OverviewCategoriesPreview } from "./overview-subjects-preview";
import type { OverviewDashboardProps } from "./types";

export function OverviewWorkspace({
  artisans,
  bookings: initialBookings,
  payments,
  categories,
}: OverviewDashboardProps) {
  const {
    bookings,
    selectedIds,
    pendingKycArtisans,
    kpis,
    updateBookingStatus,
    markSelectedCompleted,
    removeSelectedBookings,
    clearSelection,
    toggleSelectAllVisible,
    toggleSelectOne,
  } = useOverviewDashboard({
    artisans,
    initialBookings,
    payments,
    categories,
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. Hero Banner Slab with hero-bg.jpg + OffsetRing Cluster + Strictly 2 CTAs */}
      <AdminHeroBanner
        eyebrow="Examinify Control Center"
        eyebrowIcon="dot"
        headline="Examinify CBT Operations Desk"
        highlightWords={["Examinify", "CBT"]}
        subtitle="Manage students, teachers, and school administrators, coordinate offline-ready CBT exams and sittings, oversee curriculum subjects and feedback, and resolve appeals and support tickets."
        primaryCta={{
          label: "Manage Users",
          href: "/admin/user-management",
          variant: "primary",
          icon: <Users className="h-3.5 w-3.5" />,
          trailingArrow: true,
        }}
        secondaryCta={{
          label: "Exams & Sittings",
          href: "/admin/exams",
          variant: "secondary",
          icon: <CalendarCheck className="h-3.5 w-3.5" />,
        }}
        rightSlot={
          <div className="hidden xl:flex items-center gap-3.5 pr-1">
            <Float amplitude={5} duration={4.8}>
              <OffsetRing
                size="md"
                faceTone="ink"
                className="h-20 w-20 text-xs"
              >
                <div className="space-y-0.5 leading-tight">
                  <span className="block text-accent-sky text-lg font-extrabold">
                    {kpis.verifiedArtisansCount}
                  </span>
                  <span className="block text-[9px] font-bold text-ink-on-blue-muted">
                    Verified Staff
                  </span>
                </div>
              </OffsetRing>
            </Float>
            <Float amplitude={6} duration={5.4} delay={0.3}>
              <OffsetRing
                size="sm"
                faceTone="porcelain"
                className="h-15 w-15 text-[10px]"
              >
                <div className="space-y-0.5 leading-tight">
                  <span className="block text-brand-700 text-xs font-extrabold">
                    90/10
                  </span>
                  <span className="block text-[8px] font-bold text-ink-secondary">
                    License Split
                  </span>
                </div>
              </OffsetRing>
            </Float>
          </div>
        }
      />

      {/* 2. KPI Cards & Operations Tables inside Pearl Workspace Slab */}
      <AdminWorkspaceSlab tone="pearl" withPearlAsset>
        <OverviewKpiSummary kpis={kpis} />

        {/* Main Operations Grid: Recent Service Bookings + Pending KYC Desk */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left 7/8 Cols: Recent Bookings Table */}
          <div className="lg:col-span-7 xl:col-span-8 min-w-0">
            <OverviewRecentBookingsTable
              bookings={bookings}
              selectedIds={selectedIds}
              onToggleSelectAll={toggleSelectAllVisible}
              onToggleSelectOne={toggleSelectOne}
              onClearSelection={clearSelection}
              onMarkSelectedCompleted={markSelectedCompleted}
              onRemoveSelected={removeSelectedBookings}
              onUpdateBookingStatus={updateBookingStatus}
            />
          </div>

          {/* Right 5/4 Cols: Pending KYC Queue & Verification Checklist */}
          <div className="lg:col-span-5 xl:col-span-4 min-w-0">
            <OverviewPendingKycQueue pendingKycArtisans={pendingKycArtisans} />
          </div>
        </div>

        {/* Bottom Taxonomy Strip with 3D Service Artwork Assets */}
        <OverviewCategoriesPreview categories={categories} />

        {/* Signature Road Dispatch Strip at Bottom */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <RoadDispatchStrip />
        </div>
      </AdminWorkspaceSlab>
    </div>
  );
}

