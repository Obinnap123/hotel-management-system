"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./authorization";
import { manuallyUpdateRoomStatusForMvp } from "./status";
import {
  roomFormSchema,
  roomStatusFormSchema,
  roomTypeFormSchema,
} from "./validation";
import {
  deleteRoomTypeImage,
  uploadRoomTypeImage,
} from "@/lib/cloudinary/upload";
import { prisma } from "@/server/db/prisma";

const roomsPath = "/dashboard/rooms";
const roomTypesPath = "/dashboard/room-types";

export type ActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function createRoomAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = roomFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid room details.");
  }

  try {
    await prisma.room.create({
      data: parsed.data,
    });
  } catch (error) {
    return handlePrismaError(error, "Unable to create room.");
  }

  revalidatePath(roomsPath);
  return success("Room created.");
}

export async function updateRoomAction(
  roomId: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = roomFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid room details.");
  }

  try {
    await prisma.room.update({
      where: { id: roomId },
      data: parsed.data,
    });
  } catch (error) {
    return handlePrismaError(error, "Unable to update room.");
  }

  revalidatePath(roomsPath);
  return success("Room updated.");
}

export async function deleteRoomAction(formData: FormData) {
  await requireAdmin();

  const roomId = String(formData.get("roomId") ?? "");

  if (!roomId) {
    redirect(`${roomsPath}?error=missing-room`);
  }

  const bookingCount = await prisma.booking.count({
    where: { roomId },
  });

  if (bookingCount > 0) {
    redirect(`${roomsPath}?error=room-has-bookings`);
  }

  try {
    await prisma.room.delete({
      where: { id: roomId },
    });
  } catch {
    redirect(`${roomsPath}?error=delete-room`);
  }

  revalidatePath(roomsPath);
  redirect(`${roomsPath}?success=room-deleted`);
}

export async function updateRoomStatusAction(formData: FormData) {
  await requireAdmin();

  const parsed = roomStatusFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(`${roomsPath}?error=invalid-status`);
  }

  try {
    await manuallyUpdateRoomStatusForMvp(
      parsed.data.roomId,
      parsed.data.status,
    );
  } catch {
    redirect(`${roomsPath}?error=status-update`);
  }

  revalidatePath(roomsPath);
  redirect(`${roomsPath}?success=status-updated`);
}

export async function createRoomTypeAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = roomTypeFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid room type details.",
    );
  }

  try {
    await prisma.roomType.create({
      data: await normalizeRoomTypeData(parsed.data, formData),
    });
  } catch (error) {
    return handlePrismaError(error, "Unable to create room type.");
  }

  revalidatePath(roomTypesPath);
  revalidatePath(roomsPath);
  return success("Room type created.");
}

export async function updateRoomTypeAction(
  roomTypeId: string,
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = roomTypeFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid room type details.",
    );
  }

  try {
    const currentRoomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      select: {
        coverImagePublicId: true,
        galleryImagePublicIds: true,
      },
    });

    if (!currentRoomType) {
      return failure("Room type was not found.");
    }

    const data = await normalizeRoomTypeData(parsed.data, formData);

    await prisma.roomType.update({
      where: { id: roomTypeId },
      data,
    });

    await cleanupRemovedRoomTypeImages(currentRoomType, data);
  } catch (error) {
    return handlePrismaError(error, "Unable to update room type.");
  }

  revalidatePath(roomTypesPath);
  revalidatePath(roomsPath);
  return success("Room type updated.");
}

export async function deleteRoomTypeAction(formData: FormData) {
  await requireAdmin();

  const roomTypeId = String(formData.get("roomTypeId") ?? "");

  if (!roomTypeId) {
    redirect(`${roomTypesPath}?error=missing-room-type`);
  }

  const roomCount = await prisma.room.count({
    where: { roomTypeId },
  });

  if (roomCount > 0) {
    redirect(`${roomTypesPath}?error=room-type-has-rooms`);
  }

  try {
    const currentRoomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId },
      select: {
        coverImagePublicId: true,
        galleryImagePublicIds: true,
      },
    });

    await prisma.roomType.delete({
      where: { id: roomTypeId },
    });

    if (currentRoomType) {
      await cleanupRemovedRoomTypeImages(currentRoomType, {
        coverImagePublicId: null,
        galleryImagePublicIds: [],
      });
    }
  } catch {
    redirect(`${roomTypesPath}?error=delete-room-type`);
  }

  revalidatePath(roomTypesPath);
  revalidatePath(roomsPath);
  redirect(`${roomTypesPath}?success=room-type-deleted`);
}

