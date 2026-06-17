import { z } from "zod";
import { toDate } from "@/features/bookings/validation";
import { paymentMethodValues } from "@/lib/domain/hms-enums";

export const paymentFormSchema = z
  .object({
    bookingId: z.string().trim().min(1, "Booking is required."),
    amount: z.coerce
      .number({ error: "Amount is required." })
      .positive("Amount must be greater than zero."),
    method: z.enum(paymentMethodValues, {
      error: "Select a valid payment method.",
    }),
    paymentDate: z.string().trim().min(1, "Payment date is required."),
  })
  .superRefine((data, context) => {
    if (!toDate(data.paymentDate)) {
      context.addIssue({
        code: "custom",
        message: "Enter a valid payment date.",
        path: ["paymentDate"],
      });
    }
  });

export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
