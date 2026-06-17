import { Prisma, UserStatus } from "@prisma/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/server/db/prisma";
import type {
  changeOwnPasswordSchema,
  createUserSchema,
  updateUserSchema,
} from "./validation";
import type { z } from "zod";

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;
type ChangeOwnPasswordInput = z.infer<typeof changeOwnPasswordSchema>;

export class UserRuleError extends Error {}

export async function createStaffUser(input: CreateUserInput) {
  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: input.role,
      status: input.status,
    },
  });
}

export async function updateStaffUser(userId: string, input: UpdateUserInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      fullName: input.fullName,
      email: input.email,
      role: input.role,
      status: input.status,
    },
  });
}

export async function activateStaffUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.ACTIVE,
    },
  });
}

export async function deactivateStaffUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      status: UserStatus.INACTIVE,
    },
  });
}

export async function resetStaffPassword(userId: string) {
  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
    },
  });

  return temporaryPassword;
}

export async function changeOwnPassword(
  userId: string,
  input: ChangeOwnPasswordInput,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UserRuleError("Your account was not found.");
  }

  const currentPasswordIsValid = await verifyPassword(
    input.currentPassword,
    user.passwordHash,
  );

  if (!currentPasswordIsValid) {
    throw new UserRuleError("Current password is incorrect.");
  }

  const passwordHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
    },
  });
}

export function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function generateTemporaryPassword() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#@$%";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}
