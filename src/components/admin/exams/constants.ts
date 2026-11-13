import type { BookingFormData } from "./types";

export const BOOKING_STATUS_OPTIONS = [
  { id: "pending", label: "Scheduled" },
  { id: "accepted", label: "Ready" },
  { id: "in_progress", label: "In Session" },
  { id: "completed", label: "Submitted" },
  { id: "cancelled", label: "Paused" },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { id: "unpaid", label: "Unverified" },
  { id: "escrowed", label: "Offline Ready" },
  { id: "released", label: "Graded" },
  { id: "refunded", label: "Appealed" },
] as const;

export const DEFAULT_BOOKING_FORM: BookingFormData = {
  clientName: "Amina Bello",
  clientEmail: "amina.bello@students.examinify.ng",
  clientPhone: "+234 809 332 1104",
  address: "CBT Lab B · Main Campus, Abuja",
  serviceTitle: "JSS 3 Mathematics First Term CBT",
  artisanName: "Mr. Emeka Okafor",
  scheduledDate: "2026-11-10",
  scheduledTime: "10:30 AM",
  agreedAmount: "60",
  bookingStatus: "pending",
  paymentStatus: "escrowed",
};

