import {
  defaultReservationThemeSettings,
  normalizeReservationThemeSettings,
  type ReservationColorScheme,
  type ReservationTypographyPreset,
} from "@/lib/reservation-theme";
import {
  createDefaultReservationWebsiteCopy,
  resolveReservationWebsiteCopy,
  type ReservationWebsiteCopy,
} from "@/lib/reservation-content";
import {
  defaultReservationFacilities,
  isReservationFacilityIconKey,
  type ReservationFacility,
} from "@/lib/reservation-facilities";

export const defaultReservationHeroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=88",
] as const;

export const defaultReservationBranding = defaultReservationThemeSettings;

export const defaultReservationAboutImage =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1500&q=86";

export type ReservationHeroImage = {
  id: string;
  url: string;
  storageId: string | null;
  displayOrder: number;
  alternativeText: string;
  isDefault: boolean;
};

export type ReservationSiteConfig = {
  hotel: {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    physicalAddress: string;
    defaultCheckInTime: string;
    defaultCheckOutTime: string;
    currency: string;
  };
  website: {
    configuredTitle: string;
    configuredDescription: string;
    configuredCopy: ReservationWebsiteCopy;
    defaultCopy: ReservationWebsiteCopy;
    copy: ReservationWebsiteCopy;
    title: string;
    description: string;
    customHeroImages: ReservationHeroImage[];
    heroImages: ReservationHeroImage[];
    configuredFacilities: ReservationFacility[];
    facilities: ReservationFacility[];
    aboutImage: {
      url: string;
      defaultUrl: string;
      storageId: string | null;
      alternativeText: string;
      isDefault: boolean;
    };
    updatedAt: Date;
  };
  branding: {
    logoUrl: string | null;
    logoStorageId: string | null;
    lightLogoUrl: string | null;
    lightLogoStorageId: string | null;
    faviconUrl: string | null;
    faviconStorageId: string | null;
    primaryColor: string;
    accentColor: string;
    typographyPreset: ReservationTypographyPreset;
    colorScheme: ReservationColorScheme;
  };
};

type HotelSettingsSource = {
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  currency: string;
  updatedAt: Date;
};

type WebsiteContentSource = {
  websiteTitle: string;
  websiteDescription: string;
  updatedAt: Date;
  heroImages: Array<{
    id: string;
    imageUrl: string;
    storagePublicId: string | null;
    displayOrder: number;
    alternativeText: string;
  }>;
  facilities?: Array<{
    id: string;
    title: string;
    description: string;
    iconKey: string;
    displayOrder: number;
  }>;
  aboutImageUrl?: string | null;
  aboutImagePublicId?: string | null;
  aboutImageAlt?: string;
} & Partial<ReservationWebsiteCopy> | null;

type BrandingSettingsSource = {
  logoUrl: string | null;
  logoPublicId: string | null;
  lightLogoUrl: string | null;
  lightLogoPublicId: string | null;
  faviconUrl: string | null;
  faviconPublicId: string | null;
  primaryColor: string;
  accentColor: string;
  typographyPreset: string;
  colorScheme: string;
} | null;

