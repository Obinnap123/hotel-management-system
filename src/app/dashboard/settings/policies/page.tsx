import { HotelPolicySettingsForm } from "@/components/dashboard/settings/HotelPolicySettingsForm";
import { requireAdmin } from "@/features/rooms/authorization";
import { getReservationSiteConfig } from "@/features/settings/queries";

export default async function HotelPoliciesSettingsPage() {
  await requireAdmin();
  const config = await getReservationSiteConfig();

  return (
    <HotelPolicySettingsForm
      defaults={config.policies.defaults}
      settings={config.policies.configured}
    />
  );
}
