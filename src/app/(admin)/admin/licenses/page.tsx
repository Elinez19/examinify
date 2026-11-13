import { PaymentsEscrowWorkspace } from "@/components/admin/composites/billing-workspace";
import { MOCK_PAYMENTS } from "@/components/admin/mock-data";

export default function AdminPaymentsPage() {
  return <PaymentsEscrowWorkspace initialPayments={MOCK_PAYMENTS} />;
}
