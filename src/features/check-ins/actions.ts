"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedStaff } from "@/features/rooms/authorization";
import { checkInBooking, CheckInRuleError } from "./service";
import { checkInFormSchema } from "./validation";

const checkInsPath = "/dashboard/check-ins";

export async function checkInBookingAction(formData: FormData) {
  const session = await requireAuthenticatedStaff();
  const parsed = checkInFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(`${checkInsPath}?error=invalid-booking`);
  }

  try {
    await checkInBooking(parsed.data.bookingId, session.userId);
  } catch (error) {
    const message =
      error instanceof CheckInRuleError
        ? encodeURIComponent(error.message)
        : "check-in-failed";
    redirect(`${checkInsPath}?error=${message}`);
  }

  revalidatePath(checkInsPath);
  revalidatePath("/dashboard/check-outs");
  revalidatePath("/dashboard/rooms");
  revalidatePath("/dashboard/bookings");
  redirect(`${checkInsPath}?success=checked-in`);
}
