import { cache } from "react";
import { prisma } from "@/server/db/prisma";
import { retryTransientDatabaseDnsFailure } from "@/server/db/retry";
import { buildReservationSiteConfig } from "./reservation-site-config";

export const getHotelSettings = cache(async function getHotelSettings() {
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
});

export const getReservationSiteConfig = cache(
  async function getReservationSiteConfig() {
    const hotel = await getHotelSettings();

    const [website, branding] = await retryTransientDatabaseDnsFailure(() =>
      Promise.all([
        prisma.websiteContent.findUnique({
          where: { singletonKey: "default" },
          include: {
            heroImages: {
              orderBy: { displayOrder: "asc" },
            },
          },
        }),
        prisma.brandingSettings.findUnique({
          where: { singletonKey: "default" },
        }),
      ]),
    );

    return buildReservationSiteConfig({ branding, hotel, website });
  },
);
