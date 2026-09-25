import { ReservationWebsiteSettingsForm } from "@/components/dashboard/settings/ReservationWebsiteSettingsForm";
import { requireAdmin } from "@/features/rooms/authorization";
import {
  getHomepageRoomTypeOptions,
  getReservationSiteConfig,
} from "@/features/settings/queries";
import { selectDefaultFeaturedRoomTypeIds } from "@/lib/homepage-structure";

export default async function ReservationWebsiteSettingsPage() {
  await requireAdmin();
  const [config, roomTypeRecords] = await Promise.all([
    getReservationSiteConfig(),
    getHomepageRoomTypeOptions(),
  ]);
  const homepageRoomTypes = roomTypeRecords.map((roomType) => ({
    id: roomType.id,
    name: roomType.name,
    slug: roomType.slug,
    coverImage: roomType.coverImage,
    roomInventoryCount: roomType._count.rooms,
  }));
  const featuredRoomTypeIds =
    config.website.featuredRoomTypeIds.length > 0
      ? config.website.featuredRoomTypeIds
      : selectDefaultFeaturedRoomTypeIds(homepageRoomTypes);

  return (
    <ReservationWebsiteSettingsForm
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
        featuredRoomTypeIds,
        homepageRoomTypes,
        sectionVisibility: config.website.sectionVisibility,
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
