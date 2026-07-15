import { z } from "zod";

export const demoRequestSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  workEmail: z.email("Enter a valid work email address.").trim().toLowerCase(),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  hotelName: z.string().trim().min(1, "Hotel name is required."),
  hotelLocation: z.string().trim().min(1, "Hotel location is required."),
  numberOfRooms: z.coerce
    .number({ error: "Number of rooms is required." })
    .int("Number of rooms must be a whole number.")
    .min(1, "Number of rooms must be at least 1."),
  role: z.string().trim().min(1, "Select your role."),
  additionalNotes: z.string().trim().optional(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
