import { prisma } from "@/server/db/prisma";

export async function getHotelSettings() {
  const settings = await prisma.hotelSettings.findUnique({
    where: {
      singletonKey: "default",
    },
  });

  if (settings) {
    return settings;
  }

  return prisma.hotelSettings.create({
    data: {
      singletonKey: "default",
      hotelName: "Hotel Management",
      phoneNumber: "",
      emailAddress: "",
      physicalAddress: "",
      defaultCheckInTime: "14:00",
      defaultCheckOutTime: "12:00",
      currency: "NGN",
    },
  });
}
