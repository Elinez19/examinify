import { ArtisansKycWorkspace } from "@/components/admin/composites/users-workspace";
import { MOCK_ARTISANS } from "@/components/admin/mock-data";

export default function AdminUserManagementPage() {
  return (
    <ArtisansKycWorkspace
      initialArtisans={MOCK_ARTISANS}
      defaultTab="customers"
    />
  );
}
