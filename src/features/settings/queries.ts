import { cache } from "react";
import { prisma } from "@/server/db/prisma";
import { retryTransientDatabaseRead } from "@/server/db/retry";
import { buildReservationSiteConfig } from "./reservation-site-config";

export const getHotelSettings = cache(async function getHotelSettings() {
  return retryTransientDatabaseRead(async () => {
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

    const [website, branding] = await retryTransientDatabaseRead(() =>
      Promise.all([
        prisma.websiteContent.findUnique({
          where: { singletonKey: "default" },
          include: {
            heroImages: {
              orderBy: { displayOrder: "asc" },
            },
            facilities: {
              orderBy: { displayOrder: "asc" },
            },
            featuredRoomTypes: {
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

export const getHomepageRoomTypeOptions = cache(
  async function getHomepageRoomTypeOptions() {
    return retryTransientDatabaseRead(() =>
      prisma.roomType.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          coverImage: true,
          _count: {
            select: { rooms: true },
          },
        },
      }),
    );
  },
);
