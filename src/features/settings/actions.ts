"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/rooms/authorization";
import {
  deleteHotelImage,
  uploadHotelImage,
} from "@/lib/cloudinary/upload";
import { prisma } from "@/server/db/prisma";
import {
  brandingThemeSettingsSchema,
  hotelProfileSettingsSchema,
  reservationFacilitiesSchema,
  reservationWebsiteSettingsSchema,
} from "./validation";

const settingsPath = "/dashboard/settings";
const hotelProfilePath = `${settingsPath}/hotel-profile`;
const brandingPath = `${settingsPath}/branding`;
const reservationWebsitePath = `${settingsPath}/reservation-website`;
const brandingImageFolder = "hotel-management-system/branding";
const heroImageFolder = "hotel-management-system/reservation-hero";
const aboutImageFolder = "hotel-management-system/reservation-about";
const maximumHeroImages = 4;

export type SettingsActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function updateHotelProfileSettingsAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = hotelProfileSettingsSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid settings details.",
    );
  }

  try {
    await prisma.hotelSettings.upsert({
      where: {
        singletonKey: "default",
      },
      update: parsed.data,
      create: {
        singletonKey: "default",
        ...parsed.data,
      },
    });
  } catch (error) {
    return failure(
      error instanceof Error
        ? error.message
        : "Unable to update the hotel profile.",
    );
  }

  revalidatePath(settingsPath);
  revalidatePath(hotelProfilePath);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/demo", "layout");
  revalidatePath("/");
  return success("Hotel profile updated.");
}

export async function updateReservationWebsiteSettingsAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = reservationWebsiteSettingsSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid website settings.",
    );
  }

  const facilities = parseFacilities(formData.get("facilities"));

  if (!facilities.ok) {
    return failure(facilities.message);
  }

  const uploadedPublicIds: string[] = [];
  const legacyWebsiteMetadata = {
    websiteTitle: parsed.data.websiteTitle,
    websiteDescription: parsed.data.websiteDescription,
  };

  try {
    const [currentSettings, currentWebsite] = await Promise.all([
      prisma.hotelSettings.findUnique({
        where: { singletonKey: "default" },
        select: { heroImagePublicIds: true },
      }),
      prisma.websiteContent.findUnique({
        where: { singletonKey: "default" },
        select: { aboutImageUrl: true, aboutImagePublicId: true },
      }),
    ]);
    const heroMedia = await resolveHeroMedia(formData, uploadedPublicIds);
    const aboutImage = await resolveBrandingMedia({
      currentPublicId: currentWebsite?.aboutImagePublicId ?? null,
      currentUrl: currentWebsite?.aboutImageUrl ?? null,
      fileField: "aboutImage",
      folder: aboutImageFolder,
      formData,
      label: "About Hotel image",
      removeField: "removeAboutImage",
      uploadedPublicIds,
    });

    await prisma.$transaction(async (transaction) => {
      const websiteContent = await transaction.websiteContent.upsert({
        where: {
          singletonKey: "default",
        },
        update: {
          ...parsed.data,
          aboutImageUrl: aboutImage.url,
          aboutImagePublicId: aboutImage.publicId,
        },
        create: {
          singletonKey: "default",
          ...parsed.data,
          aboutImageUrl: aboutImage.url,
          aboutImagePublicId: aboutImage.publicId,
        },
      });

      await transaction.websiteHeroImage.deleteMany({
        where: { websiteContentId: websiteContent.id },
      });

      if (heroMedia.urls.length > 0) {
        await transaction.websiteHeroImage.createMany({
          data: heroMedia.urls.map((imageUrl, displayOrder) => ({
            imageUrl,
            storagePublicId: heroMedia.publicIds[displayOrder] || null,
            displayOrder,
            websiteContentId: websiteContent.id,
          })),
        });
      }

      await transaction.websiteFacility.deleteMany({
        where: { websiteContentId: websiteContent.id },
      });

      await transaction.websiteFacility.createMany({
        data: facilities.data.map((facility, displayOrder) => ({
          title: facility.title,
          description: facility.description,
          iconKey: facility.iconKey,
          displayOrder,
          websiteContentId: websiteContent.id,
        })),
      });

      await transaction.hotelSettings.upsert({
        where: {
          singletonKey: "default",
        },
        update: {
          ...legacyWebsiteMetadata,
          heroImages: heroMedia.urls,
          heroImagePublicIds: heroMedia.publicIds,
        },
        create: {
          singletonKey: "default",
          ...legacyWebsiteMetadata,
          heroImages: heroMedia.urls,
          heroImagePublicIds: heroMedia.publicIds,
        },
      });
    });

    const nextPublicIds = new Set(heroMedia.publicIds.filter(Boolean));
    await Promise.allSettled(
      (currentSettings?.heroImagePublicIds ?? [])
        .filter((publicId) => publicId && !nextPublicIds.has(publicId))
        .map((publicId) => deleteHotelImage(publicId)),
    );
    if (
      currentWebsite?.aboutImagePublicId &&
      currentWebsite.aboutImagePublicId !== aboutImage.publicId
    ) {
      await deleteHotelImage(currentWebsite.aboutImagePublicId);
    }
  } catch (error) {
    await Promise.allSettled(
      uploadedPublicIds.map((publicId) => deleteHotelImage(publicId)),
    );
    return failure(
      error instanceof Error
        ? error.message
        : "Unable to update the reservation website.",
    );
  }

  revalidatePath(settingsPath);
  revalidatePath(reservationWebsitePath);
  revalidatePath("/demo", "layout");
  revalidatePath("/");
  return success("Reservation website updated.");
}

