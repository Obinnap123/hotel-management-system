"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/rooms/authorization";
import {
  createImageUploadSignature,
  deleteHotelImage,
  uploadHotelImage,
} from "@/lib/cloudinary/upload";
import {
  ABOUT_IMAGE_ACCEPTED_TYPES,
  ABOUT_IMAGE_FOLDER,
  ABOUT_IMAGE_MAX_BYTES,
  ABOUT_IMAGE_MIN_HEIGHT,
  ABOUT_IMAGE_MIN_WIDTH,
  isAboutImagePublicId,
} from "@/lib/cloudinary/about-image";
import type { UploadedRoomImage } from "@/lib/cloudinary/room-images";
import { prisma } from "@/server/db/prisma";
import { retryTransientDatabaseRead } from "@/server/db/retry";
import {
  brandingThemeSettingsSchema,
  homepageStructureSchema,
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
const maximumHeroImages = 4;

export type SettingsActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export type AboutImageUploadSignatureState =
  | ({ ok: true } & ReturnType<typeof createImageUploadSignature>)
  | { ok: false; message: string };

export async function createAboutImageUploadSignatureAction(): Promise<AboutImageUploadSignatureState> {
  await requireAdmin();

  try {
    return {
      ok: true,
      ...createImageUploadSignature(ABOUT_IMAGE_FOLDER),
    };
  } catch (error) {
    console.error("[About Image Signature Error]", error);
    return {
      ok: false,
      message: "Unable to prepare the About Hotel image upload.",
    };
  }
}

export async function cleanupAboutImageUploadAction(publicId: string) {
  await requireAdmin();

  if (isAboutImagePublicId(publicId)) {
    await deleteHotelImage(publicId);
  }
}

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

  const uploadedAboutResult = readUploadedAboutImage(formData);

  if (!uploadedAboutResult.ok) {
    return failure(uploadedAboutResult.message);
  }

  const parsed = reservationWebsiteSettingsSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!parsed.success) {
    await cleanupUploadedAboutImage(uploadedAboutResult.image);
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid website settings.",
    );
  }

  const facilities = parseFacilities(formData.get("facilities"));

  if (!facilities.ok) {
    await cleanupUploadedAboutImage(uploadedAboutResult.image);
    return failure(facilities.message);
  }

  const homepageStructure = parseHomepageStructure(
    formData.get("homepageStructure"),
  );

  if (!homepageStructure.ok) {
    await cleanupUploadedAboutImage(uploadedAboutResult.image);
    return failure(homepageStructure.message);
  }

  const uploadedPublicIds: string[] = uploadedAboutResult.image
    ? [uploadedAboutResult.image.publicId]
    : [];
  const legacyWebsiteMetadata = {
    websiteTitle: parsed.data.websiteTitle,
    websiteDescription: parsed.data.websiteDescription,
  };

  try {
    const [currentSettings, currentWebsite, eligibleFeaturedRoomTypes] =
      await retryTransientDatabaseRead(() => Promise.all([
        prisma.hotelSettings.findUnique({
          where: { singletonKey: "default" },
          select: { heroImagePublicIds: true },
        }),
        prisma.websiteContent.findUnique({
          where: { singletonKey: "default" },
          select: { aboutImageUrl: true, aboutImagePublicId: true },
        }),
        prisma.roomType.findMany({
          where: {
            id: { in: homepageStructure.data.featuredRoomTypeIds },
          },
          select: {
            id: true,
            _count: { select: { rooms: true } },
          },
        }),
      ]));

    if (
      eligibleFeaturedRoomTypes.length !==
      homepageStructure.data.featuredRoomTypeIds.length
    ) {
      throw new Error(
        "Every featured room type must still exist.",
      );
    }
    if (
      homepageStructure.data.showFeaturedRooms &&
      eligibleFeaturedRoomTypes.some((roomType) => roomType._count.rooms === 0)
    ) {
      throw new Error(
        "Add at least one room to every featured room type or hide the Featured rooms section.",
      );
    }
    const heroMedia = await resolveHeroMedia(formData, uploadedPublicIds);
    const aboutImage = uploadedAboutResult.image
      ? {
          url: uploadedAboutResult.image.secureUrl,
          publicId: uploadedAboutResult.image.publicId,
        }
      : await resolveBrandingMedia({
          currentPublicId: currentWebsite?.aboutImagePublicId ?? null,
          currentUrl: currentWebsite?.aboutImageUrl ?? null,
          fileField: "aboutImage",
          folder: ABOUT_IMAGE_FOLDER,
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
          showFeaturedRooms: homepageStructure.data.showFeaturedRooms,
          showFacilities: homepageStructure.data.showFacilities,
          showAboutHotel: homepageStructure.data.showAboutHotel,
          showBookingSteps: homepageStructure.data.showBookingSteps,
          aboutImageUrl: aboutImage.url,
          aboutImagePublicId: aboutImage.publicId,
        },
        create: {
          singletonKey: "default",
          ...parsed.data,
          showFeaturedRooms: homepageStructure.data.showFeaturedRooms,
          showFacilities: homepageStructure.data.showFacilities,
          showAboutHotel: homepageStructure.data.showAboutHotel,
          showBookingSteps: homepageStructure.data.showBookingSteps,
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

      await transaction.websiteFeaturedRoomType.deleteMany({
        where: { websiteContentId: websiteContent.id },
      });

      if (homepageStructure.data.featuredRoomTypeIds.length > 0) {
        await transaction.websiteFeaturedRoomType.createMany({
          data: homepageStructure.data.featuredRoomTypeIds.map(
            (roomTypeId, displayOrder) => ({
              displayOrder,
              roomTypeId,
              websiteContentId: websiteContent.id,
            }),
          ),
        });
      }

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

function readUploadedAboutImage(
  formData: FormData,
):
  | { ok: true; image: UploadedRoomImage | null }
  | { ok: false; message: string } {
  const value = String(formData.get("uploadedAboutImage") ?? "");

  if (!value) {
    return { ok: true, image: null };
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return { ok: true, image: validateUploadedAboutImage(parsed) };
  } catch (error) {
    console.error("[About Image Metadata Error]", error);
    return {
      ok: false,
      message:
        "The uploaded About Hotel image details were invalid. Please select the image again.",
    };
  }
}

function validateUploadedAboutImage(value: unknown): UploadedRoomImage {
  if (!value || typeof value !== "object") {
    throw new Error("Missing About Hotel image upload details.");
  }

  const image = value as Record<string, unknown>;
  const secureUrl = typeof image.secureUrl === "string" ? image.secureUrl : "";
  const publicId = typeof image.publicId === "string" ? image.publicId : "";
  const width = Number(image.width);
  const height = Number(image.height);
  const bytes = Number(image.bytes);
  const format =
    typeof image.format === "string" ? image.format.toLowerCase() : "";
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    "";
  const parsedUrl = new URL(secureUrl);

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.hostname !== "res.cloudinary.com" ||
    !parsedUrl.pathname.startsWith(`/${cloudName}/image/upload/`) ||
    !isAboutImagePublicId(publicId)
  ) {
    throw new Error(
      "Image does not belong to the configured About Hotel image folder.",
    );
  }

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < ABOUT_IMAGE_MIN_WIDTH ||
    height < ABOUT_IMAGE_MIN_HEIGHT
  ) {
    throw new Error("About Hotel image dimensions are too small.");
  }

  if (!Number.isFinite(bytes) || bytes <= 0 || bytes > ABOUT_IMAGE_MAX_BYTES) {
    throw new Error("About Hotel image file size is invalid.");
  }

  if (![
    "jpg",
    "jpeg",
    ...ABOUT_IMAGE_ACCEPTED_TYPES.map((type) => type.replace("image/", "")),
  ].includes(format)) {
    throw new Error("About Hotel image format is not supported.");
  }

  return { secureUrl, publicId, width, height, bytes, format };
}

async function cleanupUploadedAboutImage(image: UploadedRoomImage | null) {
  if (image && isAboutImagePublicId(image.publicId)) {
    await deleteHotelImage(image.publicId);
  }
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

function parseHomepageStructure(value: FormDataEntryValue | null):
  | { ok: true; data: ReturnType<typeof homepageStructureSchema.parse> }
  | { ok: false; message: string } {
  if (typeof value !== "string") {
    return { ok: false, message: "Homepage structure details are required." };
  }

  try {
    const parsedJson: unknown = JSON.parse(value);
    const parsed = homepageStructureSchema.safeParse(parsedJson);

    if (!parsed.success) {
      return {
        ok: false,
        message:
          parsed.error.issues[0]?.message ?? "Invalid homepage structure.",
      };
    }

    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, message: "Invalid homepage structure." };
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
