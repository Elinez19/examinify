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
  AdminSubNavItem,
} from "./types";

export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  {
    label: "Overview",
    subtitle: "School CBT portal overview",
    href: "/admin",
    icon: "overview",
  },
  {
    label: "Academic",
    subtitle: "Subjects, classes, terms & question bank",
    href: "/admin/subjects",
    icon: "categories",
    children: [
      {
        label: "All Subjects",
        subtitle: "Manage school subject catalog",
        href: "/admin/subjects",
        icon: "book-open",
      },
      {
        label: "Assign Subject to Class",
        subtitle: "Allocate subjects to class arms",
        href: "/admin/academic/assign-subjects",
        icon: "clipboard-list",
      },
      {
        label: "Class Arms",
        subtitle: "Configure class levels & form teachers",
        href: "/admin/academic/classes",
        icon: "graduation-cap",
      },
      {
        label: "Sessions",
        subtitle: "Academic sessions & calendar dates",
        href: "/admin/academic/sessions",
        icon: "calendar-days",
      },
      {
        label: "Terms",
        subtitle: "Academic terms & descriptions",
        href: "/admin/academic/terms",
        icon: "bookings",
      },
      {
        label: "Question Types",
        subtitle: "Configure supported CBT formats",
        href: "/admin/academic/question-types",
        icon: "shield-check",
      },
      {
        label: "Question Bank",
        subtitle: "Curate CBT assessment questions",
        href: "/admin/academic/question-bank",
        icon: "layers",
      },
    ],
  },
  {
    label: "Users",
    subtitle: "Students, staff, roles & class assignment",
    href: "/admin/user-management",
    icon: "user-management",
    children: [
      {
        label: "Students",
        subtitle: "Student records & class assignment",
        href: "/admin/user-management",
        icon: "graduation-cap",
      },
      {
        label: "Staff",
        subtitle: "Register and manage all school staff",
        href: "/admin/users/staff",
        icon: "shield",
      },
      {
        label: "Assign Staff Role",
        subtitle: "Assign roles to registered staff",
        href: "/admin/users/assign-role",
        icon: "user-check",
      },
      {
        label: "Assign Class to Teacher",
        subtitle: "Assign class arms to teaching staff",
        href: "/admin/users/assign-class",
        icon: "clipboard-list",
      },
    ],
  },
  {
    label: "Exams",
    subtitle: "CBT scheduling, PINs & live proctoring",
    href: "/admin/exams",
    icon: "bookings",
    children: [
      {
        label: "Exam Scheduling",
        subtitle: "Schedule CBT windows & access PINs",
        href: "/admin/exams",
        icon: "bookings",
      },
      {
        label: "Live Proctoring",
        subtitle: "Monitor active candidates & broadcasts",
        href: "/admin/exams/proctoring",
        icon: "proctoring",
      },
    ],
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

export interface FlatAdminNavEntry {
  readonly label: string;
  readonly subtitle: string;
  readonly href: string;
  readonly icon: AdminNavItem["icon"];
  readonly parentLabel?: string;
}

export const FLAT_ADMIN_NAV_ITEMS: ReadonlyArray<FlatAdminNavEntry> =
  ADMIN_NAV_ITEMS.flatMap((item) => {
    if (item.children && item.children.length > 0) {
      return item.children.map((child) => ({
        ...child,
        parentLabel: item.label,
      }));
    }
    return [
      {
        label: item.label,
        subtitle: item.subtitle,
        href: item.href,
        icon: item.icon,
      },
    ];
  });

export const ADMIN_PROFILE_SHORTCUTS: ReadonlyArray<AdminProfileShortcut> = [
  {
    label: "Platform Settings",
    subtitle: "Lockdown, resumption & exam policies",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Student Directory",
    subtitle: "Students & class arm assignments",
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
    title: "Staff & Teacher Review",
    detail: "New staff profiles and role assignments ready for review.",
    href: "/admin/users/staff",
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

export function isAdminSubLinkActive(
  pathname: string | null,
  href: string
): boolean {
  if (!pathname) return href === "/admin";
  if (href === "/admin") {
    return pathname === "/admin";
  }
  if (href === "/admin/exams") {
    return pathname === "/admin/exams";
  }
  if (href === "/admin/billing") {
    return (
      pathname.startsWith("/admin/billing") ||
      pathname.startsWith("/admin/licenses")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isAdminLinkActive(
  pathname: string | null,
  href: string,
  children?: ReadonlyArray<AdminSubNavItem>
): boolean {
  if (children && children.length > 0) {
    return children.some((child) => isAdminSubLinkActive(pathname, child.href));
  }
  return isAdminSubLinkActive(pathname, href);
}

export function resolveActiveNavContext(pathname: string | null): {
  parent: AdminNavItem;
  subItem: AdminSubNavItem | null;
} {
  for (const item of ADMIN_NAV_ITEMS) {
    if (item.children && item.children.length > 0) {
      const matchedChild = item.children.find((child) =>
        isAdminSubLinkActive(pathname, child.href)
      );
      if (matchedChild) {
        return { parent: item, subItem: matchedChild };
      }
    } else if (isAdminSubLinkActive(pathname, item.href)) {
      return { parent: item, subItem: null };
    }
  }
  return { parent: ADMIN_NAV_ITEMS[0], subItem: null };
}

export function resolveActiveNavItem(pathname: string | null): AdminNavItem {
  const { parent, subItem } = resolveActiveNavContext(pathname);
  if (subItem) {
    return {
      label: subItem.label,
      subtitle: subItem.subtitle,
      href: subItem.href,
      icon: subItem.icon,
    };
  }
  return parent;
}

export function getInitials(name?: string | null): string {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
