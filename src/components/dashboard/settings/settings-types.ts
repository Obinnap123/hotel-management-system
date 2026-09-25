import type {
  ReservationColorScheme,
  ReservationThemeSettings,
  ReservationTypographyPreset,
} from "@/lib/reservation-theme";
import type { ReservationWebsiteCopy } from "@/lib/reservation-content";
import type { ReservationFacility } from "@/lib/reservation-facilities";
import type { HomepageSectionVisibility } from "@/lib/homepage-structure";

export type HomepageRoomTypeOption = {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  roomInventoryCount: number;
};

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
  featuredRoomTypeIds: string[];
  homepageRoomTypes: HomepageRoomTypeOption[];
  sectionVisibility: HomepageSectionVisibility;
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
