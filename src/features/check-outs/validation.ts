import { z } from "zod";

export const checkOutFormSchema = z.object({
  bookingId: z.string().trim().min(1, "Booking is required."),
});
