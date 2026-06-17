import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum([UserRole.ADMIN, UserRole.RECEPTIONIST]),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
});

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  role: z.enum([UserRole.ADMIN, UserRole.RECEPTIONIST]),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
});

export const userIdSchema = z.object({
  userId: z.string().trim().min(1, "Staff member is required."),
});

export const changeOwnPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Confirm password must match the new password.",
    path: ["confirmPassword"],
  });
