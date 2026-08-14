import { ReservationWebsiteSettingsForm } from "@/components/dashboard/settings/ReservationWebsiteSettingsForm";
import { requireAdmin } from "@/features/rooms/authorization";
import { getReservationSiteConfig } from "@/features/settings/queries";

export default async function ReservationWebsiteSettingsPage() {
  await requireAdmin();
  const config = await getReservationSiteConfig();

  return (
    <ReservationWebsiteSettingsForm
      settings={{
        hotelName: config.hotel.name,
        websiteTitle: config.website.configuredTitle,
        websiteDescription: config.website.configuredDescription,
        heroImages: config.website.customHeroImages.map((image) => image.url),
        heroImagePublicIds: config.website.customHeroImages.map(
          (image) => image.storageId ?? "",
        ),
        updatedAt: config.website.updatedAt.toISOString(),
      }}
    />
  );
}