export async function updateBrandingSettingsAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsedTheme = brandingThemeSettingsSchema.safeParse(
    Object.fromEntries(
      ["primaryColor", "accentColor", "typographyPreset", "colorScheme"].map(
        (field) => [field, formData.get(field)],
      ),
    ),
  );

  if (!parsedTheme.success) {
    return failure(
      parsedTheme.error.issues[0]?.message ?? "Invalid branding theme.",
    );
  }

  const uploadedPublicIds: string[] = [];

  try {
    const current = await prisma.brandingSettings.findUnique({
      where: { singletonKey: "default" },
    });
    const logo = await resolveBrandingMedia({
      currentPublicId: current?.logoPublicId ?? null,
      currentUrl: current?.logoUrl ?? null,
      fileField: "logo",
      formData,
      label: "main logo",
      removeField: "removeLogo",
      uploadedPublicIds,
    });
    const lightLogo = await resolveBrandingMedia({
      currentPublicId: current?.lightLogoPublicId ?? null,
      currentUrl: current?.lightLogoUrl ?? null,
      fileField: "lightLogo",
      formData,
      label: "light logo",
      removeField: "removeLightLogo",
      uploadedPublicIds,
    });
    const favicon = await resolveBrandingMedia({
      currentPublicId: current?.faviconPublicId ?? null,
      currentUrl: current?.faviconUrl ?? null,
      fileField: "favicon",
      formData,
      label: "favicon",
      removeField: "removeFavicon",
      uploadedPublicIds,
    });

    await prisma.brandingSettings.upsert({
      where: { singletonKey: "default" },
      update: {
        ...parsedTheme.data,
        logoUrl: logo.url,
        logoPublicId: logo.publicId,
        lightLogoUrl: lightLogo.url,
        lightLogoPublicId: lightLogo.publicId,
        faviconUrl: favicon.url,
        faviconPublicId: favicon.publicId,
      },
      create: {
        singletonKey: "default",
        ...parsedTheme.data,
        logoUrl: logo.url,
        logoPublicId: logo.publicId,
        lightLogoUrl: lightLogo.url,
        lightLogoPublicId: lightLogo.publicId,
        faviconUrl: favicon.url,
        faviconPublicId: favicon.publicId,
      },
    });

    const retainedPublicIds = new Set(
      [logo.publicId, lightLogo.publicId, favicon.publicId].filter(
        (publicId): publicId is string => Boolean(publicId),
      ),
    );
    const previousPublicIds = [
      current?.logoPublicId,
      current?.lightLogoPublicId,
      current?.faviconPublicId,
    ].filter(
      (publicId): publicId is string =>
        Boolean(publicId) && !retainedPublicIds.has(publicId as string),
    );

    await Promise.allSettled(
      previousPublicIds.map((publicId) => deleteHotelImage(publicId)),
    );
  } catch (error) {
    await Promise.allSettled(
      uploadedPublicIds.map((publicId) => deleteHotelImage(publicId)),
    );

    return failure(
      error instanceof Error
        ? error.message
        : "Unable to update the hotel branding.",
    );
  }

  revalidatePath(settingsPath);
  revalidatePath(brandingPath);
  revalidatePath("/dashboard", "layout");
  revalidatePath("/demo", "layout");
  revalidatePath("/");
  return success("Hotel branding updated.");
}

