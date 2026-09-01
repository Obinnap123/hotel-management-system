import { z } from "zod";
import { isSupportedCurrencyCode } from "@/lib/currency";
import {
  reservationColorSchemeValues,
  reservationTypographyPresetValues,
} from "@/lib/reservation-theme";
import { reservationWebsiteCopyLimits } from "@/lib/reservation-content";
import {
  reservationFacilityIconKeys,
  reservationFacilityLimits,
} from "@/lib/reservation-facilities";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const hotelProfileSettingsSchema = z.object({
  hotelName: z.string().trim().min(1, "Hotel name is required."),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  emailAddress: z.email("Enter a valid email address.").trim().toLowerCase(),
  physicalAddress: z.string().trim().min(1, "Physical address is required."),
  defaultCheckInTime: z
    .string()
    .regex(timePattern, "Enter a valid default check-in time."),
  defaultCheckOutTime: z
    .string()
    .regex(timePattern, "Enter a valid default check-out time."),
  currency: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .refine(
      (value) => isSupportedCurrencyCode(value),
      "Choose a supported currency.",
    ),
});

const websiteCopyField = (label: string, maximumLength: number) =>
  z
    .string()
    .trim()
    .max(
      maximumLength,
      `${label} must be ${maximumLength} characters or fewer.`,
    );

export const reservationWebsiteSettingsSchema = z.object({
  websiteTitle: z
    .string()
    .trim()
    .max(60, "Website title must be 60 characters or fewer."),
  websiteDescription: z
    .string()
    .trim()
    .max(160, "Website description must be 160 characters or fewer."),
  heroEyebrow: websiteCopyField(
    "Hero welcome text",
    reservationWebsiteCopyLimits.heroEyebrow,
  ),
  heroHeading: websiteCopyField(
    "Hero heading",
    reservationWebsiteCopyLimits.heroHeading,
  ),
  heroDescription: websiteCopyField(
    "Hero description",
    reservationWebsiteCopyLimits.heroDescription,
  ),
  heroPrimaryCtaLabel: websiteCopyField(
    "Hero primary button",
    reservationWebsiteCopyLimits.heroPrimaryCtaLabel,
  ),
  heroSecondaryCtaLabel: websiteCopyField(
    "Hero secondary button",
    reservationWebsiteCopyLimits.heroSecondaryCtaLabel,
  ),
  featuredEyebrow: websiteCopyField(
    "Featured rooms label",
    reservationWebsiteCopyLimits.featuredEyebrow,
  ),
  featuredHeading: websiteCopyField(
    "Featured rooms heading",
    reservationWebsiteCopyLimits.featuredHeading,
  ),
  featuredDescription: websiteCopyField(
    "Featured rooms description",
    reservationWebsiteCopyLimits.featuredDescription,
  ),
  featuredCtaLabel: websiteCopyField(
    "Featured rooms link",
    reservationWebsiteCopyLimits.featuredCtaLabel,
  ),
  amenitiesEyebrow: websiteCopyField(
    "Amenities label",
    reservationWebsiteCopyLimits.amenitiesEyebrow,
  ),
  amenitiesHeading: websiteCopyField(
    "Amenities heading",
    reservationWebsiteCopyLimits.amenitiesHeading,
  ),
  amenitiesDescription: websiteCopyField(
    "Amenities description",
    reservationWebsiteCopyLimits.amenitiesDescription,
  ),
  aboutEyebrow: websiteCopyField(
    "About section label",
    reservationWebsiteCopyLimits.aboutEyebrow,
  ),
  aboutHeading: websiteCopyField(
    "About section heading",
    reservationWebsiteCopyLimits.aboutHeading,
  ),
  aboutBodyPrimary: websiteCopyField(
    "First About Hotel paragraph",
    reservationWebsiteCopyLimits.aboutBodyPrimary,
  ),
  aboutBodySecondary: websiteCopyField(
    "Second About Hotel paragraph",
    reservationWebsiteCopyLimits.aboutBodySecondary,
  ),
  aboutImageCaption: websiteCopyField(
    "About image caption",
    reservationWebsiteCopyLimits.aboutImageCaption,
  ),
  roomsEyebrow: websiteCopyField(
    "Rooms page label",
    reservationWebsiteCopyLimits.roomsEyebrow,
  ),
  roomsHeading: websiteCopyField(
    "Rooms page heading",
    reservationWebsiteCopyLimits.roomsHeading,
  ),
  roomsDescription: websiteCopyField(
    "Rooms page description",
    reservationWebsiteCopyLimits.roomsDescription,
  ),
  footerEyebrow: websiteCopyField(
    "Footer label",
    reservationWebsiteCopyLimits.footerEyebrow,
  ),
  footerHeading: websiteCopyField(
    "Footer heading",
    reservationWebsiteCopyLimits.footerHeading,
  ),
  footerCtaLabel: websiteCopyField(
    "Footer button",
    reservationWebsiteCopyLimits.footerCtaLabel,
  ),
  aboutImageAlt: z
    .string()
    .trim()
    .max(120, "About image description must be 120 characters or fewer.")
    .default(""),
});

export const reservationFacilitiesSchema = z
  .array(
    z.object({
      title: z
        .string()
        .trim()
        .min(1, "Every facility needs a title.")
        .max(
          reservationFacilityLimits.title,
          `Facility titles must be ${reservationFacilityLimits.title} characters or fewer.`,
        ),
      description: z
        .string()
        .trim()
        .min(1, "Every facility needs a short description.")
        .max(
          reservationFacilityLimits.description,
          `Facility descriptions must be ${reservationFacilityLimits.description} characters or fewer.`,
        ),
      iconKey: z.enum(reservationFacilityIconKeys),
      displayOrder: z.number().int().min(0),
    }),
  )
  .min(
    reservationFacilityLimits.minimum,
    "Keep at least one homepage facility.",
  )
  .max(
    reservationFacilityLimits.maximum,
    `Use no more than ${reservationFacilityLimits.maximum} homepage facilities.`,
  );

const brandColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9a-f]{6}$/i, "Enter a six-digit hexadecimal colour.")
  .transform((value) => value.toUpperCase());

export const brandingThemeSettingsSchema = z.object({
  primaryColor: brandColorSchema,
  accentColor: brandColorSchema,
  typographyPreset: z.enum(reservationTypographyPresetValues),
  colorScheme: z.enum(reservationColorSchemeValues),
});
