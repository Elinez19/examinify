export type PortalRole = "student" | "teacher" | "admin";

export const SESSION_COOKIE_NAME = "examinify_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface PortalSession {
  role: PortalRole;
  userId: string;
}

const VALID_ROLES = new Set<PortalRole>(["student", "teacher", "admin"]);

export function getRoleHomePath(role: PortalRole): string {
  switch (role) {
    case "student":
      return "/student";
    case "teacher":
      return "/teacher";
    case "admin":
      return "/admin";
  }
}

export function encodeSessionCookie(session: PortalSession): string {
  return encodeURIComponent(`${session.role}:${session.userId}`);
}

export function parseSessionCookie(raw?: string | null): PortalSession | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw).trim();
    const colonIdx = decoded.indexOf(":");
    if (colonIdx <= 0) return null;
    const role = decoded.slice(0, colonIdx) as PortalRole;
    const userId = decoded.slice(colonIdx + 1).trim();
    if (!VALID_ROLES.has(role) || !userId) return null;
    return { role, userId };
  } catch {
    return null;
  }
}

export function setPortalSessionCookie(session: PortalSession): void {
  if (typeof document === "undefined") return;
  const value = encodeSessionCookie(session);
  document.cookie = `${SESSION_COOKIE_NAME}=${value}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearPortalSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getClientPortalSession(): PortalSession | null {
  if (typeof document === "undefined") return null;
  const prefix = `${SESSION_COOKIE_NAME}=`;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return parseSessionCookie(trimmed.slice(prefix.length));
    }
  }
  return null;
}

export const AVATAR_PRESETS = [
  { id: "avatar-1", label: "Indigo Scholar", bg: "from-brand-600 to-brand-900", ring: "#4f46e5" },
  { id: "avatar-2", label: "Emerald Crest", bg: "from-emerald-600 to-emerald-900", ring: "#059669" },
  { id: "avatar-3", label: "Amber Torch", bg: "from-amber-500 to-orange-700", ring: "#d97706" },
  { id: "avatar-4", label: "Rose Laurel", bg: "from-rose-500 to-rose-800", ring: "#e11d48" },
  { id: "avatar-5", label: "Slate Shield", bg: "from-slate-700 to-slate-950", ring: "#334155" },
] as const;

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "EX";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

