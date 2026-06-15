import { prisma } from "@/server/db/prisma";

export async function getGuests() {
  return prisma.guest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}
