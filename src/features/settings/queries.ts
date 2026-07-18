import { prisma } from "@/server/db/prisma";
import { retryTransientDatabaseDnsFailure } from "@/server/db/retry";

export async function getHotelSettings() {
  return retryTransientDatabaseDnsFailure(async () => {
    const settings = await prisma.hotelSettings.findUnique({
      where: {
        singletonKey: "default",
      },
    });

    if (settings) {
      return settings;
    }

    return prisma.hotelSettings.upsert({
      where: {
        singletonKey: "default",
      },
      update: {},
      create: {
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
  });
}
