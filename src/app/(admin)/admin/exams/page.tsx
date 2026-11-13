import { BookingsDispatchWorkspace } from "@/components/admin/composites/exams-workspace";
import { MOCK_BOOKINGS } from "@/components/admin/mock-data";

export default function AdminBookingsPage() {
  return <BookingsDispatchWorkspace initialBookings={MOCK_BOOKINGS} />;
}
