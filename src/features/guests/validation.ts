import { z } from "zod";

export const guestFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .pipe(z.email("Enter a valid email address.").optional()),
  address: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

export type GuestFormInput = z.infer<typeof guestFormSchema>;
