"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminToast } from "@/components/admin/ui/admin-toast";

export interface UseAdminLogoutOptions {
  onBeforeRedirect?: () => void;
}

export interface UseAdminLogoutReturn {
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

/**
 * Signs out the active admin session via `/api/v1/auth/logout` and returns to `/`.
 */
export function useAdminLogout({
  onBeforeRedirect,
}: UseAdminLogoutOptions = {}): UseAdminLogoutReturn {
  const router = useRouter();
  const toast = useAdminToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error(
          "Logout failed",
          "Unable to end your session. Please try again."
        );
        setIsLoggingOut(false);
        return;
      }

      onBeforeRedirect?.();
      router.replace("/");
      router.refresh();
    } catch {
      toast.error(
        "Logout failed",
        "Unable to reach the server. Please try again."
      );
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, onBeforeRedirect, router, toast]);

  return { isLoggingOut, handleLogout };
}

