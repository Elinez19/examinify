"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  Gift,
  GraduationCap,
  Keyboard,
  LayoutDashboard,
  Lock,
  MonitorCheck,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { OffsetRing } from "@/components/brand/offset-ring";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { SectionHeader, SectionSlab } from "@/components/landing/ui/section-slab";
import { Float } from "@/components/motion/float";
import { Reveal } from "@/components/motion/reveal";
import {
  type FloatingNotificationItem,
  landingContent,
} from "@/content/landing";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type DashboardVariant = "overview" | "invigilation" | "analytics";

const DASHBOARD_TABS: ReadonlyArray<{
  id: DashboardVariant;
  label: string;
  urlPath: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "overview",
    label: "Command Hub",
    urlPath: "cbt.crescentheights.edu/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "invigilation",
    label: "Live Invigilation",
    urlPath: "cbt.crescentheights.edu/invigilate",
    icon: MonitorCheck,
  },
  {
    id: "analytics",
    label: "Scripts & Analytics",
    urlPath: "cbt.crescentheights.edu/analytics",
    icon: BarChart3,
  },
];

function NotificationBanner({ item }: { item: FloatingNotificationItem }) {
  const toneClasses = {
    blue: "cta-surface-primary text-ink-on-blue",
    ink: "bg-brand-950 text-ink-on-blue border-2 border-brand-700 shadow-gloss-float",
    sapphire:
      "bg-brand-800 text-ink-on-blue border-2 border-brand-500 shadow-gloss-float",
  } as const;

  const positionClasses = {
    "top-left": "lg:-left-2 xl:left-0 lg:top-8",
    "bottom-left": "lg:-left-2 xl:left-2 lg:bottom-8",
    "top-right": "lg:-right-2 xl:right-0 lg:top-12",
    "bottom-right": "lg:-right-2 xl:right-2 lg:bottom-6",
  } as const;

  return (
    <Float
      rotateDeg={item.tiltDeg}
      amplitude={7}
      duration={5.2}
      className={cn(
        "relative lg:absolute z-20 w-full lg:w-[255px] xl:w-[290px]",
        positionClasses[item.position]
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-3xl p-3.5 sm:p-4",
          toneClasses[item.tone]
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <OffsetRing size="sm" faceTone="ink" className="shrink-0">
            {item.iconType === "scooter" && <GraduationCap className="h-4 w-4" />}
            {item.iconType === "gift" && <Gift className="h-4 w-4" />}
            {item.iconType === "tag" && <Sparkles className="h-4 w-4" />}
            {item.iconType === "check" && <CheckCircle2 className="h-4 w-4" />}
          </OffsetRing>
          <div className="min-w-0">
            <p className="font-display text-sm sm:text-base font-extrabold leading-tight truncate">
              {item.title}
            </p>
            <p className="mt-0.5 text-xs font-medium text-ink-on-blue-muted truncate">
              {item.subtitle}
            </p>
          </div>
        </div>
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-950/50 text-accent-gold"
          aria-hidden="true"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      </div>
    </Float>
  );
}

function DashboardOverviewBody({ compact }: { compact?: boolean }) {
  return (
    <div className="space-y-3 text-left">
      {/* Top LAN Server Hero Strip */}
      <div className="cta-surface-primary rounded-2xl p-3.5 sm:p-4 text-ink-on-blue">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-gold px-2.5 py-0.5 text-[10px] font-display font-extrabold text-brand-950">
            <Radio className="h-3 w-3" aria-hidden="true" />
            2ND CA &amp; TERMLY CBT LIVE
          </span>
          <span className="inline-flex items-center gap-1 rounded-pill bg-brand-950/55 px-2.5 py-0.5 text-[10px] font-display font-bold text-accent-sky">
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            Offline-Ready · Auto-Sync
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-display text-sm sm:text-base font-extrabold leading-tight">
              Crescent Heights Academy · 1st Term Exam Control
            </p>
            <p className="mt-0.5 text-[11px] text-ink-on-blue-muted">
              Primary 1–6 &amp; JSS 1–SSS 3 · Local save, online sync &amp; instant broadsheets
            </p>
          </div>
          {!compact && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-pill bg-surface-porcelain px-3 py-1 text-[10px] font-display font-extrabold text-brand-700">
              <Server className="h-3 w-3" aria-hidden="true" />
              School-Owned Host
            </span>
          )}
        </div>
      </div>

      {/* 3 KPI Summary Tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-2.5 sm:p-3">
          <p className="text-[10px] font-bold text-ink-secondary truncate">
            Active Candidates
          </p>
          <p className="mt-0.5 font-display text-base sm:text-lg font-extrabold text-brand-950">
            42 / 42
          </p>
          <span className="mt-0.5 inline-block text-[10px] font-extrabold text-accent-success">
            Synced Online
          </span>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-2.5 sm:p-3">
          <p className="text-[10px] font-bold text-ink-secondary truncate">
            Live Papers
          </p>
          <p className="mt-0.5 font-display text-base sm:text-lg font-extrabold text-brand-950">
            6 Classes
          </p>
          <span className="mt-0.5 inline-block text-[10px] font-extrabold text-brand-600">
            JSS 1 – SSS 3
          </span>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-2.5 sm:p-3">
          <p className="text-[10px] font-bold text-ink-secondary truncate">
            Auto-Saved Scripts
          </p>
          <p className="mt-0.5 font-display text-base sm:text-lg font-extrabold text-brand-950">
            1,284
          </p>
          <span className="mt-0.5 inline-block text-[10px] font-extrabold text-accent-warm">
            Power-Cut Safe
          </span>
        </div>
      </div>

      {/* Bottom 2-Column Workspace: Active Assessments + Live Submission Progress */}
      <div className={cn("grid gap-2.5", compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-12")}>
        {/* Active Assessments List */}
        <div
          className={cn(
            "rounded-2xl border border-brand-100 bg-surface-pearl p-3",
            !compact && "sm:col-span-7"
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-display text-xs font-extrabold text-brand-950">
              Active CBT Sessions
            </span>
            <span className="rounded-pill bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              Auto-Graded
            </span>
          </div>
          <div className="space-y-2">
            {landingContent.hero.marqueeCards.slice(0, 2).map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between gap-2.5 rounded-xl border border-surface-frost bg-surface-porcelain p-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-mist">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[11px] font-extrabold text-brand-950 truncate">
                      {card.title}
                    </p>
                    <p className="text-[10px] font-medium text-ink-secondary truncate">
                      {card.provider} · {card.eta}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-pill bg-brand-600 px-2.5 py-1 font-display text-[10px] font-extrabold text-ink-on-blue">
                  Live
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Submission & Security Controls */}
        {!compact && (
          <div className="sm:col-span-5 flex flex-col justify-between rounded-2xl border border-brand-100 bg-surface-pearl p-3">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-xs font-extrabold text-brand-950">
                  Lab Progress
                </span>
                <Lock className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-ink-secondary">
                    <span>JSS 2A Maths</span>
                    <span className="text-brand-700">38 / 42</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-pill bg-brand-100">
                    <div className="h-full w-[90%] rounded-pill bg-brand-600" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-ink-secondary">
                    <span>Primary 5 English</span>
                    <span className="text-brand-700">29 / 34</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-pill bg-brand-100">
                    <div className="h-full w-[85%] rounded-pill bg-accent-success" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-pill bg-brand-950 px-2.5 py-1 text-[9px] font-display font-bold text-accent-sky">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Lockdown ON
              </span>
              <span className="inline-flex items-center gap-1 rounded-pill bg-brand-50 border border-brand-200 px-2.5 py-1 text-[9px] font-display font-bold text-brand-700">
                <Keyboard className="h-3 w-3" aria-hidden="true" />
                Shortcuts
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardInvigilationBody({ compact }: { compact?: boolean }) {
  const rows = [
    {
      name: "Amina Bello · JSS 2A",
      detail: "Q 34/40 · 14m left · Seat 04",
      status: "Active",
      tone: "bg-brand-100 text-brand-700",
    },
    {
      name: "Chidi Okafor · JSS 2A",
      detail: "Resumed after power cut · Saved",
      status: "Resumed",
      tone: "bg-accent-gold/25 text-brand-950",
    },
    {
      name: "Zainab Musa · JSS 2B",
      detail: "Submitted · Auto-graded 37/40",
      status: "Done",
      tone: "bg-accent-success/20 text-brand-950",
    },
  ];

  return (
    <div className="space-y-3 text-left">
      {/* Blue Header Slab */}
      <div className="surface-slab-blue rounded-2xl p-3.5 text-ink-on-blue">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-display text-sm font-extrabold">
              Exam Activation &amp; Seat Monitor
            </p>
            <p className="text-[10px] text-ink-on-blue-muted">
              Browser lockdown, timer sync &amp; offline-ready auto-save
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-pill bg-brand-950/65 px-2.5 py-1 text-[10px] font-display font-extrabold text-accent-gold">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Locked
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-pill bg-surface-porcelain px-2.5 py-0.5 text-[10px] font-extrabold text-brand-700">
            All Arms
          </span>
          <span className="rounded-pill bg-surface-porcelain/15 px-2.5 py-0.5 text-[10px] font-bold text-ink-on-blue">
            1st CA
          </span>
          <span className="rounded-pill bg-surface-porcelain/15 px-2.5 py-0.5 text-[10px] font-bold text-ink-on-blue">
            2nd CA
          </span>
          <span className="rounded-pill bg-surface-porcelain/15 px-2.5 py-0.5 text-[10px] font-bold text-ink-on-blue">
            Term Exam
          </span>
        </div>
      </div>

      {/* Live Student Seat Feed */}
      <div className="space-y-2">
        {(compact ? rows.slice(0, 2) : rows).map((row) => (
          <div
            key={row.name}
            className="flex items-center justify-between gap-2.5 rounded-2xl border border-brand-100 bg-surface-pearl px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 font-display text-[10px] font-extrabold text-ink-on-blue">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xs font-extrabold text-brand-950 truncate">
                  {row.name}
                </p>
                <p className="text-[10px] font-medium text-ink-secondary truncate">
                  {row.detail}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-pill px-2.5 py-0.5 font-display text-[10px] font-extrabold",
                row.tone
              )}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-surface-frost bg-surface-mist px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-ink-secondary">
          <Clock className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          Auto-save every 2s
        </span>
        <div className="flex items-center gap-1.5">
          <span className="rounded-pill bg-surface-porcelain border border-brand-200 px-2.5 py-0.5 text-[10px] font-display font-extrabold text-brand-700">
            +5 Min
          </span>
          <span className="rounded-pill bg-brand-600 px-2.5 py-0.5 text-[10px] font-display font-extrabold text-ink-on-blue">
            Collect All
          </span>
        </div>
      </div>
    </div>
  );
}

function DashboardAnalyticsBody({ compact }: { compact?: boolean }) {
  const bars = [
    { label: "A1–B2", pct: 86, value: "38%", tone: "bg-brand-600" },
    { label: "B3–C4", pct: 68, value: "34%", tone: "bg-accent-sky" },
    { label: "C5–C6", pct: 44, value: "20%", tone: "bg-accent-gold" },
    { label: "D7–F9", pct: 18, value: "8%", tone: "bg-brand-300" },
  ];

  return (
    <div className="space-y-3 text-left">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-brand-100 bg-surface-pearl px-3.5 py-2.5">
        <div>
          <p className="font-display text-xs sm:text-sm font-extrabold text-brand-950">
            Broadsheet &amp; Item Analysis
          </p>
          <p className="text-[10px] font-semibold text-ink-secondary">
            JSS 2A Mathematics · 42 Scripts Graded in 1.2s
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-pill bg-brand-600 px-2.5 py-1 font-display text-[10px] font-extrabold text-ink-on-blue shrink-0">
          <Download className="h-3 w-3" aria-hidden="true" />
          Export XLS
        </span>
      </div>

      {/* Score Distribution Chart */}
      <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-display text-[11px] font-extrabold text-brand-950">
            Grade Band Distribution
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-accent-success">
            <Activity className="h-3 w-3" aria-hidden="true" />
            82.4% Class Avg
          </span>
        </div>
        <div className="grid grid-cols-4 items-end gap-2.5 h-20 pt-2">
          {bars.map((bar) => (
            <div key={bar.label} className="flex h-full flex-col items-center justify-end gap-1">
              <span className="font-display text-[9px] font-extrabold text-brand-950">
                {bar.value}
              </span>
              <div className="flex h-full w-full items-end rounded-lg bg-surface-mist p-0.5">
                <div
                  className={cn("w-full rounded-md", bar.tone)}
                  style={{ height: `${bar.pct}%` }}
                />
              </div>
              <span className="text-[9px] font-bold text-ink-secondary">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Script Inspection Preview */}
      <div className="rounded-2xl border border-brand-100 bg-surface-pearl p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-950 text-accent-gold">
              <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[11px] font-extrabold text-brand-950 truncate">
                {compact ? "Q14 · Quadratic Equations" : "Student Script #04 · Amina Bello"}
              </p>
              <p className="text-[10px] font-medium text-ink-secondary truncate">
                {compact
                  ? "84% Pass Rate · View Scripts"
                  : "Score: 37/40 · CA 1 + CA 2 + Exam Collated"}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-pill bg-brand-50 border border-brand-200 px-2.5 py-0.5 font-display text-[10px] font-extrabold text-brand-700">
            Review
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Coded Desktop / Web Dashboard Showcase Frame for Examinify Offline CBT
 */
export function DashboardScreenMockup({
  variant = "overview",
  interactive = false,
  compact = false,
  className,
}: {
  variant?: DashboardVariant;
  interactive?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [selectedVariant, setSelectedVariant] = React.useState<DashboardVariant>(variant);
  const activeVariant = interactive ? selectedVariant : variant;

  const currentTab =
    DASHBOARD_TABS.find((tab) => tab.id === activeVariant) ?? DASHBOARD_TABS[0];

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-card border-2 border-brand-200 bg-surface-porcelain shadow-gloss-float ring-4 ring-brand-100/70",
        className
      )}
    >
      {/* Top Browser / Desktop App Window Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-frost bg-surface-mist px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-success" />
        </div>

        {/* School-Owned Portal Address Bar */}
        <div className="flex items-center gap-2 rounded-pill border border-brand-200/80 bg-surface-porcelain px-3 py-1 text-[11px] font-mono font-bold text-brand-950">
          <span className="h-2 w-2 rounded-full bg-accent-success" aria-hidden="true" />
          <span className="truncate max-w-[200px] sm:max-w-none">
            https://{currentTab.urlPath}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-pill bg-brand-950 px-2.5 py-1 text-[10px] font-display font-extrabold text-accent-sky">
          <Search className="h-3 w-3" aria-hidden="true" />
          <span>School Owned</span>
        </div>
      </div>

      {/* Main Dashboard Layout: Compact Sidebar Rail + Workspace */}
      <div className={cn("flex", !compact && "flex-col sm:flex-row")}>
        {/* Sidebar / Top Switcher */}
        {!compact && (
          <aside className="flex sm:w-44 shrink-0 sm:flex-col justify-between gap-2 border-b sm:border-b-0 sm:border-r border-surface-frost bg-surface-pearl/90 p-3">
            <div className="flex sm:flex-col gap-1.5 overflow-x-auto no-scrollbar">
              {DASHBOARD_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeVariant === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={!interactive}
                    onClick={interactive ? () => setSelectedVariant(tab.id) : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-2.5 py-2 text-left font-display text-[11px] font-extrabold transition-colors whitespace-nowrap",
                      interactive && "cursor-pointer",
                      isActive
                        ? "bg-brand-600 text-ink-on-blue shadow-sm"
                        : "text-ink-secondary hover:bg-surface-mist hover:text-brand-950"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:block rounded-2xl border border-brand-100 bg-surface-porcelain p-2.5 text-left">
              <p className="font-display text-[10px] font-extrabold text-brand-950">
                System Status
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-accent-success">
                ● Sync + Offline Ready
              </p>
              <p className="mt-1 text-[9px] font-medium text-ink-secondary">
                Tailored &amp; school-owned
              </p>
            </div>
          </aside>
        )}

        {/* Active Dashboard Body */}
        <div className="flex-1 bg-surface-porcelain p-3.5 sm:p-4">
          {activeVariant === "overview" && <DashboardOverviewBody compact={compact} />}
          {activeVariant === "invigilation" && (
            <DashboardInvigilationBody compact={compact} />
          )}
          {activeVariant === "analytics" && (
            <DashboardAnalyticsBody compact={compact} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Section 2: "Offline CBT For Every School" (Pearl Slab with Interactive Dashboard Showcase + 4 Floating Banners + 2 CTAs)
 */
export function DashboardShowcaseSection() {
  const { appShowcase } = landingContent;

  return (
    <SectionSlab id="app-showcase" tone="pearl">
      <SectionHeader
        tone="on-light"
        headline={appShowcase.headline}
        highlightWords={["Every", "School"]}
        subtitle={appShowcase.subtitle}
      />

      {/* Center Interactive Dashboard + 4 Floating Tilted Notification Banners */}
      <div className="relative mx-auto mt-14 flex max-w-6xl flex-col items-center">
        <div className="relative w-full flex flex-col items-center gap-5 lg:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:contents">
            {appShowcase.notifications.map((notif) => (
              <NotificationBanner key={notif.id} item={notif} />
            ))}
          </div>

          <Reveal className="relative z-10 mx-auto w-full max-w-[650px] xl:max-w-[730px]">
            <DashboardScreenMockup variant="overview" interactive />
          </Reveal>
        </div>

        {/* Strictly 2 Consistent CTA Buttons Below Dashboard */}
        <Reveal
          delay={0.2}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <CtaButton variant="primary" size="lg" leadingIcon="apple" href="#download">
            {appShowcase.primaryCta}
          </CtaButton>
          <CtaButton variant="secondary" size="lg" leadingIcon="play" href="#download">
            {appShowcase.secondaryCta}
          </CtaButton>
        </Reveal>

        <Reveal delay={0.28}>
          <p className="mt-5 font-display text-base sm:text-lg font-bold text-brand-600 text-center">
            {appShowcase.promoLine}
          </p>
        </Reveal>
      </div>
    </SectionSlab>
  );
}

/**
 * Section 7: "Everything You Need To Assess Offline" (Cobalt Slab + 3 Fanned Dashboards)
 */
export function FannedDashboardsShowcase() {
  const { everythingYouNeed } = landingContent;

  return (
    <SectionSlab
      id="features"
      tone="blue"
      innerClassName="pb-0 sm:pb-0 overflow-hidden"
    >
      <SectionHeader
        tone="on-blue"
        headline={everythingYouNeed.headline}
        highlightWords={["Own", "Your", "CBT"]}
      />

      {/* Feature Chips */}
      <Reveal
        delay={0.14}
        className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2.5"
      >
        {everythingYouNeed.chips.map((chip) => (
          <PillBadge key={chip} tone="porcelain" icon="shield">
            {chip}
          </PillBadge>
        ))}
      </Reveal>

      {/* Strictly 2 Consistent CTA Buttons */}
      <Reveal
        delay={0.2}
        className="mt-9 flex flex-wrap items-center justify-center gap-4"
      >
        <CtaButton variant="secondary" size="lg" leadingIcon="apple" href="#download">
          {everythingYouNeed.primaryCta}
        </CtaButton>
        <CtaButton variant="primary" size="lg" leadingIcon="play" href="#download">
          {everythingYouNeed.secondaryCta}
        </CtaButton>
      </Reveal>

      <Reveal delay={0.25} className="text-center">
        <p className="mt-4 font-display text-base sm:text-lg font-bold text-accent-sky">
          {everythingYouNeed.promoLine}
        </p>
      </Reveal>

      {/* 3 Fanned Dashboards Rising from Bottom */}
      <div className="relative mx-auto mt-12 flex max-w-6xl items-end justify-center pt-6">
        {/* Left Tilted Invigilation Dashboard */}
        <motion.div
          initial={{ rotate: 0, y: 80, opacity: 0 }}
          whileInView={{ rotate: -6, y: 40, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.outExpo,
          }}
          className="hidden lg:block w-[360px] xl:w-[400px] -mr-20 z-10 shrink-0"
        >
          <DashboardScreenMockup variant="invigilation" compact />
        </motion.div>

        {/* Center Front Flagship Command Dashboard */}
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          whileInView={{ y: 12, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: motionTokens.duration.slow,
            delay: 0.08,
            ease: motionTokens.ease.outExpo,
          }}
          className="relative z-20 w-full max-w-[650px]"
        >
          <DashboardScreenMockup variant="overview" interactive />
        </motion.div>

        {/* Right Tilted Analytics & Script Review Dashboard */}
        <motion.div
          initial={{ rotate: 0, y: 80, opacity: 0 }}
          whileInView={{ rotate: 6, y: 40, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: motionTokens.duration.slow,
            delay: 0.14,
            ease: motionTokens.ease.outExpo,
          }}
          className="hidden lg:block w-[360px] xl:w-[400px] -ml-20 z-10 shrink-0"
        >
          <DashboardScreenMockup variant="analytics" compact />
        </motion.div>
      </div>
    </SectionSlab>
  );
}