async function resolveHeroMedia(
  formData: FormData,
  uploadedPublicIds: string[],
) {
  const existingUrls = formData
    .getAll("existingHeroImages")
    .map(String)
    .filter(Boolean);
  const existingPublicIds = formData
    .getAll("existingHeroImagePublicIds")
    .map(String);
  const files = formData
    .getAll("heroImages")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (existingUrls.length + files.length > maximumHeroImages) {
    throw new Error(`Use no more than ${maximumHeroImages} hero images.`);
  }

  const uploaded: Array<{ secureUrl: string; publicId: string }> = [];

  for (const file of files) {
    const image = await uploadHotelImage(file, heroImageFolder);
    uploaded.push(image);
    uploadedPublicIds.push(image.publicId);
  }

  return {
    urls: [...existingUrls, ...uploaded.map((image) => image.secureUrl)],
    publicIds: [
      ...existingUrls.map((_, index) => existingPublicIds[index] ?? ""),
      ...uploaded.map((image) => image.publicId),
    ],
  };
}

async function resolveBrandingMedia({
  currentPublicId,
  currentUrl,
  fileField,
  folder = brandingImageFolder,
  formData,
  label,
  removeField,
  uploadedPublicIds,
}: {
  currentPublicId: string | null;
  currentUrl: string | null;
  fileField: string;
  folder?: string;
  formData: FormData;
  label: string;
  removeField: string;
  uploadedPublicIds: string[];
}) {
  const value = formData.get(fileField);
  const file = value instanceof File && value.size > 0 ? value : null;

  if (file) {
    assertBrandingImage(file, label);
    const uploaded = await uploadHotelImage(file, folder);
    uploadedPublicIds.push(uploaded.publicId);

    return { url: uploaded.secureUrl, publicId: uploaded.publicId };
  }

  if (formData.get(removeField) === "true") {
    return { url: null, publicId: null };
  }

  return { url: currentUrl, publicId: currentPublicId };
}

function parseFacilities(value: FormDataEntryValue | null):
  | { ok: true; data: ReturnType<typeof reservationFacilitiesSchema.parse> }
  | { ok: false; message: string } {
  if (typeof value !== "string") {
    return { ok: false, message: "Homepage facilities are required." };
  }

  try {
    const parsedJson: unknown = JSON.parse(value);
    const parsed = reservationFacilitiesSchema.safeParse(parsedJson);

    if (!parsed.success) {
      return {
        ok: false,
        message:
          parsed.error.issues[0]?.message ?? "Invalid homepage facilities.",
      };
    }

    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, message: "Invalid homepage facilities." };
  }
}

function assertBrandingImage(file: File, label: string) {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

  if (!allowedTypes.has(file.type)) {
    throw new Error(`Use a PNG, JPG, or WebP file for the ${label}.`);
  }
}

function success(message: string): SettingsActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): SettingsActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}
