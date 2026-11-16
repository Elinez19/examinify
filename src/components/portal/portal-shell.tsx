"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { ToolPattern } from "@/components/brand/exam-pattern";
import { BrandLogo } from "@/components/brand/logo";
import { OffsetRing } from "@/components/brand/offset-ring";
import { PillBadge } from "@/components/landing/ui/pill-badge";
import { AvatarBadge } from "@/components/portal/avatar-badge";
import { motionTokens } from "@/lib/motion";
import { clearPortalSessionCookie } from "@/lib/portal-auth";
import { cn } from "@/lib/utils";

export interface PortalSubNavItem {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
}

export interface PortalNavItem {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
  children?: PortalSubNavItem[];
}

export interface PortalAlertItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone?: "info" | "warning" | "success";
}

export interface PortalShellProps {
  role: "student" | "teacher";
  roleLabel: string;
  navItems: PortalNavItem[];
  userName: string;
  userSublabel: string;
  userInitials: string;
  avatarUrl?: string;
  profileHref?: string;
  brandTagline: string;
  statusBadge: string;
  alerts?: PortalAlertItem[];
  onResetDemo?: () => void;
  children: React.ReactNode;
}

export function PortalShell({
  role,
  roleLabel,
  navItems,
  userName,
  userSublabel,
  avatarUrl,
  profileHref,
  brandTagline,
  statusBadge,
  alerts = [],
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [alertsOpen, setAlertsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [quickQuery, setQuickQuery] = React.useState("");
  const [groupOverrides, setGroupOverrides] = React.useState<
    Record<string, boolean>
  >({});

  const alertsRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (alertsRef.current && !alertsRef.current.contains(target)) {
        setAlertsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAlertsOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const rootHref = role === "student" ? "/student" : "/teacher";

  const isSubLinkActive = (href: string) => {
    if (href === rootHref) {
      return pathname === rootHref;
    }
    if (href === "/student/profile") {
      return pathname === "/student/profile";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isNavItemActive = (item: PortalNavItem) => {
    if (item.children && item.children.length > 0) {
      return item.children.some((child) => isSubLinkActive(child.href));
    }
    return isSubLinkActive(item.href);
  };

  const activeContext = (() => {
    for (const item of navItems) {
      if (item.children && item.children.length > 0) {
        const sub = item.children.find((child) => isSubLinkActive(child.href));
        if (sub) return { parent: item, subItem: sub };
      } else if (isSubLinkActive(item.href)) {
        return { parent: item, subItem: null };
      }
    }
    return { parent: navItems[0], subItem: null };
  })();

  const flatSearchItems: Array<{
    href: string;
    label: string;
    parentLabel?: string;
  }> = navItems.flatMap((item) => {
    if (item.children && item.children.length > 0) {
      return item.children.map((child) => ({
        href: child.href,
        label: child.label,
        parentLabel: item.label,
      }));
    }
    return [{ href: item.href, label: item.label }];
  });

  const hasActiveChildGroup = navItems.some(
    (item) => Boolean(item.children?.length) && isNavItemActive(item)
  );

  const isGroupExpanded = (label: string, active: boolean, index: number) => {
    const override = groupOverrides[label];
    if (override !== undefined) return override;
    if (active) return true;
    const firstGroup = navItems.find((item) => Boolean(item.children?.length));
    return !hasActiveChildGroup && firstGroup?.label === label && index >= 0;
  };

  const toggleGroup = (label: string, currentlyExpanded: boolean) => {
    setGroupOverrides((prev) => ({
      ...prev,
      [label]: !currentlyExpanded,
    }));
  };

  const activeDisplay = activeContext.subItem ?? activeContext.parent;

  const handleSignOut = () => {
    clearPortalSessionCookie();
    setProfileOpen(false);
    router.replace("/login");
    router.refresh();
  };

  const renderSidebarContent = (onNavigate?: () => void) => (
    <div className="surface-sidebar-gloss-white no-scrollbar relative flex h-full w-full flex-col justify-between overflow-y-auto border-r-2 border-brand-100 px-3.5 py-3.5 text-ink-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[image:var(--gloss-sheen-blue)] opacity-45"
      />
      <ToolPattern tone="on-light" />

      <div className="relative z-10 space-y-3.5">
        {/* Brand Identity */}
        <div className="flex items-center justify-between gap-2 border-b border-brand-100/80 px-1 pb-2">
          <Link
            href={rootHref}
            onClick={onNavigate}
            className="focus:outline-none"
          >
            <BrandLogo tone="on-light" size="sm" />
          </Link>
          <PillBadge
            tone="sky"
            icon="dot"
            className="px-2.5 py-0.5 text-[10px]"
          >
            {role === "student" ? "Student" : "Teacher"}
          </PillBadge>
        </div>

        {/* Menu & Submenu Navigation */}
        <div className="space-y-1.5">
          <p className="px-2.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-brand-600">
            Menu
          </p>

          <nav aria-label={`${roleLabel} Sidebar`} className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isNavItemActive(item);
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const expanded = isGroupExpanded(item.label, active, idx);

              if (hasChildren && item.children) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.label, expanded)}
                      aria-expanded={expanded}
                      className={cn(
                        "group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                        active
                          ? "border border-brand-200/80 bg-brand-50 text-brand-800"
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
                        <Icon className="h-3.5 w-3.5" />
                      </span>

                      <span className="min-w-0 flex-1 truncate font-display text-xs font-extrabold leading-tight">
                        {item.label}
                      </span>

                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 text-brand-500 transition-transform duration-200",
                          expanded ? "rotate-0" : "-rotate-90"
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: motionTokens.duration.fast }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 space-y-0.5 border-l-2 border-brand-100 py-0.5 pl-2.5">
                            {item.children.map((sub) => {
                              const SubIcon = sub.icon;
                              const subActive = isSubLinkActive(sub.href);
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={onNavigate}
                                  className={cn(
                                    "group relative isolate flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                                    subActive
                                      ? "text-ink-on-blue"
                                      : "text-brand-900 hover:bg-brand-50/90 hover:text-brand-700"
                                  )}
                                >
                                  {subActive && (
                                    <motion.span
                                      layoutId={`${role}-sidebar-active-pill`}
                                      transition={motionTokens.spring.snappy}
                                      className="cta-surface-primary absolute inset-0 -z-10 rounded-xl"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <span className="flex min-w-0 items-center gap-2">
                                    <SubIcon
                                      className={cn(
                                        "h-3.5 w-3.5 shrink-0 transition-colors",
                                        subActive
                                          ? "text-accent-gold"
                                          : "text-brand-500 group-hover:text-brand-700"
                                      )}
                                    />
                                    <span className="truncate font-display text-[11px] font-extrabold leading-tight">
                                      {sub.label}
                                    </span>
                                  </span>
                                  {sub.badge && (
                                    <span
                                      className={cn(
                                        "rounded-pill px-2 py-0.5 text-[10px] font-extrabold",
                                        subActive
                                          ? "bg-surface-porcelain/20 text-ink-on-blue"
                                          : "bg-surface-mist text-brand-700"
                                      )}
                                    >
                                      {sub.badge}
                                    </span>
                                  )}
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
                    "group relative isolate flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-sky",
                    active
                      ? "text-ink-on-blue"
                      : "text-brand-950 hover:bg-brand-50/90 hover:text-brand-700"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`${role}-sidebar-active-pill`}
                      transition={motionTokens.spring.snappy}
                      className="cta-surface-primary absolute inset-0 -z-10 rounded-xl"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors",
                        active
                          ? "border-surface-porcelain bg-surface-porcelain text-brand-600 shadow-gloss-card"
                          : "border-brand-100 bg-surface-pearl text-brand-600 shadow-gloss-card group-hover:border-brand-200 group-hover:bg-surface-porcelain"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate font-display text-xs font-extrabold leading-tight">
                      {item.label}
                    </span>
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-pill px-2 py-0.5 text-[10px] font-extrabold",
                        active
                          ? "bg-surface-porcelain/20 text-ink-on-blue"
                          : "bg-surface-mist text-brand-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Status Footer */}
      <div className="relative z-10 mt-6 rounded-2xl border-2 border-brand-100 bg-surface-pearl/90 p-3.5 shadow-gloss-card">
        <PillBadge
          tone="blue"
          icon="dot"
          className="px-2.5 py-0.5 text-[10px]"
        >
          {statusBadge}
        </PillBadge>
        <p className="mt-2 text-xs font-medium leading-relaxed text-ink-secondary">
          {brandTagline}
        </p>
      </div>
    </div>
  );

  const ActiveNavIcon = activeDisplay?.icon ?? User;

  return (
    <div className="min-h-screen bg-surface-pearl text-ink-primary lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        {renderSidebarContent()}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative z-10 h-full w-72 max-w-[85vw] shadow-gloss-blue"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="cta-surface-primary absolute right-3 top-3.5 z-20 grid h-8 w-8 place-items-center rounded-xl cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              {renderSidebarContent(() => setMobileOpen(false))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-col">
        {/* Gloss White Sticky Header Bar matching AdminDashboardNavbar */}
        <header className="sticky top-0 z-30 px-2.5 pt-2.5 sm:px-4 sm:pt-3 lg:px-5">
          <div className="surface-navbar-gloss-white relative mx-auto max-w-[1600px] rounded-2xl border-2 border-brand-100 px-3.5 py-2.5 sm:rounded-3xl sm:px-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              <div className="h-16 w-full bg-[image:var(--gloss-sheen-white)] opacity-60" />
              <ToolPattern tone="on-light" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation menu"
                  className="cta-surface-primary grid h-9 w-9 shrink-0 place-items-center rounded-xl lg:hidden cursor-pointer"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <OffsetRing
                  size="xs"
                  faceTone="blue"
                  className="hidden shrink-0 sm:grid"
                >
                  <ActiveNavIcon className="h-4 w-4 text-ink-on-blue" />
                </OffsetRing>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-display font-extrabold uppercase tracking-wider text-brand-600">
                    <span>{roleLabel}</span>
                    <ChevronRight
                      className="h-3 w-3 shrink-0 text-brand-400"
                      aria-hidden="true"
                    />
                    {activeContext.subItem ? (
                      <>
                        <span className="truncate text-brand-600">
                          {activeContext.parent.label}
                        </span>
                        <ChevronRight
                          className="h-3 w-3 shrink-0 text-brand-400"
                          aria-hidden="true"
                        />
                        <span className="truncate text-brand-800">
                          {activeContext.subItem.label}
                        </span>
                      </>
                    ) : (
                      <span className="truncate text-brand-800">
                        {activeDisplay?.label ?? roleLabel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-sm font-extrabold text-brand-950 sm:text-base">
                      {activeDisplay?.label ?? roleLabel}
                    </p>
                    {activeDisplay?.description && (
                      <p className="hidden truncate text-xs font-medium text-ink-secondary md:block">
                        · {activeDisplay.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-500" />
                  <input
                    type="search"
                    value={quickQuery}
                    onChange={(event) => setQuickQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && quickQuery.trim()) {
                        const q = quickQuery.trim().toLowerCase();
                        const match = flatSearchItems.find(
                          (item) =>
                            item.label.toLowerCase().includes(q) ||
                            (item.parentLabel?.toLowerCase().includes(q) ?? false)
                        );
                        if (match) {
                          router.push(match.href);
                          setQuickQuery("");
                        }
                      }
                    }}
                    placeholder="Jump to view..."
                    className="w-44 rounded-pill border-2 border-brand-100 bg-surface-porcelain py-1.5 pl-8 pr-3 text-xs font-semibold text-ink-primary shadow-gloss-card placeholder:text-brand-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-accent-sky/40"
                  />
                </div>

                <PillBadge
                  tone="sky"
                  icon="dot"
                  className="hidden px-2.5 py-1 text-[10px] sm:inline-flex"
                >
                  {statusBadge}
                </PillBadge>

                <div className="relative" ref={alertsRef}>
                  <button
                    type="button"
                    onClick={() => setAlertsOpen((prev) => !prev)}
                    aria-label="Notifications"
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-brand-100 bg-surface-porcelain text-brand-800 shadow-gloss-card transition-colors hover:border-brand-300 hover:bg-surface-mist cursor-pointer"
                  >
                    <Bell className="h-4 w-4" />
                    {alerts.length > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-gold ring-2 ring-surface-porcelain" />
                    )}
                  </button>

                  <AnimatePresence>
                    {alertsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        className="surface-gloss-card absolute right-0 mt-2 w-72 rounded-2xl border-2 border-surface-porcelain p-3 sm:w-80"
                      >
                        <p className="px-1 pb-2 font-display text-[11px] font-extrabold uppercase tracking-wider text-brand-800">
                          Portal Alerts
                        </p>
                        <div className="max-h-64 space-y-2 overflow-y-auto">
                          {alerts.length === 0 ? (
                            <p className="px-2 py-4 text-center text-xs font-medium text-ink-secondary">
                              No active notifications right now.
                            </p>
                          ) : (
                            alerts.map((alert) => (
                              <div
                                key={alert.id}
                                className="rounded-xl border border-brand-100 bg-surface-pearl p-2.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-extrabold text-brand-950">
                                    {alert.title}
                                  </span>
                                  <span className="text-[10px] font-semibold text-brand-500">
                                    {alert.time}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[11px] font-medium text-ink-secondary">
                                  {alert.detail}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                    className="inline-flex items-center gap-2.5 rounded-pill border-2 border-brand-100 bg-surface-porcelain py-1 pl-1.5 pr-3 shadow-gloss-card transition-colors hover:border-brand-300 hover:bg-surface-mist cursor-pointer"
                  >
                    <AvatarBadge name={userName} avatarUrl={avatarUrl} size="sm" />
                    <div className="hidden text-left sm:block">
                      <p className="max-w-[140px] truncate font-display text-xs font-extrabold leading-tight text-brand-950">
                        {userName}
                      </p>
                      <p className="max-w-[140px] truncate text-[10px] font-semibold leading-tight text-ink-secondary">
                        {userSublabel}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-brand-600 transition-transform",
                        profileOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        role="menu"
                        className="surface-gloss-card absolute right-0 mt-2 w-60 rounded-2xl border-2 border-surface-porcelain p-2"
                      >
                        <div className="border-b border-surface-frost px-3 py-2.5">
                          <p className="truncate font-display text-xs font-extrabold text-brand-950">
                            {userName}
                          </p>
                          <p className="truncate text-[11px] font-medium text-ink-secondary">
                            {userSublabel}
                          </p>
                        </div>

                        <div className="mt-1.5 space-y-1">
                          {profileHref && (
                            <Link
                              href={profileHref}
                              onClick={() => setProfileOpen(false)}
                              role="menuitem"
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 transition-colors hover:bg-surface-mist"
                            >
                              <User className="h-4 w-4 text-brand-600" />
                              <span>Profile Details</span>
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={handleSignOut}
                            role="menuitem"
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-accent-warm-deep transition-colors hover:bg-accent-warm/10 cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 p-3.5 sm:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
