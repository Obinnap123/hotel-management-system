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
    await manuallyUpdateRoomStatusForMvp(parsed.data.roomId, parsed.data.status);
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
      data: normalizeRoomTypeData(parsed.data),
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
    await prisma.roomType.update({
      where: { id: roomTypeId },
      data: normalizeRoomTypeData(parsed.data),
    });
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
    await prisma.roomType.delete({
      where: { id: roomTypeId },
    });
  } catch {
    redirect(`${roomTypesPath}?error=delete-room-type`);
  }

  revalidatePath(roomTypesPath);
  revalidatePath(roomsPath);
  redirect(`${roomTypesPath}?success=room-type-deleted`);
}

function normalizeRoomTypeData(data: { name: string; description?: string }) {
  return {
    name: data.name,
    description: data.description || null,
  };
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

  return failure(fallbackMessage);
}
