"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedStaff } from "@/features/rooms/authorization";
import { bookingFormSchema } from "./validation";
import {
  BookingRuleError,
  cancelBooking,
  createBooking,
  updateBooking,
} from "./service";

const bookingsPath = "/dashboard/bookings";

export type BookingActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function createBookingAction(
  _state: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const session = await requireAuthenticatedStaff();
  const parsed = bookingFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid booking details.",
    );
  }

  try {
    await createBooking(parsed.data, session.userId);
  } catch (error) {
    return handleBookingError(error, "Unable to create booking.");
  }

  revalidatePath(bookingsPath);
  revalidatePath("/dashboard/rooms");
  return success("Booking created.");
}

export async function updateBookingAction(
  bookingId: string,
  _state: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  await requireAuthenticatedStaff();
  const parsed = bookingFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid booking details.",
    );
  }

  try {
    await updateBooking(bookingId, parsed.data);
  } catch (error) {
    return handleBookingError(error, "Unable to update booking.");
  }

  revalidatePath(bookingsPath);
  revalidatePath("/dashboard/rooms");
  return success("Booking updated.");
}

export async function cancelBookingAction(formData: FormData) {
  await requireAuthenticatedStaff();
  const bookingId = String(formData.get("bookingId") ?? "");

  if (!bookingId) {
    redirect(`${bookingsPath}?error=missing-booking`);
  }

  try {
    await cancelBooking(bookingId);
  } catch (error) {
    const message =
      error instanceof BookingRuleError
        ? encodeURIComponent(error.message)
        : "cancel-booking";
    redirect(`${bookingsPath}?error=${message}`);
  }

  revalidatePath(bookingsPath);
  revalidatePath("/dashboard/rooms");
  redirect(`${bookingsPath}?success=booking-cancelled`);
}

function success(message: string): BookingActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): BookingActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}

function handleBookingError(error: unknown, fallbackMessage: string) {
  if (error instanceof BookingRuleError) {
    return failure(error.message);
  }

  return failure(fallbackMessage);
}
