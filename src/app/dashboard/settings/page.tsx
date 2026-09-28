import { SettingsOverview } from "@/components/dashboard/settings/SettingsOverview";
import { requireAdmin } from "@/features/rooms/authorization";
import { getReservationSiteConfig } from "@/features/settings/queries";

export default async function SettingsPage() {
  await requireAdmin();

  const config = await getReservationSiteConfig();

  return (
    <SettingsOverview
      currency={config.hotel.currency}
      customPolicyCount={Object.values(config.policies.configured).filter(
        (value) => value.trim().length > 0,
      ).length}
      heroImageCount={config.website.customHeroImages.length}
      hasCustomLogo={Boolean(config.branding.logoUrl)}
      hotelName={config.hotel.name}
      websiteTitle={config.website.configuredTitle}
    />
  );
}
