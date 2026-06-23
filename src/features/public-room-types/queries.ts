import "server-only";

import { RoomStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

type PublicRoomTypeRecord = Prisma.RoomTypeGetPayload<{
  include: {
    rooms: {
      select: {
        pricePerNight: true;
        capacity: true;
        status: true;
      };
    };
  };
}>;

export type PublicRoomTypeSummary = {
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  amenities: string[];
  pricePerNight: string | null;
  minPricePerNight: string | null;
  maxPricePerNight: string | null;
  capacity: number | null;
  availableRoomCount: number;
};

export type PublicRoomTypeDetails = PublicRoomTypeSummary & {
  galleryImages: string[];
};

export async function getFeaturedPublicRoomTypes(
  limit = 3,
): Promise<PublicRoomTypeSummary[]> {
  const roomTypes = await prisma.roomType.findMany({
    include: publicRoomTypeInclude,
    orderBy: {
      name: "asc",
    },
  });

  return roomTypes
    .map(toPublicRoomTypeSummary)
    .filter((roomType) => roomType.pricePerNight !== null)
    .sort((a, b) => {
      if (a.availableRoomCount !== b.availableRoomCount) {
        return b.availableRoomCount - a.availableRoomCount;
      }

      const aHasImage = a.coverImage ? 1 : 0;
      const bHasImage = b.coverImage ? 1 : 0;

      return bHasImage - aHasImage;
    })
    .slice(0, limit);
}

export async function getAllPublicRoomTypes(): Promise<
  PublicRoomTypeSummary[]
> {
  const roomTypes = await prisma.roomType.findMany({
    include: publicRoomTypeInclude,
    orderBy: {
      name: "asc",
    },
  });

  return roomTypes.map(toPublicRoomTypeSummary);
}

export async function getPublicRoomTypeBySlug(
  slug: string,
): Promise<PublicRoomTypeDetails | null> {
  const roomType = await prisma.roomType.findUnique({
    where: {
      slug,
    },
    include: publicRoomTypeInclude,
  });

  if (!roomType) {
    return null;
  }

  return toPublicRoomTypeDetails(roomType);
}

export async function getPublicRoomTypeAvailability(
  slug: string,
): Promise<number> {
  const roomType = await prisma.roomType.findUnique({
    where: {
      slug,
    },
    select: {
      rooms: {
        where: {
          status: RoomStatus.AVAILABLE,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return roomType?.rooms.length ?? 0;
}

const publicRoomTypeInclude = {
  rooms: {
    select: {
      pricePerNight: true,
      capacity: true,
      status: true,
    },
  },
} satisfies Prisma.RoomTypeInclude;

function toPublicRoomTypeDetails(
  roomType: PublicRoomTypeRecord,
): PublicRoomTypeDetails {
  return {
    ...toPublicRoomTypeSummary(roomType),
    galleryImages: roomType.galleryImages,
  };
}

function toPublicRoomTypeSummary(
  roomType: PublicRoomTypeRecord,
): PublicRoomTypeSummary {
  const prices = roomType.rooms.map((room) => room.pricePerNight);
  const capacities = roomType.rooms.map((room) => room.capacity);
  const minPrice = getMinDecimal(prices);
  const maxPrice = getMaxDecimal(prices);

  return {
    name: roomType.name,
    slug: roomType.slug,
    description: roomType.description,
    coverImage: roomType.coverImage,
    amenities: roomType.amenities,
    pricePerNight: minPrice ? formatDecimal(minPrice) : null,
    minPricePerNight: minPrice ? formatDecimal(minPrice) : null,
    maxPricePerNight: maxPrice ? formatDecimal(maxPrice) : null,
    capacity: capacities.length > 0 ? Math.max(...capacities) : null,
    availableRoomCount: roomType.rooms.filter(
      (room) => room.status === RoomStatus.AVAILABLE,
    ).length,
  };
}

function getMinDecimal(values: Prisma.Decimal[]) {
  return values.reduce<Prisma.Decimal | null>((lowest, value) => {
    if (!lowest || value.lt(lowest)) {
      return value;
    }

    return lowest;
  }, null);
}

function getMaxDecimal(values: Prisma.Decimal[]) {
  return values.reduce<Prisma.Decimal | null>((highest, value) => {
    if (!highest || value.gt(highest)) {
      return value;
    }

    return highest;
  }, null);
}

function formatDecimal(value: Prisma.Decimal) {
  return value.toFixed(2);
}