async function normalizeRoomTypeData(
  data: {
    name: string;
    slug?: string;
    description?: string;
    amenities?: string;
  },
  formData: FormData,
) {
  const coverImage = await resolveCoverImage(formData);
  const gallery = await resolveGalleryImages(formData);

  return {
    name: data.name,
    slug: data.slug ? slugify(data.slug) : slugify(data.name),
    description: data.description || null,
    coverImage: coverImage.secureUrl,
    coverImagePublicId: coverImage.publicId,
    galleryImages: gallery.secureUrls,
    galleryImagePublicIds: gallery.publicIds,
    amenities: parseAmenities(data.amenities),
  };
}

async function resolveCoverImage(formData: FormData) {
  const existingCoverImage = String(formData.get("existingCoverImage") ?? "");
  const existingCoverImagePublicId = String(
    formData.get("existingCoverImagePublicId") ?? "",
  );
  const coverImage = formData.get("coverImage");

  if (coverImage instanceof File && coverImage.size > 0) {
    const uploaded = await uploadRoomTypeImage(coverImage);
    return {
      secureUrl: uploaded.secureUrl,
      publicId: uploaded.publicId,
    };
  }

  return {
    secureUrl: existingCoverImage || null,
    publicId: existingCoverImage ? existingCoverImagePublicId || null : null,
  };
}

async function resolveGalleryImages(formData: FormData) {
  const existingGalleryImages = formData
    .getAll("existingGalleryImages")
    .map((value) => String(value))
    .filter(Boolean);
  const existingGalleryImagePublicIds = formData
    .getAll("existingGalleryImagePublicIds")
    .map((value) => String(value));
  const galleryFiles = formData
    .getAll("galleryImages")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const uploadedImages = await Promise.all(
    galleryFiles.map(async (file) => {
      const uploaded = await uploadRoomTypeImage(file);
      return {
        secureUrl: uploaded.secureUrl,
        publicId: uploaded.publicId,
      };
    }),
  );

  return {
    secureUrls: [
      ...existingGalleryImages,
      ...uploadedImages.map((image) => image.secureUrl),
    ],
    publicIds: [
      ...existingGalleryImages.map(
        (_, index) => existingGalleryImagePublicIds[index] ?? "",
      ),
      ...uploadedImages.map((image) => image.publicId),
    ],
  };
}

async function cleanupRemovedRoomTypeImages(
  previous: {
    coverImagePublicId: string | null;
    galleryImagePublicIds: string[];
  },
  next: {
    coverImagePublicId: string | null;
    galleryImagePublicIds: string[];
  },
) {
  const nextPublicIds = new Set([
    next.coverImagePublicId,
    ...next.galleryImagePublicIds,
  ]);
  const previousPublicIds = [
    previous.coverImagePublicId,
    ...previous.galleryImagePublicIds,
  ].filter((publicId): publicId is string => Boolean(publicId));

  const removedPublicIds = previousPublicIds.filter(
    (publicId) => !nextPublicIds.has(publicId),
  );

  await Promise.allSettled(
    removedPublicIds.map((publicId) => deleteRoomTypeImage(publicId)),
  );
}

function parseAmenities(value?: string) {
  if (!value) {
    return [];
  }

  // Split by newlines first, then by commas if needed
  return value
    .split(/\r?\n|,/)
    .map((amenity) => amenity.trim())
    .filter((amenity) => amenity.length > 0);
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || crypto.randomUUID();
}

function success(message: string): ActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): ActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}

function handlePrismaError(error: unknown, fallbackMessage: string) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return failure("A record with this value already exists.");
  }

  if (error instanceof Error) {
    return failure(error.message || fallbackMessage);
  }

  return failure(fallbackMessage);
}
