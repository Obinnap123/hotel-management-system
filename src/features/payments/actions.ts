"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedStaff } from "@/features/rooms/authorization";
import { paymentFormSchema } from "./validation";
import { createPayment, PaymentRuleError } from "./service";

const paymentsPath = "/dashboard/payments";

export type PaymentActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function createPaymentAction(
  _state: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const session = await requireAuthenticatedStaff();
  const parsed = paymentFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid payment details.",
    );
  }

  try {
    await createPayment(parsed.data, session.userId);
  } catch (error) {
    return handlePaymentError(error, "Unable to record payment.");
  }

  revalidatePath(paymentsPath);
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/rooms");
  return success("Payment recorded.");
}

function success(message: string): PaymentActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): PaymentActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}

function handlePaymentError(error: unknown, fallbackMessage: string) {
  if (error instanceof PaymentRuleError) {
    return failure(error.message);
  }

  return failure(fallbackMessage);
}
