import type {
  ArtisanRow,
  BookingRow,
  CategoryRow,
  PaymentRow,
} from "@/components/admin/mock-data";

export interface OverviewDashboardProps {
  artisans: ArtisanRow[];
  bookings: BookingRow[];
  payments: PaymentRow[];
  categories: CategoryRow[];
}

export interface OverviewKpiData {
  totalGmv: number;
  totalCommission: number;
  escrowHeldAmount: number;
  totalBookingsCount: number;
  categoriesCount: number;
  verifiedArtisansCount: number;
  pendingKycArtisansCount: number;
}

