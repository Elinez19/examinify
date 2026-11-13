"use client";

import { useCallback, useMemo, useState } from "react";
import type { ArtisanRow, UserRow } from "@/components/admin/mock-data";
import {
  INITIAL_ADMINS,
  INITIAL_CUSTOMERS,
} from "@/components/admin/users/constants";
import type {
  AdminAccountStatus,
  AdminRecord,
  AdminScopeOption,
  ArtisanUserFormData,
  CustomerAccountStatus,
  CustomerRecord,
} from "@/components/admin/users/types";

export interface UseArtisansKycReturn {
  artisans: ArtisanRow[];
  setArtisans: React.Dispatch<React.SetStateAction<ArtisanRow[]>>;
  customers: CustomerRecord[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerRecord[]>>;
  admins: AdminRecord[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminRecord[]>>;
  busyId: string | null;
  saving: boolean;
  savedBanner: string | null;
  notifySaved: (msg: string) => void;
  updateArtisanKyc: (id: string, nextKycStatus: string) => Promise<void>;
  toggleArtisanOnline: (art: ArtisanRow) => Promise<void>;
  deleteArtisan: (id: string, onDeleted?: () => void) => Promise<void>;
  toggleCustomerStatus: (id: string) => Promise<void>;
  deleteCustomer: (id: string, onDeleted?: () => void) => Promise<void>;
  toggleAdminStatus: (id: string) => Promise<void>;
  softDeleteAdmin: (id: string, onDeleted?: () => void) => Promise<boolean>;
  deleteAdmin: (id: string, onDeleted?: () => void) => Promise<void>;
  revokeUserSessions: (userId: string) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  resendAdminInvite: (adminId: string) => Promise<boolean>;
  saveUser: (formData: ArtisanUserFormData) => Promise<boolean>;
  batchVerifyArtisans: (selectedIds: string[]) => void;
  batchDeleteArtisans: (selectedIds: string[]) => void;
  batchDeleteCustomers: (selectedIds: string[]) => Promise<void>;
  batchDeleteAdmins: (selectedIds: string[]) => Promise<void>;
  counts: {
    all: number;
    verified: number;
    pending: number;
    rejected: number;
  };
}

export function useArtisansKyc(
  initialArtisans: ArtisanRow[],
  initialUsers: UserRow[] = [],
  initialBookingCounts: Record<string, number> = {}
): UseArtisansKycReturn {
  const hydratedCustomers = useMemo<CustomerRecord[]>(() => {
    const clientUsers = initialUsers.filter((u) => u.role === "client");
    if (clientUsers.length === 0 && initialUsers.length === 0) {
      return INITIAL_CUSTOMERS;
    }
    return clientUsers.map((u) => {
      const isSuspended = u.accountStatus === "suspended" || Boolean(u.banned);
      const resolvedStatus: CustomerAccountStatus = isSuspended
        ? "suspended"
        : u.accountStatus === "pending"
          ? "pending"
          : "active";

      const count =
        initialBookingCounts[u.id] ||
        initialBookingCounts[u.email?.toLowerCase()] ||
        0;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "+234 803 550 1920",
        city: u.city || "Abuja (Wuse II)",
        bookingsCount: count,
        status: resolvedStatus,
        joinedAt: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "2026",
        banned: Boolean(u.banned),
      };
    });
  }, [initialUsers, initialBookingCounts]);

  const hydratedAdmins = useMemo<AdminRecord[]>(() => {
    const adminUsers = initialUsers.filter((u) => u.role === "admin");
    if (adminUsers.length === 0 && initialUsers.length === 0) {
      return INITIAL_ADMINS;
    }
    return adminUsers.map((u) => {
      const isSuspended = u.accountStatus === "suspended" || Boolean(u.banned);
      const resolvedStatus: AdminAccountStatus = isSuspended
        ? "suspended"
        : u.accountStatus === "active"
          ? "active"
          : "verified";

      const scope: AdminScopeOption =
        (u.adminScope as AdminScopeOption) ||
        ((u.adminRoleTitle || "").toLowerCase().includes("kyc")
          ? "kyc_moderator"
          : (u.adminRoleTitle || "").toLowerCase().includes("dispatch")
            ? "dispatch_support"
            : "super_admin");

      let lastActive = "Verified Account";
      if (isSuspended) {
        lastActive = "Account Suspended";
      } else if (u.mustChangePassword) {
        lastActive = "Pending First Login";
      }

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "+234 803 550 1920",
        roleTitle: u.adminRoleTitle || "CBT Operations Administrator",
        permissions:
          u.adminPermissions ||
          "Teacher verification, exam sessions & school support",
        adminScope: scope,
        status: resolvedStatus,
        mustChangePassword: Boolean(u.mustChangePassword),
        lastActive,
        banned: Boolean(u.banned),
      };
    });
  }, [initialUsers]);

