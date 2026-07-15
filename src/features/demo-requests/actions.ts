"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { demoRequestSchema } from "./validation";

export type DemoRequestActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createDemoRequestAction(
  _state: DemoRequestActionState,
  formData: FormData,
): Promise<DemoRequestActionState> {
  const parsed = demoRequestSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ?? "Enter valid demo request details.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.demoRequest.create({
      data: {
        fullName: parsed.data.fullName,
        workEmail: parsed.data.workEmail,
        phoneNumber: parsed.data.phoneNumber,
        hotelName: parsed.data.hotelName,
        hotelLocation: parsed.data.hotelLocation,
        numberOfRooms: parsed.data.numberOfRooms,
        role: parsed.data.role,
        additionalNotes: parsed.data.additionalNotes || null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        ok: false,
        message:
          "Demo request could not be saved. Please try again in a moment.",
      };
    }

    return {
      ok: false,
      message: "Demo request could not be saved. Please try again in a moment.",
    };
  }

  redirect("/request-demo/success");
}
