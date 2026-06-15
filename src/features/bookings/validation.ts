import { z } from "zod";

export const bookingFormSchema = z
  .object({
    guestId: z.string().trim().min(1, "Guest is required."),
    roomId: z.string().trim().min(1, "Room is required."),
    checkInDate: z.string().trim().min(1, "Check-in date is required."),
    checkOutDate: z.string().trim().min(1, "Check-out date is required."),
  })
  .superRefine((data, context) => {
    const checkInDate = toDate(data.checkInDate);
    const checkOutDate = toDate(data.checkOutDate);

    if (!checkInDate || !checkOutDate) {
      context.addIssue({
        code: "custom",
        message: "Enter valid booking dates.",
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

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export function toDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}