export function buildReservationSiteConfig({
  branding,
  hotel,
  website,
}: {
  branding: BrandingSettingsSource;
  hotel: HotelSettingsSource;
  website: WebsiteContentSource;
}): ReservationSiteConfig {
  const hotelName = hotel.hotelName.trim() || "Our Hotel";
  const configuredTitle = website?.websiteTitle ?? "";
  const configuredDescription = website?.websiteDescription ?? "";
  const configuredCopy: ReservationWebsiteCopy = {
    heroEyebrow: website?.heroEyebrow ?? "",
    heroHeading: website?.heroHeading ?? "",
    heroDescription: website?.heroDescription ?? "",
    heroPrimaryCtaLabel: website?.heroPrimaryCtaLabel ?? "",
    heroSecondaryCtaLabel: website?.heroSecondaryCtaLabel ?? "",
    featuredEyebrow: website?.featuredEyebrow ?? "",
    featuredHeading: website?.featuredHeading ?? "",
    featuredDescription: website?.featuredDescription ?? "",
    featuredCtaLabel: website?.featuredCtaLabel ?? "",
    amenitiesEyebrow: website?.amenitiesEyebrow ?? "",
    amenitiesHeading: website?.amenitiesHeading ?? "",
    amenitiesDescription: website?.amenitiesDescription ?? "",
    aboutEyebrow: website?.aboutEyebrow ?? "",
    aboutHeading: website?.aboutHeading ?? "",
    aboutBodyPrimary: website?.aboutBodyPrimary ?? "",
    aboutBodySecondary: website?.aboutBodySecondary ?? "",
    aboutImageCaption: website?.aboutImageCaption ?? "",
    roomsEyebrow: website?.roomsEyebrow ?? "",
    roomsHeading: website?.roomsHeading ?? "",
    roomsDescription: website?.roomsDescription ?? "",
    footerEyebrow: website?.footerEyebrow ?? "",
    footerHeading: website?.footerHeading ?? "",
    footerCtaLabel: website?.footerCtaLabel ?? "",
  };
  const defaultCopy = createDefaultReservationWebsiteCopy(hotelName);
  const customHeroImages = (website?.heroImages ?? [])
    .filter((image) => image.imageUrl.trim().length > 0)
    .sort((first, second) => first.displayOrder - second.displayOrder)
    .map((image) => ({
      id: image.id,
      url: image.imageUrl,
      storageId: image.storagePublicId,
      displayOrder: image.displayOrder,
      alternativeText: image.alternativeText,
      isDefault: false,
    }));

  const heroImages =
    customHeroImages.length > 0
      ? customHeroImages
      : defaultReservationHeroImages.map((url, displayOrder) => ({
          id: `default-hero-${displayOrder + 1}`,
          url,
          storageId: null,
          displayOrder,
          alternativeText: "",
          isDefault: true,
        }));
  const configuredFacilities = (website?.facilities ?? [])
    .sort((first, second) => first.displayOrder - second.displayOrder)
    .flatMap((facility): ReservationFacility[] => {
      if (!isReservationFacilityIconKey(facility.iconKey)) return [];

      return [
        {
          id: facility.id,
          title: facility.title,
          description: facility.description,
          iconKey: facility.iconKey,
          displayOrder: facility.displayOrder,
        },
      ];
    });
  const facilities =
    configuredFacilities.length > 0
      ? configuredFacilities
      : defaultReservationFacilities.map((facility) => ({ ...facility }));
  const configuredAboutImageUrl = website?.aboutImageUrl?.trim() ?? "";
  const aboutImageIsDefault = configuredAboutImageUrl.length === 0;
  const aboutImage = {
    url: aboutImageIsDefault
      ? defaultReservationAboutImage
      : configuredAboutImageUrl,
    defaultUrl: defaultReservationAboutImage,
    storageId: aboutImageIsDefault
      ? null
      : (website?.aboutImagePublicId ?? null),
    alternativeText:
      website?.aboutImageAlt?.trim() || `A welcoming lounge at ${hotelName}`,
    isDefault: aboutImageIsDefault,
  };
  const theme = normalizeReservationThemeSettings({
    primaryColor: branding?.primaryColor,
    accentColor: branding?.accentColor,
    typographyPreset: branding?.typographyPreset,
    colorScheme: branding?.colorScheme,
  });

  return {
    hotel: {
      name: hotelName,
      phoneNumber: hotel.phoneNumber,
      emailAddress: hotel.emailAddress,
      physicalAddress: hotel.physicalAddress,
      defaultCheckInTime: hotel.defaultCheckInTime,
      defaultCheckOutTime: hotel.defaultCheckOutTime,
      currency: hotel.currency,
    },
    website: {
      configuredTitle,
      configuredDescription,
      configuredCopy,
      defaultCopy,
      copy: resolveReservationWebsiteCopy(configuredCopy, defaultCopy),
      title:
        configuredTitle.trim() ||
        `${hotelName} | Official Website & Reservations`,
      description:
        configuredDescription.trim() ||
        `Explore rooms, check availability, and book your stay directly with ${hotelName}.`,
      customHeroImages,
      heroImages,
      configuredFacilities,
      facilities,
      aboutImage,
      updatedAt: website?.updatedAt ?? hotel.updatedAt,
    },
    branding: {
      logoUrl: branding?.logoUrl ?? null,
      logoStorageId: branding?.logoPublicId ?? null,
      lightLogoUrl: branding?.lightLogoUrl ?? null,
      lightLogoStorageId: branding?.lightLogoPublicId ?? null,
      faviconUrl: branding?.faviconUrl ?? null,
      faviconStorageId: branding?.faviconPublicId ?? null,
      ...theme,
    },
  };
}
