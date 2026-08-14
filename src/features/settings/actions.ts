"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/rooms/authorization";
import {
  deleteHotelImage,
  uploadHotelImage,
} from "@/lib/cloudinary/upload";
import { prisma } from "@/server/db/prisma";
import {
  hotelProfileSettingsSchema,
  reservationWebsiteSettingsSchema,
} from "./validation";

const settingsPath = "/dashboard/settings";
const hotelProfilePath = `${settingsPath}/hotel-profile`;
const reservationWebsitePath = `${settingsPath}/reservation-website`;
const heroImageFolder = "hotel-management-system/reservation-hero";
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

  const uploadedPublicIds: string[] = [];

  try {
    const currentSettings = await prisma.hotelSettings.findUnique({
      where: { singletonKey: "default" },
      select: { heroImagePublicIds: true },
    });
    const heroMedia = await resolveHeroMedia(formData, uploadedPublicIds);

    await prisma.$transaction(async (transaction) => {
      const websiteContent = await transaction.websiteContent.upsert({
        where: {
          singletonKey: "default",
        },
        update: parsed.data,
        create: {
          singletonKey: "default",
          ...parsed.data,
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

      await transaction.hotelSettings.upsert({
        where: {
          singletonKey: "default",
        },
        update: {
          ...parsed.data,
          heroImages: heroMedia.urls,
          heroImagePublicIds: heroMedia.publicIds,
        },
        create: {
          singletonKey: "default",
          ...parsed.data,
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

function success(message: string): SettingsActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): SettingsActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}
