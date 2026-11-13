"use client";

import { useCallback, useState } from "react";
import type { BookingRow } from "@/components/admin/mock-data";
import type { BookingFormData } from "@/components/admin/exams/types";

export interface UseBookingsDispatchReturn {
  items: BookingRow[];
  setItems: React.Dispatch<React.SetStateAction<BookingRow[]>>;
  busyId: string | null;
  savedBanner: string | null;
  saving: boolean;
  notifySaved: (msg: string) => void;
  updateBookingFields: (
    id: string,
    patch: { status?: string; paymentStatus?: string }
  ) => Promise<void>;
  deleteBooking: (id: string, onDeleted?: () => void) => Promise<void>;
  saveBooking: (
    formData: BookingFormData,
    editingId: string | null,
    editingCode: string | null
  ) => Promise<boolean>;
  batchComplete: (selectedIds: string[]) => void;
  batchDelete: (selectedIds: string[]) => void;
}

export function useBookingsDispatch(
  initialBookings: BookingRow[]
): UseBookingsDispatchReturn {
  const [items, setItems] = useState<BookingRow[]>(initialBookings);
  const [busyId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const notifySaved = useCallback((msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(null), 3500);
  }, []);

  const updateBookingFields = useCallback(
    async (
      id: string,
      patch: { status?: string; paymentStatus?: string }
    ) => {
      setItems((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, ...patch, updatedAt: new Date() } : b
        )
      );
      notifySaved("Exam session updated");
    },
    [notifySaved]
  );

  const deleteBooking = useCallback(
    async (id: string, onDeleted?: () => void) => {
      setItems((prev) => prev.filter((b) => b.id !== id));
      onDeleted?.();
      notifySaved("Exam session removed from schedule");
    },
    [notifySaved]
  );

  const saveBooking = useCallback(
    async (
      formData: BookingFormData,
      editingId: string | null,
      editingCode: string | null
    ): Promise<boolean> => {
      setSaving(true);
      try {
        if (editingId) {
          const payload = {
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientPhone: formData.clientPhone,
            address: formData.address,
            serviceTitle: formData.serviceTitle,
            artisanName: formData.artisanName,
            scheduledDate: formData.scheduledDate,
            scheduledTime: formData.scheduledTime,
            agreedAmount: Number(formData.agreedAmount),
            status: formData.bookingStatus,
            paymentStatus: formData.paymentStatus,
            updatedAt: new Date(),
          };
          setItems((prev) =>
            prev.map((b) => (b.id === editingId ? { ...b, ...payload } : b))
          );
          notifySaved(`Updated exam session ${editingCode || editingId}`);
          return true;
        }

        const newBooking: BookingRow = {
          id: `exm_${Date.now()}`,
          bookingCode: `EXM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          clientId: null,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          artisanId: "tch_emeka",
          artisanName: formData.artisanName,
          categoryId: null,
          serviceTitle: formData.serviceTitle,
          description: formData.serviceTitle,
          status: formData.bookingStatus,
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime,
          address: formData.address,
          agreedAmount: Number(formData.agreedAmount),
          paymentStatus: formData.paymentStatus,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setItems((prev) => [newBooking, ...prev]);
        notifySaved(`Scheduled exam session for ${formData.clientName}`);
        return true;
      } finally {
        setSaving(false);
      }
    },
    [notifySaved]
  );

  const batchComplete = useCallback(
    (selectedIds: string[]) => {
      setItems((prev) =>
        prev.map((b) =>
          selectedIds.includes(b.id) ? { ...b, status: "completed" } : b
        )
      );
      notifySaved(`Marked ${selectedIds.length} exam session(s) as submitted`);
    },
    [notifySaved]
  );

  const batchDelete = useCallback(
    (selectedIds: string[]) => {
      const count = selectedIds.length;
      setItems((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      notifySaved(`Removed ${count} exam session(s)`);
    },
    [notifySaved]
  );

  return {
    items,
    setItems,
    busyId,
    savedBanner,
    saving,
    notifySaved,
    updateBookingFields,
    deleteBooking,
    saveBooking,
    batchComplete,
    batchDelete,
  };
}
