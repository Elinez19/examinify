"use client";

import { AVATAR_PRESETS, getInitials } from "@/lib/portal-auth";
import { cn } from "@/lib/utils";

export interface AvatarBadgeProps {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-16 w-16 text-lg",
} as const;

export function AvatarBadge({
  name,
  avatarUrl,
  size = "sm",
  className,
}: AvatarBadgeProps) {
  const isImage =
    Boolean(avatarUrl) &&
    (avatarUrl!.startsWith("data:image/") ||
      avatarUrl!.startsWith("http") ||
      avatarUrl!.startsWith("/"));

  const preset = AVATAR_PRESETS.find((item) => item.id === avatarUrl);
  const bgGradient = preset?.bg ?? "from-brand-600 to-brand-900";
  const initials = getInitials(name);

  if (isImage) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          "shrink-0 rounded-full object-cover border border-brand-200 shadow-xs",
          SIZE_MAP[size],
          className
        )}
      />
    );
  }

  return (
    <span
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display font-black text-white shadow-xs",
        bgGradient,
        SIZE_MAP[size],
        className
      )}
    >
      {initials}
    </span>
  );
}

