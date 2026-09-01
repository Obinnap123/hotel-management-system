import { BrandingSettingsForm } from "@/components/dashboard/settings/BrandingSettingsForm";
import { requireAdmin } from "@/features/rooms/authorization";
import { getReservationSiteConfig } from "@/features/settings/queries";

export default async function BrandingSettingsPage() {
  await requireAdmin();
  const config = await getReservationSiteConfig();

  return (
    <BrandingSettingsForm
      settings={{
        logoUrl: config.branding.logoUrl,
        lightLogoUrl: config.branding.lightLogoUrl,
        faviconUrl: config.branding.faviconUrl,
        primaryColor: config.branding.primaryColor,
        accentColor: config.branding.accentColor,
        typographyPreset: config.branding.typographyPreset,
        colorScheme: config.branding.colorScheme,
      }}
    />
  );
}