  const [artisans, setArtisans] = useState<ArtisanRow[]>(initialArtisans);
  const [customers, setCustomers] = useState<CustomerRecord[]>(hydratedCustomers);
  const [admins, setAdmins] = useState<AdminRecord[]>(hydratedAdmins);
  const [busyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const notifySaved = useCallback((msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(null), 4500);
  }, []);

  const counts = useMemo(
    () => ({
      all: artisans.length,
      verified: artisans.filter((a) => a.kycStatus === "verified").length,
      pending: artisans.filter((a) => a.kycStatus === "pending").length,
      rejected: artisans.filter((a) => a.kycStatus === "rejected").length,
    }),
    [artisans]
  );

  const updateArtisanKyc = useCallback(
    async (id: string, nextKycStatus: string) => {
      setArtisans((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, kycStatus: nextKycStatus, updatedAt: new Date() }
            : a
        )
      );
      notifySaved(`Verification status set to ${nextKycStatus}`);
    },
    [notifySaved]
  );

  const toggleArtisanOnline = useCallback(
    async (art: ArtisanRow) => {
      const nextOnline = !art.isOnline;
      setArtisans((prev) =>
        prev.map((a) =>
          a.id === art.id
            ? { ...a, isOnline: nextOnline, updatedAt: new Date() }
            : a
        )
      );
      notifySaved(`${art.name} marked ${nextOnline ? "Online" : "Offline"}`);
    },
    [notifySaved]
  );

  const deleteArtisan = useCallback(
    async (id: string, onDeleted?: () => void) => {
      setArtisans((prev) => prev.filter((a) => a.id !== id));
      onDeleted?.();
      notifySaved("Teacher record permanently removed");
    },
    [notifySaved]
  );

  const toggleCustomerStatus = useCallback(
    async (id: string) => {
      const current = customers.find((c) => c.id === id);
      if (!current) return;

      const isCurrentlySuspended = current.status === "suspended";
      const nextStatus: CustomerAccountStatus = isCurrentlySuspended
        ? "active"
        : "suspended";

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status: nextStatus, banned: nextStatus === "suspended" }
            : c
        )
      );
      notifySaved(
        `Student account ${nextStatus === "suspended" ? "suspended" : "reactivated"}`
      );
    },
    [customers, notifySaved]
  );

  const deleteCustomer = useCallback(
    async (id: string, onDeleted?: () => void) => {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      onDeleted?.();
      notifySaved("Student record deleted");
    },
    [notifySaved]
  );

  const toggleAdminStatus = useCallback(
    async (id: string) => {
      const current = admins.find((adm) => adm.id === id);
      if (!current) return;

      const isCurrentlySuspended = current.status === "suspended";
      const nextStatus: AdminAccountStatus = isCurrentlySuspended
        ? "verified"
        : "suspended";

      setAdmins((prev) =>
        prev.map((adm) =>
          adm.id === id
            ? {
                ...adm,
                status: nextStatus,
                banned: nextStatus === "suspended",
                lastActive:
                  nextStatus === "suspended"
                    ? "Account Suspended"
                    : "Active Staff",
              }
            : adm
        )
      );
      notifySaved(
        `Administrator ${nextStatus === "suspended" ? "suspended" : "clearance restored"}`
      );
    },
    [admins, notifySaved]
  );

  const softDeleteAdmin = useCallback(
    async (id: string, onDeleted?: () => void): Promise<boolean> => {
      setAdmins((prev) =>
        prev.map((adm) =>
          adm.id === id
            ? {
                ...adm,
                status: "suspended",
                lastActive: "Account Suspended",
                banned: true,
              }
            : adm
        )
      );
      notifySaved("Administrator access suspended");
      onDeleted?.();
      return true;
    },
    [notifySaved]
  );

  const deleteAdmin = useCallback(
    async (id: string, onDeleted?: () => void) => {
      setAdmins((prev) => prev.filter((adm) => adm.id !== id));
      onDeleted?.();
      notifySaved("Administrator account removed");
    },
    [notifySaved]
  );

  const revokeUserSessions = useCallback(
    async (): Promise<boolean> => {
      notifySaved("Active UI status refreshed");
      return true;
    },
    [notifySaved]
  );

  const resetUserPassword = useCallback(
    async (): Promise<boolean> => {
      notifySaved("Password reset simulated in UI preview");
      return true;
    },
    [notifySaved]
  );

  const resendAdminInvite = useCallback(
    async (): Promise<boolean> => {
      notifySaved("Admin invitation simulated in UI preview");
      return true;
    },
    [notifySaved]
  );

  const batchDeleteCustomers = useCallback(
    async (selectedIds: string[]) => {
      setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      notifySaved(`Removed ${selectedIds.length} student record(s)`);
    },
    [notifySaved]
  );

  const batchDeleteAdmins = useCallback(
    async (selectedIds: string[]) => {
      setAdmins((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      notifySaved(`Removed ${selectedIds.length} administrator account(s)`);
    },
    [notifySaved]
  );

  const saveUser = useCallback(
    async (formData: ArtisanUserFormData): Promise<boolean> => {
      setSaving(true);
      try {
        if (formData.formGroup === "artisan") {
          const rateNum = Number(formData.hourlyRateNumeric) || 15000;
          const formattedRate = `₦${rateNum.toLocaleString()}`;

          if (formData.editingId) {
            setArtisans((prev) =>
              prev.map((a) =>
                a.id === formData.editingId
                  ? {
                      ...a,
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      trade: formData.trade,
                      city: formData.city,
                      hourlyRate: formattedRate,
                      hourlyRateNumeric: rateNum,
                      ninNumber: formData.ninNumber,
                      bankName: formData.bankName,
                      bankAccountNumber: formData.bankAccountNumber,
                      kycStatus: formData.kycStatus,
                      updatedAt: new Date(),
                    }
                  : a
              )
            );
            notifySaved(`Updated teacher ${formData.name}`);
            return true;
          }

          const newTeacher: ArtisanRow = {
            id: `tch_${Date.now()}`,
            userId: null,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            trade: formData.trade,
            categoryId: null,
            serviceKey: "general",
            profileImage: "/images/landing/audience-teacher.svg",
            hourlyRate: formattedRate,
            hourlyRateNumeric: rateNum,
            about: `${formData.trade} at ${formData.city}`,
            skills: [formData.trade],
            portfolioImages: [],
            rating: 5.0,
            reviewsCount: 0,
            completedJobs: 0,
            distance: "Main Campus",
            city: formData.city,
            address: formData.city,
            latitude: 9.0765,
            longitude: 7.3986,
            isOnline: true,
            kycStatus: formData.kycStatus,
            ninNumber: formData.ninNumber,
            ninEncrypted: null,
            ninHash: null,
            kycSelfieUrl: null,
            kycIdDocumentUrl: null,
            kycIdType: "TRCN",
            kycRejectionReason: null,
            bankName: formData.bankName,
            bankAccountNumber: formData.bankAccountNumber,
            bankAccountName: formData.name,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setArtisans((prev) => [newTeacher, ...prev]);
          notifySaved(`Added teacher ${formData.name}`);
          return true;
        }

        if (formData.formGroup === "customer") {
          if (formData.editingId) {
            setCustomers((prev) =>
              prev.map((c) =>
                c.id === formData.editingId
                  ? {
                      ...c,
                      name: formData.name,
                      email: formData.email,
                      phone: formData.phone,
                      city: formData.city,
                      status: formData.customerStatus,
                    }
                  : c
              )
            );
            notifySaved(`Updated student ${formData.name}`);
            return true;
          }

          const newCustomer: CustomerRecord = {
            id: `cust_${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            bookingsCount: 0,
            status: formData.customerStatus,
            joinedAt: "Just now",
          };
          setCustomers((prev) => [newCustomer, ...prev]);
          notifySaved(`Enrolled student account for ${formData.name}`);
          return true;
        }

        if (formData.editingId) {
          setAdmins((prev) =>
            prev.map((adm) =>
              adm.id === formData.editingId
                ? {
                    ...adm,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    roleTitle: formData.roleTitle,
                    permissions: formData.permissions,
                    adminScope: formData.adminScope,
                    status: formData.adminStatus,
                  }
                : adm
            )
          );
          notifySaved(`Updated administrator ${formData.name}`);
          return true;
        }

        const newAdmin: AdminRecord = {
          id: `adm_${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roleTitle: formData.roleTitle,
          permissions: formData.permissions,
          adminScope: formData.adminScope,
          status: formData.adminStatus,
          lastActive: "Online now",
        };
        setAdmins((prev) => [newAdmin, ...prev]);
        notifySaved(`Added administrator ${formData.name}`);
        return true;
      } finally {
        setSaving(false);
      }
    },
    [notifySaved]
  );

  const batchVerifyArtisans = useCallback(
    (selectedIds: string[]) => {
      setArtisans((prev) =>
        prev.map((a) =>
          selectedIds.includes(a.id) ? { ...a, kycStatus: "verified" } : a
        )
      );
      notifySaved(`Verified ${selectedIds.length} teacher(s)`);
    },
    [notifySaved]
  );

  const batchDeleteArtisans = useCallback(
    (selectedIds: string[]) => {
      const count = selectedIds.length;
      setArtisans((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      notifySaved(`Removed ${count} teacher record(s)`);
    },
    [notifySaved]
  );

  return {
    artisans,
    setArtisans,
    customers,
    setCustomers,
    admins,
    setAdmins,
    busyId,
    saving,
    savedBanner,
    notifySaved,
    updateArtisanKyc,
    toggleArtisanOnline,
    deleteArtisan,
    toggleCustomerStatus,
    deleteCustomer,
    toggleAdminStatus,
    softDeleteAdmin,
    deleteAdmin,
    revokeUserSessions,
    resetUserPassword,
    resendAdminInvite,
    saveUser,
    batchVerifyArtisans,
    batchDeleteArtisans,
    batchDeleteCustomers,
    batchDeleteAdmins,
    counts,
  };
}
