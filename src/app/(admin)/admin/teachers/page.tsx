import { ArtisansKycWorkspace } from "@/components/admin/composites/users-workspace";
import { MOCK_ARTISANS } from "@/components/admin/mock-data";

export default function AdminArtisansPage() {
  return (
    <ArtisansKycWorkspace
      initialArtisans={MOCK_ARTISANS}
      defaultTab="artisans_all"
    />
  );
}
