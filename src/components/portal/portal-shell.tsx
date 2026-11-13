"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Lock,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { OffsetRing } from "@/components/brand/offset-ring";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { AdminToastProvider } from "@/components/admin/ui/admin-toast";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  label: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface PortalNotification {
  id: string;
  title: string;
  detail: string;
  href: string;
}

export interface PortalShellConfig {
  portalLabel: string;
  badgeText: string;
  homeHref: string;
  layoutIdPrefix: string;
  navItems: ReadonlyArray<PortalNavItem>;
  userName: string;
  userMeta: string;
  userInitials: string;
  statusChips: ReadonlyArray<{ label: string; icon?: "lock" | "wifi" | "sparkles" }>;
  notifications: ReadonlyArray<PortalNotification>;
  quickStatusPill: string;
  onResetDemo?: () => void;
}

function isLinkActive(
  pathname: string | null,
  href: string,
  homeHref: string
): boolean {
  if (!pathname) return href === homeHref;
  if (href === homeHref) return pathname === homeHref;
  return pathname.startsWith(href);
}

function PortalSidebarContent({
  config,
  pathname,
  onNavigate,
}: {
  config: PortalShellConfig;
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <div className="surface-sidebar-gloss-white no-scrollbar relative flex h-full w-full flex-col justify-between overflow-y-auto border-r-2 border-brand-100 px-3.5 py-3.5 text-ink-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[image:var(--gloss-sheen-blue)] opacity-45"
      />
      <ToolPattern tone="on-light" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between gap-2 px-1 pb-1.5 border-b border-brand-100/80">
          <Link
            href={config.homeHref}
            onClick={onNavigate}
            className="group focus:outline-none"
          >
            <BrandLogo tone="on-light" size="sm" />
          </Link>
          <PillBadge tone="sky" icon="dot" className="px-2.5 py-0.5 text-[10px]">
            {config.badgeText}
          </PillBadge>
        </div>

        <div className="space-y-1">
          <p className="px-2.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-brand-600">
            {config.portalLabel}
          </p>

          <nav aria-label={config.portalLabel} className="space-y-1">
            {config.navItems.map((item) => {
              const active = isLinkActive(pathname, item.href, config.homeHref);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative isolate flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                    active
                      ? "text-ink-on-blue"
                      : "text-brand-950 hover:bg-brand-50/90 hover:text-brand-700"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`${config.layoutIdPrefix}-sidebar-active`}
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
                    {item.icon}
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

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "rounded-pill px-1.5 py-0.5 font-display text-[10px] font-extrabold",
                        active
                          ? "bg-brand-950/60 text-accent-gold"
                          : "bg-brand-100 text-brand-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                      active
                        ? "text-accent-gold translate-x-0.5"
                        : "text-brand-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Cross-Portal Switcher */}
        <div className="space-y-1.5 pt-2 border-t border-brand-100/80">
          <p className="px-2.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
            Switch Workspace
          </p>
          <div className="grid grid-cols-3 gap-1 px-1">
            <Link
              href="/student"
              onClick={onNavigate}
              className={cn(
                "rounded-lg px-2 py-1 text-center font-display text-[10px] font-extrabold border transition-colors",
                pathname?.startsWith("/student")
                  ? "bg-brand-600 text-ink-on-blue border-brand-600"
                  : "bg-surface-pearl text-brand-700 border-brand-100 hover:bg-brand-50"
              )}
            >
              Student
            </Link>
            <Link
              href="/teacher"
              onClick={onNavigate}
              className={cn(
                "rounded-lg px-2 py-1 text-center font-display text-[10px] font-extrabold border transition-colors",
                pathname?.startsWith("/teacher")
                  ? "bg-brand-600 text-ink-on-blue border-brand-600"
                  : "bg-surface-pearl text-brand-700 border-brand-100 hover:bg-brand-50"
              )}
            >
              Teacher
            </Link>
            <Link
              href="/admin"
              onClick={onNavigate}
              className="rounded-lg px-2 py-1 text-center font-display text-[10px] font-extrabold border bg-surface-pearl text-brand-700 border-brand-100 hover:bg-brand-50 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Identity & Status Card */}
      <div className="relative z-10 mt-3 space-y-2 border-t border-brand-100 pt-2.5">
        <div className="rounded-2xl border-2 border-brand-100 bg-surface-pearl/90 p-2.5 shadow-gloss-card space-y-1.5">
          <div className="flex items-center gap-2">
            <OffsetRing size="xs" faceTone="blue" className="h-7 w-7 shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-gold" />
            </OffsetRing>
            <div className="min-w-0">
              <p className="truncate font-display text-[11px] font-extrabold text-brand-950 leading-tight">
                {config.userName}
              </p>
              <p className="truncate text-[10px] font-semibold text-brand-600 leading-tight">
                {config.userMeta}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {config.statusChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1 rounded-pill bg-surface-porcelain px-2 py-0.5 font-display text-[9px] font-extrabold text-brand-700 border border-brand-100"
              >
                {chip.icon === "lock" && (
                  <Lock className="h-2.5 w-2.5 text-accent-gold" />
                )}
                {chip.icon === "wifi" && (
                  <Wifi className="h-2.5 w-2.5 text-accent-success" />
                )}
                {chip.icon === "sparkles" && (
                  <Sparkles className="h-2.5 w-2.5 text-brand-600" />
                )}
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        {config.onResetDemo && (
          <button
            type="button"
            onClick={config.onResetDemo}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-surface-porcelain px-2.5 py-1.5 font-display text-[11px] font-extrabold text-brand-700 hover:bg-brand-50 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function PortalShell({
  config,
  children,
}: {
  config: PortalShellConfig;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [alertsOpen, setAlertsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const alertsRef = React.useRef<HTMLDivElement>(null);

  const activeItem =
    config.navItems.find((item) =>
      isLinkActive(pathname, item.href, config.homeHref)
    ) ?? config.navItems[0];

  const matchingModules = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return config.navItems;
    return config.navItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );
  }, [config.navItems, query]);

  React.useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setAlertsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <AdminToastProvider>
      <div className="no-scrollbar min-h-screen flex bg-surface-pearl text-ink-primary">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block lg:w-60 xl:w-64 shrink-0">
          <div className="sticky top-0 h-screen overflow-hidden">
            <PortalSidebarContent config={config} pathname={pathname} />
          </div>
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionTokens.duration.fast }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-surface-glass-dark backdrop-blur-sm"
                aria-hidden="true"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={motionTokens.spring.snappy}
                className="relative z-10 h-full w-72 max-w-[85vw] overflow-hidden"
              >
                <PortalSidebarContent
                  config={config}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Right Main Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 px-2.5 sm:px-4 lg:px-5 pt-2.5 sm:pt-3">
            <div className="surface-navbar-gloss-white relative mx-auto max-w-[1600px] rounded-2xl sm:rounded-3xl border-2 border-brand-100 px-3.5 sm:px-5 py-2.5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden rounded-2xl sm:rounded-3xl"
              >
                <div className="h-16 w-full bg-[image:var(--gloss-sheen-white)] opacity-60" />
                <ToolPattern tone="on-light" />
              </div>

              <div className="relative z-10 flex items-center justify-between gap-3">
                {/* Left */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Toggle portal navigation"
                    className="cta-surface-primary grid h-9 w-9 shrink-0 place-items-center rounded-xl lg:hidden cursor-pointer"
                  >
                    {mobileOpen ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Menu className="h-4 w-4" />
                    )}
                  </button>

                  <OffsetRing
                    size="xs"
                    faceTone="blue"
                    className="hidden sm:inline-grid h-9 w-9 shrink-0"
                  >
                    <span className="text-ink-on-blue">{activeItem.icon}</span>
                  </OffsetRing>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-display font-extrabold uppercase tracking-wider text-brand-600">
                      <span>{config.portalLabel}</span>
                      <ChevronRight
                        className="h-3 w-3 text-brand-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate text-brand-800">
                        {activeItem.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-display text-sm sm:text-base font-extrabold tracking-tight text-brand-950">
                        {activeItem.label}
                      </h2>
                      <span className="hidden md:inline-block text-xs font-semibold text-ink-secondary truncate">
                        · {activeItem.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Quick Search */}
                <div
                  ref={searchRef}
                  className="relative hidden md:block w-full max-w-xs"
                >
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-600"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onFocus={() => setSearchFocused(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Jump to module..."
                    className="h-9 w-full rounded-pill border-2 border-brand-100 bg-surface-porcelain pl-9 pr-4 font-sans text-xs font-semibold text-ink-primary shadow-gloss-card focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40"
                  />

                  {searchFocused && (
                    <div className="absolute left-0 right-0 top-11 z-40 rounded-2xl border-2 border-brand-100 bg-surface-porcelain p-1.5 shadow-gloss-float">
                      {matchingModules.length === 0 ? (
                        <p className="px-3 py-2 text-xs font-semibold text-ink-muted">
                          No matching modules
                        </p>
                      ) : (
                        matchingModules.map((mod) => (
                          <button
                            key={mod.href}
                            type="button"
                            onClick={() => {
                              setSearchFocused(false);
                              setQuery("");
                              router.push(mod.href);
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-brand-50 transition-colors cursor-pointer"
                          >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-pearl text-brand-600 border border-brand-100">
                              {mod.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-display text-xs font-extrabold text-brand-950">
                                {mod.label}
                              </p>
                              <p className="truncate text-[10px] font-semibold text-ink-secondary">
                                {mod.subtitle}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 shrink-0">
                  <PillBadge
                    tone="sky"
                    icon="dot"
                    className="hidden xl:inline-flex px-3 py-1 text-[11px]"
                  >
                    {config.quickStatusPill}
                  </PillBadge>

                  {/* Notifications */}
                  <div ref={alertsRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setAlertsOpen((v) => !v)}
                      aria-label="Toggle alerts"
                      className="relative grid h-9 w-9 place-items-center rounded-pill border-2 border-brand-100 bg-surface-porcelain text-brand-700 shadow-gloss-card hover:border-brand-300 cursor-pointer"
                    >
                      <Bell className="h-4 w-4" />
                      {config.notifications.length > 0 && (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-gold" />
                      )}
                    </button>

                    {alertsOpen && (
                      <div className="absolute right-0 top-11 z-40 w-72 sm:w-80 rounded-2xl border-2 border-brand-100 bg-surface-porcelain p-3 shadow-gloss-float space-y-2">
                        <div className="flex items-center justify-between border-b border-brand-100 pb-2">
                          <span className="font-display text-xs font-extrabold text-brand-950">
                            Notifications
                          </span>
                          <PillBadge tone="sky" className="px-2 py-0.5 text-[10px]">
                            {config.notifications.length} Active
                          </PillBadge>
                        </div>
                        <div className="space-y-1.5">
                          {config.notifications.map((n) => (
                            <Link
                              key={n.id}
                              href={n.href}
                              onClick={() => setAlertsOpen(false)}
                              className="block rounded-xl border border-brand-100 bg-surface-pearl/70 p-2.5 hover:bg-brand-50 transition-colors"
                            >
                              <p className="font-display text-xs font-extrabold text-brand-950">
                                {n.title}
                              </p>
                              <p className="mt-0.5 text-[11px] font-medium text-ink-secondary">
                                {n.detail}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Initials Badge */}
                  <div className="flex items-center gap-2 rounded-pill border-2 border-brand-100 bg-surface-porcelain px-2.5 py-1 shadow-gloss-card">
                    <span className="grid h-7 w-7 place-items-center rounded-pill cta-surface-primary font-display text-[11px] font-extrabold text-ink-on-blue">
                      {config.userInitials}
                    </span>
                    <div className="hidden sm:block text-left pr-1">
                      <p className="font-display text-[11px] font-extrabold text-brand-950 leading-tight">
                        {config.userName}
                      </p>
                      <p className="text-[10px] font-semibold text-ink-muted leading-tight">
                        {config.userMeta}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full max-w-[1600px] mx-auto p-2.5 sm:p-4 lg:p-5">
            {children}
          </main>
        </div>
      </div>
    </AdminToastProvider>
  );
}

