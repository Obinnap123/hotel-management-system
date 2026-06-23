import { z } from "zod";

export const publicReservationSchema = z
  .object({
    roomTypeSlug: z.string().trim().min(1, "Select a room type."),
    fullName: z.string().trim().min(1, "Full name is required."),
    email: z.email("Enter a valid email address.").trim().toLowerCase(),
    phoneNumber: z.string().trim().min(1, "Phone number is required."),
    checkInDate: z.string().trim().min(1, "Check-in date is required."),
    checkOutDate: z.string().trim().min(1, "Check-out date is required."),
    guestCount: z.coerce
      .number({ error: "Number of guests is required." })
      .int("Number of guests must be a whole number.")
      .min(1, "Number of guests must be at least 1."),
    specialRequests: z.string().trim().optional(),
  })
  .superRefine((data, context) => {
    const checkInDate = toPublicDate(data.checkInDate);
    const checkOutDate = toPublicDate(data.checkOutDate);

    if (!checkInDate || !checkOutDate) {
      context.addIssue({
        code: "custom",
        message: "Enter valid reservation dates.",
        path: ["checkInDate"],
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      context.addIssue({
        code: "custom",
        message: "Check-out date must be after check-in date.",
        path: ["checkOutDate"],
      });
    }
  });

export type PublicReservationInput = z.infer<typeof publicReservationSchema>;

export function toPublicDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}
