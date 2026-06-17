"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAuthenticatedStaff } from "@/features/rooms/authorization";
import {
  activateStaffUser,
  changeOwnPassword,
  createStaffUser,
  deactivateStaffUser,
  isUniqueConstraintError,
  resetStaffPassword,
  updateStaffUser,
  UserRuleError,
} from "./service";
import {
  changeOwnPasswordSchema,
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "./validation";

const usersPath = "/dashboard/users";

export type UserActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export type ResetPasswordActionState = UserActionState & {
  temporaryPassword?: string;
};

export async function createUserAction(
  _state: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid staff details.");
  }

  try {
    await createStaffUser(parsed.data);
  } catch (error) {
    return failure(
      isUniqueConstraintError(error)
        ? "A staff account with this email already exists."
        : "Unable to create staff account.",
    );
  }

  revalidatePath(usersPath);
  return success("Staff account created.");
}

export async function updateUserAction(
  userId: string,
  _state: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  await requireAdmin();

  const parsed = updateUserSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid staff details.");
  }

  try {
    await updateStaffUser(userId, parsed.data);
  } catch (error) {
    return failure(
      isUniqueConstraintError(error)
        ? "A staff account with this email already exists."
        : "Unable to update staff account.",
    );
  }

  revalidatePath(usersPath);
  revalidatePath("/dashboard");
  return success("Staff account updated.");
}

export async function activateUserAction(formData: FormData) {
  await requireAdmin();
  const parsed = userIdSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(`${usersPath}?error=invalid-user`);
  }

  try {
    await activateStaffUser(parsed.data.userId);
  } catch {
    redirect(`${usersPath}?error=activate-failed`);
  }

  revalidatePath(usersPath);
  redirect(`${usersPath}?success=user-activated`);
}

export async function deactivateUserAction(formData: FormData) {
  await requireAdmin();
  const parsed = userIdSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(`${usersPath}?error=invalid-user`);
  }

  try {
    await deactivateStaffUser(parsed.data.userId);
  } catch {
    redirect(`${usersPath}?error=deactivate-failed`);
  }

  revalidatePath(usersPath);
  redirect(`${usersPath}?success=user-deactivated`);
}

export async function resetPasswordAction(
  userId: string,
  _state: ResetPasswordActionState,
): Promise<ResetPasswordActionState> {
  void _state;
  await requireAdmin();

  try {
    const temporaryPassword = await resetStaffPassword(userId);
    revalidatePath(usersPath);

    return {
      ok: true,
      message: "Password reset successful.",
      submissionId: crypto.randomUUID(),
      temporaryPassword,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to reset password.",
      submissionId: crypto.randomUUID(),
    };
  }
}

export async function changeOwnPasswordAction(
  _state: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await requireAuthenticatedStaff();
  const parsed = changeOwnPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid password.");
  }

  try {
    await changeOwnPassword(session.userId, parsed.data);
  } catch (error) {
    return failure(
      error instanceof UserRuleError
        ? error.message
        : "Unable to change password.",
    );
  }

  return success("Password changed successfully.");
}

function success(message: string): UserActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): UserActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}
