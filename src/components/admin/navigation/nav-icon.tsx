import * as React from "react";
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Headset,
  Layers,
  LayoutDashboard,
  Radio,
  Scale,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminNavIconType } from "./types";

export function NavIcon({
  type,
  className,
}: {
  type: AdminNavIconType;
  className?: string;
}) {
  const iconClass = cn("h-4 w-4 shrink-0", className);
  switch (type) {
    case "overview":
      return <LayoutDashboard className={iconClass} />;
    case "bookings":
      return <CalendarCheck className={iconClass} />;
    case "categories":
      return <Layers className={iconClass} />;
    case "disputes":
      return <Scale className={iconClass} />;
    case "financials":
      return <CreditCard className={iconClass} />;
    case "reviews":
      return <Star className={iconClass} />;
    case "settings":
      return <Settings className={iconClass} />;
    case "support":
      return <Headset className={iconClass} />;
    case "user-management":
      return <Users className={iconClass} />;
    case "book-open":
      return <BookOpen className={iconClass} />;
    case "clipboard-list":
      return <ClipboardList className={iconClass} />;
    case "graduation-cap":
      return <GraduationCap className={iconClass} />;
    case "calendar-days":
      return <CalendarDays className={iconClass} />;
    case "layers":
      return <Layers className={iconClass} />;
    case "shield-check":
      return <ShieldCheck className={iconClass} />;
    case "user-check":
      return <UserCheck className={iconClass} />;
    case "shield":
      return <Shield className={iconClass} />;
    case "proctoring":
      return <Radio className={iconClass} />;
  }
}
