"use server";

import { redirect } from "next/navigation";
import { createPublicReservation, PublicReservationRuleError } from "./service";
import { publicReservationSchema } from "./validation";

export type PublicReservationActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const bookingSuccessPath = "/booking-success";

export async function createPublicReservationAction(
  _state: PublicReservationActionState,
  formData: FormData,
): Promise<PublicReservationActionState> {
  const parsed = publicReservationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid reservation details.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const reservation = await createPublicReservation(parsed.data);
    const params = new URLSearchParams({
      booking: reservation.bookingNumber,
      roomType: reservation.roomTypeName,
      checkIn: reservation.checkInDate.toISOString(),
      checkOut: reservation.checkOutDate.toISOString(),
    });

    redirect(`${bookingSuccessPath}?${params.toString()}`);
  } catch (error) {
    if (error instanceof PublicReservationRuleError) {
      return {
        ok: false,
        message: error.message,
      };
    }

    throw error;
  }
}
