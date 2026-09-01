import { ReservationWebsiteSettingsForm } from "@/components/dashboard/settings/ReservationWebsiteSettingsForm";
import { requireAdmin } from "@/features/rooms/authorization";
import { getReservationSiteConfig } from "@/features/settings/queries";

export default async function ReservationWebsiteSettingsPage() {
  await requireAdmin();
  const config = await getReservationSiteConfig();

  return (
    <ReservationWebsiteSettingsForm
      key={config.website.updatedAt.toISOString()}
      settings={{
        hotelName: config.hotel.name,
        websiteTitle: config.website.configuredTitle,
        websiteDescription: config.website.configuredDescription,
        configuredCopy: config.website.configuredCopy,
        defaultCopy: config.website.defaultCopy,
        heroImages: config.website.customHeroImages.map((image) => image.url),
        heroImagePublicIds: config.website.customHeroImages.map(
          (image) => image.storageId ?? "",
        ),
        facilities: config.website.facilities,
        aboutImage: config.website.aboutImage,
        updatedAt: config.website.updatedAt.toISOString(),
        preview: {
          primaryColor: config.branding.primaryColor,
          accentColor: config.branding.accentColor,
          typographyPreset: config.branding.typographyPreset,
          colorScheme: config.branding.colorScheme,
          heroImageUrl: config.website.heroImages[0]?.url ?? "",
          aboutImageUrl: config.website.aboutImage.url,
          phoneNumber: config.hotel.phoneNumber,
          emailAddress: config.hotel.emailAddress,
          physicalAddress: config.hotel.physicalAddress,
        },
      }}
    />
  );
}
