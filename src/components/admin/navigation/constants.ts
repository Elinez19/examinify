import {
  CreditCard,
  Scale,
  Settings,
  Users,
} from "lucide-react";
import type {
  AdminAlertItem,
  AdminNavItem,
  AdminProfileShortcut,
} from "./types";

export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  {
    label: "Overview",
    subtitle: "School CBT portal overview",
    href: "/admin",
    icon: "overview",
  },
  {
    label: "Users",
    subtitle: "Students, teachers & admins",
    href: "/admin/user-management",
    icon: "user-management",
  },
  {
    label: "Exams",
    subtitle: "CBT sessions & exam room",
    href: "/admin/exams",
    icon: "bookings",
  },
  {
    label: "Subjects",
    subtitle: "Subject bank & class levels",
    href: "/admin/subjects",
    icon: "categories",
  },
  {
    label: "Appeals",
    subtitle: "Result appeals & remarking",
    href: "/admin/appeals",
    icon: "disputes",
  },
  {
    label: "Billing",
    subtitle: "School licenses & invoices",
    href: "/admin/billing",
    icon: "financials",
  },
  {
    label: "Feedback",
    subtitle: "Student & teacher feedback",
    href: "/admin/feedback",
    icon: "reviews",
  },
  {
    label: "Settings",
    subtitle: "Lockdown & exam policies",
    href: "/admin/settings",
    icon: "settings",
  },
  {
    label: "Support",
    subtitle: "School & exam helpdesk",
    href: "/admin/support",
    icon: "support",
  },
  
] as const;

export const ADMIN_PROFILE_SHORTCUTS: ReadonlyArray<AdminProfileShortcut> = [
  {
    label: "Platform Settings",
    subtitle: "Lockdown, resumption & exam policies",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "User Management",
    subtitle: "Students, teachers & admin team",
    href: "/admin/user-management",
    icon: Users,
  },
  {
    label: "School Billing",
    subtitle: "Licenses, invoices & term fees",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    label: "Appeals Center",
    subtitle: "Result appeals & remark requests",
    href: "/admin/appeals",
    icon: Scale,
  },
] as const;

export const LIVE_ALERTS: ReadonlyArray<AdminAlertItem> = [
  {
    id: "alert-escrow",
    title: "Term License Invoice Settled",
    detail: "School CBT license payment verified and activated for current term.",
    href: "/admin/billing",
  },
  {
    id: "alert-kyc",
    title: "Teacher & Staff Verification",
    detail: "New teacher credentials and invigilator profiles awaiting approval.",
    href: "/admin/user-management",
  },
  {
    id: "alert-dispute",
    title: "Result Appeals Queue",
    detail: "Review open student script appeals and remarking requests.",
    href: "/admin/appeals",
  },
] as const;

export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const ADMIN_WARNING_THRESHOLD_MS = 28 * 60 * 1000; // Warn at 28 minutes (2m before timeout)

export function isAdminLinkActive(
  pathname: string | null,
  href: string
): boolean {
  if (!pathname) return href === "/admin";
  if (href === "/admin") {
    return pathname === "/admin";
  }
  if (href === "/admin/billing") {
    return (
      pathname.startsWith("/admin/billing") ||
      pathname.startsWith("/admin/licenses")
    );
  }
  if (href === "/admin/user-management") {
    return (
      pathname.startsWith("/admin/user-management") ||
      pathname.startsWith("/admin/teachers")
    );
  }
  return pathname.startsWith(href);
}

export function resolveActiveNavItem(pathname: string | null): AdminNavItem {
  return (
    ADMIN_NAV_ITEMS.find((item) => isAdminLinkActive(pathname, item.href)) ??
    ADMIN_NAV_ITEMS[0]
  );
}

export function getInitials(name?: string | null): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

