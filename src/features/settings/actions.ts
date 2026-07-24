"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/rooms/authorization";
import {
  deleteHotelImage,
  uploadHotelImage,
} from "@/lib/cloudinary/upload";
import { prisma } from "@/server/db/prisma";
import { settingsFormSchema } from "./validation";

const settingsPath = "/dashboard/settings";
const heroImageFolder = "hotel-management-system/reservation-hero";
const maximumHeroImages = 4;

export type SettingsActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function updateSettingsAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = settingsFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid settings details.",
    );
  }

  const uploadedPublicIds: string[] = [];

  try {
    const currentSettings = await prisma.hotelSettings.findUnique({
      where: { singletonKey: "default" },
      select: { heroImagePublicIds: true },
    });
    const heroMedia = await resolveHeroMedia(formData, uploadedPublicIds);

    await prisma.hotelSettings.upsert({
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
      error instanceof Error ? error.message : "Unable to update settings.",
    );
  }

  revalidatePath(settingsPath);
  revalidatePath("/demo", "layout");
  revalidatePath("/");
  return success("Settings updated.");
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
