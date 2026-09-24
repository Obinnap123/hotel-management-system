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
  createRoomImageUploadSignature,
  deleteRoomTypeImage,
} from "@/lib/cloudinary/upload";
import {
  isRoomImagePublicId,
  ROOM_IMAGE_MAX_BYTES,
  ROOM_IMAGE_MAX_GALLERY_COUNT,
  ROOM_IMAGE_MIN_HEIGHT,
  ROOM_IMAGE_MIN_WIDTH,
  type UploadedRoomImage,
} from "@/lib/cloudinary/room-images";
import { prisma } from "@/server/db/prisma";

const roomsPath = "/dashboard/rooms";
const roomTypesPath = "/dashboard/room-types";

export type ActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export type RoomImageUploadSignatureState =
  | {
      ok: true;
      apiKey: string;
      cloudName: string;
      folder: string;
      signature: string;
      timestamp: number;
    }
  | { ok: false; message: string };

export async function createRoomImageUploadSignatureAction(): Promise<RoomImageUploadSignatureState> {
  await requireAdmin();

  try {
    return { ok: true, ...createRoomImageUploadSignature() };
  } catch (error) {
    console.error("[Room Image Signature Error]", error);
    return {
      ok: false,
      message: "Image upload is temporarily unavailable. Please try again.",
    };
  }
}

export async function cleanupRoomImageUploadsAction(publicIds: string[]) {
  await requireAdmin();
  await cleanupNewUploads(publicIds);
}

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

  const uploadsResult = readUploadedRoomImages(formData);
  if (!uploadsResult.ok) {
    return failure(uploadsResult.message);
  }

  const parsed = roomTypeFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    await cleanupNewUploads(uploadsResult.publicIds);
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid room type details.",
    );
  }

  try {
    await prisma.roomType.create({
      data: normalizeRoomTypeData(parsed.data, formData, uploadsResult),
    });
  } catch (error) {
    await cleanupNewUploads(uploadsResult.publicIds);
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

  const uploadsResult = readUploadedRoomImages(formData);
  if (!uploadsResult.ok) {
    return failure(uploadsResult.message);
  }

  const parsed = roomTypeFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    await cleanupNewUploads(uploadsResult.publicIds);
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
      await cleanupNewUploads(uploadsResult.publicIds);
      return failure("Room type was not found.");
    }

    const data = normalizeRoomTypeData(parsed.data, formData, uploadsResult);

    await prisma.roomType.update({
      where: { id: roomTypeId },
      data,
    });

    await cleanupRemovedRoomTypeImages(currentRoomType, data);
  } catch (error) {
    await cleanupNewUploads(uploadsResult.publicIds);
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

function normalizeRoomTypeData(
  data: {
    name: string;
    slug?: string;
    description?: string;
    amenities?: string;
  },
  formData: FormData,
  uploads: SuccessfulUploadedRoomImages,
) {
  const existingCoverImage = String(formData.get("existingCoverImage") ?? "");
  const existingCoverImagePublicId = String(
    formData.get("existingCoverImagePublicId") ?? "",
  );
  const existingGalleryImages = formData
    .getAll("existingGalleryImages")
    .map((value) => String(value))
    .filter(Boolean);
  const existingGalleryImagePublicIds = formData
    .getAll("existingGalleryImagePublicIds")
    .map((value) => String(value));
  const coverImage = uploads.cover ?? {
    secureUrl: existingCoverImage || null,
    publicId: existingCoverImage ? existingCoverImagePublicId || null : null,
  };
  const galleryImages = [
    ...existingGalleryImages,
    ...uploads.gallery.map((image) => image.secureUrl),
  ];
  const galleryImagePublicIds = [
    ...existingGalleryImages.map(
      (_, index) => existingGalleryImagePublicIds[index] ?? "",
    ),
    ...uploads.gallery.map((image) => image.publicId),
  ];

  if (galleryImages.length > ROOM_IMAGE_MAX_GALLERY_COUNT) {
    throw new Error(
      `A room type can have up to ${ROOM_IMAGE_MAX_GALLERY_COUNT} gallery images.`,
    );
  }

  return {
    name: data.name,
    slug: data.slug ? slugify(data.slug) : slugify(data.name),
    description: data.description || null,
    coverImage: coverImage.secureUrl,
    coverImagePublicId: coverImage.publicId,
    galleryImages,
    galleryImagePublicIds,
    amenities: parseAmenities(data.amenities),
  };
}

type SuccessfulUploadedRoomImages = {
  ok: true;
  cover: UploadedRoomImage | null;
  gallery: UploadedRoomImage[];
  publicIds: string[];
};

function readUploadedRoomImages(
  formData: FormData,
): SuccessfulUploadedRoomImages | { ok: false; message: string } {
  try {
    const coverValue = String(formData.get("uploadedCoverImage") ?? "");
    const galleryValue = String(formData.get("uploadedGalleryImages") ?? "[]");
    const cover = coverValue
      ? validateUploadedRoomImage(JSON.parse(coverValue))
      : null;
    const parsedGallery: unknown = JSON.parse(galleryValue);

    if (!Array.isArray(parsedGallery)) {
      throw new Error("Invalid gallery upload details.");
    }

    const gallery = parsedGallery.map(validateUploadedRoomImage);
    const publicIds = [
      cover?.publicId,
      ...gallery.map((image) => image.publicId),
    ].filter((publicId): publicId is string => Boolean(publicId));

    return { ok: true, cover, gallery, publicIds };
  } catch (error) {
    console.error("[Room Image Metadata Error]", error);
    return {
      ok: false,
      message:
        "The uploaded image details were invalid. Please select the images again.",
    };
  }
}

function validateUploadedRoomImage(value: unknown): UploadedRoomImage {
  if (!value || typeof value !== "object") {
    throw new Error("Missing image upload details.");
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
    !isRoomImagePublicId(publicId)
  ) {
    throw new Error("Image does not belong to the configured room image folder.");
  }

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < ROOM_IMAGE_MIN_WIDTH ||
    height < ROOM_IMAGE_MIN_HEIGHT
  ) {
    throw new Error("Image dimensions are too small.");
  }

  if (!Number.isFinite(bytes) || bytes <= 0 || bytes > ROOM_IMAGE_MAX_BYTES) {
    throw new Error("Image file size is invalid.");
  }

  if (!["jpg", "jpeg", "png", "webp"].includes(format)) {
    throw new Error("Image format is not supported.");
  }

  return { secureUrl, publicId, width, height, bytes, format };
}

async function cleanupNewUploads(publicIds: string[]) {
  const safePublicIds = Array.from(new Set(publicIds)).filter(
    isRoomImagePublicId,
  );
  await Promise.allSettled(
    safePublicIds.map((publicId) => deleteRoomTypeImage(publicId)),
  );
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
