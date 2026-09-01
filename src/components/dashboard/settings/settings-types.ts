import type {
  ReservationColorScheme,
  ReservationThemeSettings,
  ReservationTypographyPreset,
} from "@/lib/reservation-theme";
import type { ReservationWebsiteCopy } from "@/lib/reservation-content";
import type { ReservationFacility } from "@/lib/reservation-facilities";

export type HotelProfileSettingsValues = {
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  currency: string;
};

export type ReservationWebsiteSettingsValues = {
  hotelName: string;
  websiteTitle: string;
  websiteDescription: string;
  configuredCopy: ReservationWebsiteCopy;
  defaultCopy: ReservationWebsiteCopy;
  heroImages: string[];
  heroImagePublicIds: string[];
  facilities: ReservationFacility[];
  aboutImage: {
    url: string;
    defaultUrl: string;
    storageId: string | null;
    alternativeText: string;
    isDefault: boolean;
  };
  updatedAt: string;
  preview: ReservationThemeSettings & {
    emailAddress: string;
    heroImageUrl: string;
    aboutImageUrl: string;
    phoneNumber: string;
    physicalAddress: string;
  };
};

export type BrandingSettingsValues = {
  logoUrl: string | null;
  lightLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  typographyPreset: ReservationTypographyPreset;
  colorScheme: ReservationColorScheme;
};
