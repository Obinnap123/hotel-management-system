"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedStaff } from "@/features/rooms/authorization";
import { checkOutBooking, CheckOutRuleError } from "./service";
import { checkOutFormSchema } from "./validation";

const checkOutsPath = "/dashboard/check-outs";

export async function checkOutBookingAction(formData: FormData) {
  const session = await requireAuthenticatedStaff();
  const parsed = checkOutFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(`${checkOutsPath}?error=invalid-booking`);
  }

  try {
    await checkOutBooking(parsed.data.bookingId, session.userId);
  } catch (error) {
    const message =
      error instanceof CheckOutRuleError
        ? encodeURIComponent(error.message)
        : "checkout-failed";
    redirect(`${checkOutsPath}?error=${message}`);
  }

  revalidatePath(checkOutsPath);
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/rooms");
  revalidatePath("/dashboard");
  redirect(`${checkOutsPath}?success=checked-out`);
}
