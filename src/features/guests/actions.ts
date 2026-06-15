"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedStaff } from "@/features/rooms/authorization";
import { prisma } from "@/server/db/prisma";
import { guestFormSchema } from "./validation";

const guestsPath = "/dashboard/guests";

export type GuestActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function createGuestAction(
  _state: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await requireAuthenticatedStaff();

  const parsed = guestFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid guest details.");
  }

  try {
    await prisma.guest.create({
      data: normalizeGuestData(parsed.data),
    });
  } catch (error) {
    return handlePrismaError(error, "Unable to create guest.");
  }

  revalidatePath(guestsPath);
  return success("Guest created.");
}

export async function updateGuestAction(
  guestId: string,
  _state: GuestActionState,
  formData: FormData,
): Promise<GuestActionState> {
  await requireAuthenticatedStaff();

  const parsed = guestFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid guest details.");
  }

  try {
    await prisma.guest.update({
      where: { id: guestId },
      data: normalizeGuestData(parsed.data),
    });
  } catch (error) {
    return handlePrismaError(error, "Unable to update guest.");
  }

  revalidatePath(guestsPath);
  return success("Guest updated.");
}

function normalizeGuestData(data: {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
}) {
  return {
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    email: data.email || null,
    address: data.address || null,
  };
}

function success(message: string): GuestActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): GuestActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}

function handlePrismaError(error: unknown, fallbackMessage: string) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return failure("A guest with this phone number already exists.");
  }

  return failure(fallbackMessage);
}
