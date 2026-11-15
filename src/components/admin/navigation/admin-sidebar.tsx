"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Lock,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { OffsetRing } from "@/components/brand/offset-ring";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { CtaButton } from "@/components/landing/ui/cta-button";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { useAdminLogout } from "@/hooks/admin/use-admin-logout";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  ADMIN_NAV_ITEMS,
  isAdminLinkActive,
  isAdminSubLinkActive,
} from "./constants";
import { NavIcon } from "./nav-icon";
import type { AdminSidebarProps } from "./types";

export function AdminSidebar({
  pathname,
  onNavigate,
  adminName,
  adminRoleTitle,
}: AdminSidebarProps) {
  const { isLoggingOut, handleLogout } = useAdminLogout({
    onBeforeRedirect: onNavigate,
  });

  // Track manual expand/collapse overrides; active parent menu opens automatically
  const [groupOverrides, setGroupOverrides] = React.useState<
    Record<string, boolean>
  >({});

  const hasActiveChildGroup = ADMIN_NAV_ITEMS.some(
    (item) =>
      Boolean(item.children?.length) &&
      isAdminLinkActive(pathname, item.href, item.children)
  );

  const isGroupExpanded = (label: string, active: boolean) => {
    const override = groupOverrides[label];
    if (override !== undefined) return override;
    if (active) return true;
    return !hasActiveChildGroup && label === "Academic";
  };

  const toggleGroup = (label: string, currentlyExpanded: boolean) => {
    setGroupOverrides((prev) => ({
      ...prev,
      [label]: !currentlyExpanded,
    }));
  };

  return (
    <div className="surface-sidebar-gloss-white no-scrollbar relative flex h-full w-full flex-col justify-between overflow-y-auto border-r-2 border-brand-100 px-3.5 py-3.5 text-ink-primary">
      {/* Top Specular Gloss Sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[image:var(--gloss-sheen-blue)] opacity-45"
      />
      <ToolPattern tone="on-light" />

      {/* Top Brand Identity & Menu / Submenu Navigation */}
      <div className="relative z-10 space-y-3">
        {/* Brand Logo + Console Pill */}
        <div className="flex items-center justify-between gap-2 border-b border-brand-100/80 px-1 pb-1.5">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="group focus:outline-none"
          >
            <BrandLogo tone="on-light" size="sm" />
          </Link>
          <PillBadge
            tone="sky"
            icon="dot"
            className="px-2.5 py-0.5 text-[10px]"
          >
            Admin
          </PillBadge>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-2.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-brand-600">
            Menu
          </p>

          <nav aria-label="Admin Sidebar" className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const active = isAdminLinkActive(
                pathname,
                item.href,
                item.children
              );
              const isExpanded = isGroupExpanded(item.label, active);

              if (hasChildren && item.children) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.label, isExpanded)}
                      aria-expanded={isExpanded}
                      className={cn(
                        "group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                        active
                          ? "bg-brand-50 text-brand-800 border border-brand-200/80"
                          : "text-brand-950 hover:bg-brand-50/90 hover:text-brand-700"
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors",
                          active
                            ? "border-brand-300 bg-surface-porcelain text-brand-600 shadow-gloss-card"
                            : "border-brand-100 bg-surface-pearl text-brand-600 shadow-gloss-card group-hover:border-brand-200 group-hover:bg-surface-porcelain"
                        )}
                      >
                        <NavIcon type={item.icon} className="h-3.5 w-3.5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-xs font-extrabold leading-tight">
                          {item.label}
                        </p>
                      </div>

                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 text-brand-500 transition-transform duration-200",
                          isExpanded ? "rotate-0" : "-rotate-90"
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: motionTokens.duration.fast }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 space-y-0.5 border-l-2 border-brand-100 pl-2.5 py-0.5">
                            {item.children.map((sub) => {
                              const subActive = isAdminSubLinkActive(
                                pathname,
                                sub.href
                              );
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={onNavigate}
                                  className={cn(
                                    "group relative isolate flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                                    subActive
                                      ? "text-ink-on-blue"
                                      : "text-brand-900 hover:bg-brand-50/90 hover:text-brand-700"
                                  )}
                                >
                                  {subActive && (
                                    <motion.span
                                      layoutId="admin-sidebar-active-pill"
                                      transition={motionTokens.spring.snappy}
                                      className="cta-surface-primary absolute inset-0 -z-10 rounded-xl"
                                      aria-hidden="true"
                                    />
                                  )}

                                  <NavIcon
                                    type={sub.icon}
                                    className={cn(
                                      "h-3.5 w-3.5 shrink-0 transition-colors",
                                      subActive
                                        ? "text-accent-gold"
                                        : "text-brand-500 group-hover:text-brand-700"
                                    )}
                                  />

                                  <span className="min-w-0 flex-1 truncate font-display text-[11px] font-extrabold leading-tight">
                                    {sub.label}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative isolate flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                    active
                      ? "text-ink-on-blue"
                      : "text-brand-950 hover:bg-brand-50/90 hover:text-brand-700"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-sidebar-active-pill"
                      transition={motionTokens.spring.snappy}
                      className="cta-surface-primary absolute inset-0 -z-10 rounded-xl"
                      aria-hidden="true"
                    />
                  )}

                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors",
                      active
                        ? "border-surface-porcelain bg-surface-porcelain text-brand-600 shadow-gloss-card"
                        : "border-brand-100 bg-surface-pearl text-brand-600 shadow-gloss-card group-hover:border-brand-200 group-hover:bg-surface-porcelain"
                    )}
                  >
                    <NavIcon type={item.icon} className="h-3.5 w-3.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate font-display text-xs font-extrabold leading-tight",
                        active
                          ? "text-ink-on-blue"
                          : "text-brand-950 group-hover:text-brand-700"
                      )}
                    >
                      {item.label}
                    </p>
                  </div>

                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                      active
                        ? "translate-x-0.5 text-accent-gold"
                        : "text-brand-300 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Operations Status & Auth Actions */}
      <div className="relative z-10 mt-2 space-y-2 border-t border-brand-100 pt-2.5">
        {/* Glossy Operations Status Card */}
        <div className="space-y-1.5 rounded-2xl border-2 border-brand-100 bg-surface-pearl/90 p-2.5 shadow-gloss-card">
          <div className="flex items-center gap-2">
            <OffsetRing size="xs" faceTone="blue" className="h-7 w-7 shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-gold" />
            </OffsetRing>
            <div className="min-w-0">
              <p className="truncate font-display text-[11px] font-extrabold leading-tight text-brand-950">
                {adminName || "Admin Portal Active"}
              </p>
              <p className="truncate text-[10px] font-semibold leading-tight text-brand-600">
                {adminRoleTitle || "Students · Teachers · Admins"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-pill border border-brand-100 bg-surface-porcelain px-2 py-0.5 font-display text-[9px] font-extrabold text-brand-700">
              <Users className="h-2.5 w-2.5 text-brand-600" />
              Verified Teachers
            </span>
            <span className="inline-flex items-center gap-1 rounded-pill border border-brand-100 bg-surface-porcelain px-2 py-0.5 font-display text-[9px] font-extrabold text-brand-700">
              <Lock className="h-2.5 w-2.5 text-accent-gold" />
              Lockdown Ready
            </span>
          </div>
        </div>

        {/* Logout Action */}
        <CtaButton
          variant="primary"
          size="xs"
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="w-full px-2 text-[11px]"
        >
          <LogOut className="h-3 w-3" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </CtaButton>
      </div>
    </div>
  );
}
