import { z } from "zod";
import { roomStatusValues } from "@/lib/domain/hms-enums";

export const roomFormSchema = z.object({
  roomNumber: z.string().trim().min(1, "Room number is required."),
  roomTypeId: z.string().trim().min(1, "Room type is required."),
  pricePerNight: z.coerce
    .number({ error: "Price per night is required." })
    .positive("Price per night must be greater than 0."),
  capacity: z.coerce
    .number({ error: "Capacity is required." })
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1."),
  status: z.enum(roomStatusValues, {
    error: "Select a valid room status.",
  }),
});

export const roomStatusFormSchema = z.object({
  roomId: z.string().trim().min(1, "Room is required."),
  status: z.enum(roomStatusValues, {
    error: "Select a valid room status.",
  }),
});

export const roomTypeFormSchema = z.object({
  name: z.string().trim().min(1, "Room type name is required."),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must use lowercase letters, numbers, and hyphens only.",
    )
    .optional()
    .or(z.literal("")),
  description: z.string().trim().optional(),
  amenities: z.string().trim().optional(),
});

export type RoomFormInput = z.infer<typeof roomFormSchema>;
export type RoomTypeFormInput = z.infer<typeof roomTypeFormSchema>;
