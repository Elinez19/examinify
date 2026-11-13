import { OverviewDashboard } from "@/components/admin/composites/overview-dashboard";
import {
  MOCK_ARTISANS,
  MOCK_BOOKINGS,
  MOCK_CATEGORIES,
  MOCK_PAYMENTS,
} from "@/components/admin/mock-data";

export default function AdminOverviewPage() {
  return (
    <OverviewDashboard
      artisans={MOCK_ARTISANS}
      bookings={MOCK_BOOKINGS}
      payments={MOCK_PAYMENTS}
      categories={MOCK_CATEGORIES}
    />
  );
}
