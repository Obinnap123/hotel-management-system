import { z } from "zod";

export const checkInFormSchema = z.object({
  bookingId: z.string().trim().min(1, "Booking is required."),
});
