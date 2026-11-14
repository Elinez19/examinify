"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { clearPortalSessionCookie } from "@/lib/portal-auth";

export interface UseAdminLogoutOptions {
  onBeforeRedirect?: () => void;
}

export interface UseAdminLogoutReturn {
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

/**
 * Signs out the active admin session and returns to `/login`.
 */
export function useAdminLogout({
  onBeforeRedirect,
}: UseAdminLogoutOptions = {}): UseAdminLogoutReturn {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      clearPortalSessionCookie();
      onBeforeRedirect?.();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, onBeforeRedirect, router]);

  return { isLoggingOut, handleLogout };
}

