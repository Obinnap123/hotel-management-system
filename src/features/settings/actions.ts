"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/rooms/authorization";
import { prisma } from "@/server/db/prisma";
import { settingsFormSchema } from "./validation";

const settingsPath = "/dashboard/settings";

export type SettingsActionState = {
  ok: boolean;
  message: string;
  submissionId: string;
};

export async function updateSettingsAction(
  _state: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = settingsFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return failure(
      parsed.error.issues[0]?.message ?? "Invalid settings details.",
    );
  }

  try {
    await prisma.hotelSettings.upsert({
      where: {
        singletonKey: "default",
      },
      update: parsed.data,
      create: {
        singletonKey: "default",
        ...parsed.data,
      },
    });
  } catch {
    return failure("Unable to update settings.");
  }

  revalidatePath(settingsPath);
  return success("Settings updated.");
}

function success(message: string): SettingsActionState {
  return { ok: true, message, submissionId: crypto.randomUUID() };
}

function failure(message: string): SettingsActionState {
  return { ok: false, message, submissionId: crypto.randomUUID() };
}
