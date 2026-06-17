import { z } from "zod";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const settingsFormSchema = z.object({
  hotelName: z.string().trim().min(1, "Hotel name is required."),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  emailAddress: z.email("Enter a valid email address.").trim().toLowerCase(),
  physicalAddress: z.string().trim().min(1, "Physical address is required."),
  defaultCheckInTime: z
    .string()
    .regex(timePattern, "Enter a valid default check-in time."),
  defaultCheckOutTime: z
    .string()
    .regex(timePattern, "Enter a valid default check-out time."),
  currency: z
    .string()
    .trim()
    .min(3, "Currency is required.")
    .max(3, "Use a 3-letter currency code.")
    .transform((value) => value.toUpperCase()),
});
