import type { PaymentFormData } from "./types";

export const CHANNEL_OPTIONS = [
  { id: "card", label: "Card" },
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "mobile_money", label: "School Portal" },
  { id: "usdt", label: "Invoice Credit" },
] as const;

export const ESCROW_STATE_OPTIONS = [
  { id: "held", label: "Pending Settlement" },
  { id: "released", label: "Active License" },
  { id: "pending", label: "Awaiting Payment" },
  { id: "refunded", label: "Credited Back" },
] as const;

export const DEFAULT_PAYMENT_FORM: PaymentFormData = {
  editingId: null,
  editingRef: null,
  clientName: "Greenfield Model Academy",
  clientEmail: "bursar@greenfield.examinify.ng",
  artisanName: "Full School Term License",
  amount: "150000",
  paymentMethod: "bank_transfer",
  escrowStatus: "held",
};

