export const defaultReservationHeroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=88",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=88",
] as const;

export const defaultReservationBranding = {
  primaryColor: "#173B32",
  accentColor: "#E5D2A9",
  typographyPreset: "EDITORIAL",
  colorScheme: "LIGHT",
} as const;

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
    title: string;
    description: string;
    customHeroImages: ReservationHeroImage[];
    heroImages: ReservationHeroImage[];
    updatedAt: Date;
  };
  branding: {
    logoUrl: string | null;
    logoStorageId: string | null;
    faviconUrl: string | null;
    faviconStorageId: string | null;
    primaryColor: string;
    accentColor: string;
    typographyPreset: string;
    colorScheme: string;
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
} | null;

type BrandingSettingsSource = {
  logoUrl: string | null;
  logoPublicId: string | null;
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
      title:
        configuredTitle.trim() ||
        `${hotelName} | Official Website & Reservations`,
      description:
        configuredDescription.trim() ||
        `Explore rooms, check availability, and book your stay directly with ${hotelName}.`,
      customHeroImages,
      heroImages,
      updatedAt: website?.updatedAt ?? hotel.updatedAt,
    },
    branding: {
      logoUrl: branding?.logoUrl ?? null,
      logoStorageId: branding?.logoPublicId ?? null,
      faviconUrl: branding?.faviconUrl ?? null,
      faviconStorageId: branding?.faviconPublicId ?? null,
      primaryColor:
        branding?.primaryColor || defaultReservationBranding.primaryColor,
      accentColor:
        branding?.accentColor || defaultReservationBranding.accentColor,
      typographyPreset:
        branding?.typographyPreset ||
        defaultReservationBranding.typographyPreset,
      colorScheme:
        branding?.colorScheme || defaultReservationBranding.colorScheme,
    },
  };
}
