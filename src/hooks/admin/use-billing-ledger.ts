"use client";

import { useCallback, useMemo, useState } from "react";
import type { PaymentRow } from "@/components/admin/mock-data";
import type {
  EscrowStateOption,
  PaymentFormData,
} from "@/components/admin/billing/types";

export interface UsePaymentsEscrowReturn {
  items: PaymentRow[];
  setItems: React.Dispatch<React.SetStateAction<PaymentRow[]>>;
  releasingId: string | null;
  saving: boolean;
  savedBanner: string | null;
  notifySaved: (msg: string) => void;
  handleReleaseEscrow: (paymentId: string) => Promise<void>;
  updateEscrowStateLocal: (
    paymentId: string,
    nextEscrow: EscrowStateOption
  ) => void;
  deletePayment: (paymentId: string, onDeleted?: () => void) => void;
  savePayment: (formData: PaymentFormData) => Promise<boolean>;
  batchRelease: (selectedIds: string[]) => void;
  batchDelete: (selectedIds: string[]) => void;
  totalVolume: number;
  heldVolume: number;
  totalFee: number;
}

export function usePaymentsEscrow(
  initialPayments: PaymentRow[]
): UsePaymentsEscrowReturn {
  const [items, setItems] = useState<PaymentRow[]>(initialPayments);
  const [releasingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const notifySaved = useCallback((msg: string) => {
    setSavedBanner(msg);
    setTimeout(() => setSavedBanner(null), 3500);
  }, []);

  const totalVolume = useMemo(
    () => items.reduce((sum, p) => sum + p.amount, 0),
    [items]
  );
  const heldVolume = useMemo(
    () =>
      items
        .filter((p) => p.escrowStatus === "held")
        .reduce((sum, p) => sum + p.amount, 0),
    [items]
  );
  const totalFee = useMemo(
    () => items.reduce((sum, p) => sum + p.platformFee, 0),
    [items]
  );

  const handleReleaseEscrow = useCallback(
    async (paymentId: string) => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                escrowStatus: "released",
                status: "settled",
                releasedAt: new Date(),
              }
            : p
        )
      );
      notifySaved("School license settlement confirmed");
    },
    [notifySaved]
  );

  const updateEscrowStateLocal = useCallback(
    (paymentId: string, nextEscrow: EscrowStateOption) => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                escrowStatus: nextEscrow,
                status:
                  nextEscrow === "released"
                    ? "settled"
                    : nextEscrow === "held"
                      ? "escrowed"
                      : nextEscrow === "refunded"
                        ? "refunded"
                        : "initialized",
              }
            : p
        )
      );
      notifySaved(`Billing status updated to ${nextEscrow}`);
    },
    [notifySaved]
  );

  const deletePayment = useCallback(
    (paymentId: string, onDeleted?: () => void) => {
      setItems((prev) => prev.filter((p) => p.id !== paymentId));
      onDeleted?.();
      notifySaved("Billing invoice record removed");
    },
    [notifySaved]
  );

  const savePayment = useCallback(
    async (formData: PaymentFormData): Promise<boolean> => {
      setSaving(true);
      try {
        const gross = Number(formData.amount) || 0;
        const artisanPayout = Math.round(gross * 0.9);
        const platformFee = Math.round(gross * 0.1);
        const resolvedStatus =
          formData.escrowStatus === "released"
            ? "settled"
            : formData.escrowStatus === "held"
              ? "escrowed"
              : formData.escrowStatus === "refunded"
                ? "refunded"
                : "initialized";

        if (formData.editingId) {
          setItems((prev) =>
            prev.map((p) =>
              p.id === formData.editingId
                ? {
                    ...p,
                    clientName: formData.clientName,
                    clientEmail: formData.clientEmail,
                    artisanName: formData.artisanName,
                    amount: gross,
                    artisanPayout,
                    platformFee,
                    paymentMethod: formData.paymentMethod,
                    escrowStatus: formData.escrowStatus,
                    status: resolvedStatus,
                  }
                : p
            )
          );
          notifySaved(
            `Updated billing invoice ${formData.editingRef || formData.editingId}`
          );
          return true;
        }

        const newPayment: PaymentRow = {
          id: `pay_${Date.now()}`,
          reference: `EXM-INV-${Date.now().toString().slice(-6)}`,
          bachsTransactionId: `bchs_${Date.now().toString().slice(-6)}`,
          bookingId: null,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          artisanId: "tch_emeka",
          artisanName: formData.artisanName,
          amount: gross,
          platformFee,
          artisanPayout,
          currency: "NGN",
          paymentMethod: formData.paymentMethod,
          status: resolvedStatus,
          escrowStatus: formData.escrowStatus,
          checkoutUrl: null,
          metadata: {},
          paidAt: new Date(),
          releasedAt:
            formData.escrowStatus === "released" ? new Date() : null,
          createdAt: new Date(),
        };
        setItems((prev) => [newPayment, ...prev]);
        notifySaved(`Recorded license invoice for ${formData.clientName}`);
        return true;
      } finally {
        setSaving(false);
      }
    },
    [notifySaved]
  );

  const batchRelease = useCallback(
    (selectedIds: string[]) => {
      setItems((prev) =>
        prev.map((p) =>
          selectedIds.includes(p.id)
            ? {
                ...p,
                escrowStatus: "released",
                status: "settled",
                releasedAt: new Date(),
              }
            : p
        )
      );
      notifySaved(`Activated ${selectedIds.length} license settlement(s)`);
    },
    [notifySaved]
  );

  const batchDelete = useCallback(
    (selectedIds: string[]) => {
      const count = selectedIds.length;
      setItems((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      notifySaved(`Removed ${count} billing invoice(s)`);
    },
    [notifySaved]
  );

  return {
    items,
    setItems,
    releasingId,
    saving,
    savedBanner,
    notifySaved,
    handleReleaseEscrow,
    updateEscrowStateLocal,
    deletePayment,
    savePayment,
    batchRelease,
    batchDelete,
    totalVolume,
    heldVolume,
    totalFee,
  };
}
