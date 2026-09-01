export type ReservationWebsiteCopy = {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroPrimaryCtaLabel: string;
  heroSecondaryCtaLabel: string;
  featuredEyebrow: string;
  featuredHeading: string;
  featuredDescription: string;
  featuredCtaLabel: string;
  amenitiesEyebrow: string;
  amenitiesHeading: string;
  amenitiesDescription: string;
  aboutEyebrow: string;
  aboutHeading: string;
  aboutBodyPrimary: string;
  aboutBodySecondary: string;
  aboutImageCaption: string;
  roomsEyebrow: string;
  roomsHeading: string;
  roomsDescription: string;
  footerEyebrow: string;
  footerHeading: string;
  footerCtaLabel: string;
};

export const reservationWebsiteCopyLimits = {
  heroEyebrow: 60,
  heroHeading: 90,
  heroDescription: 220,
  heroPrimaryCtaLabel: 30,
  heroSecondaryCtaLabel: 30,
  featuredEyebrow: 50,
  featuredHeading: 120,
  featuredDescription: 260,
  featuredCtaLabel: 30,
  amenitiesEyebrow: 50,
  amenitiesHeading: 110,
  amenitiesDescription: 260,
  aboutEyebrow: 60,
  aboutHeading: 120,
  aboutBodyPrimary: 360,
  aboutBodySecondary: 360,
  aboutImageCaption: 150,
  roomsEyebrow: 50,
  roomsHeading: 120,
  roomsDescription: 260,
  footerEyebrow: 50,
  footerHeading: 100,
  footerCtaLabel: 30,
} as const satisfies Record<keyof ReservationWebsiteCopy, number>;

export function createDefaultReservationWebsiteCopy(
  hotelName: string,
): ReservationWebsiteCopy {
  return {
    heroEyebrow: `Welcome to ${hotelName}`,
    heroHeading: "Arrive. Exhale.\nStay awhile.",
    heroDescription:
      "Well-appointed rooms, unhurried hospitality, and a direct reservation experience designed around your stay.",
    heroPrimaryCtaLabel: "Explore rooms",
    heroSecondaryCtaLabel: "Discover the hotel",
    featuredEyebrow: "Featured stays",
    featuredHeading: "Rooms, considered for the way you travel.",
    featuredDescription:
      "Each room category pairs practical comfort with a calm sense of place. Availability is confirmed against your stay dates when you reserve.",
    featuredCtaLabel: "See all rooms",
    amenitiesEyebrow: "At your convenience",
    amenitiesHeading: "The essentials, handled with care.",
    amenitiesDescription:
      "From a smooth arrival to a restful night, each detail supports a stay that feels settled from the beginning.",
    aboutEyebrow: "The character of our hotel",
    aboutHeading: "Hospitality feels best when nothing is complicated.",
    aboutBodyPrimary: `${hotelName} brings together warm service, practical comfort, and a simple direct-reservation experience.`,
    aboutBodySecondary:
      "From the moment a reservation is placed, reception has the details needed to prepare for arrival and carry the stay through with clarity.",
    aboutImageCaption:
      "A calm base for business, leisure, and everything between.",
    roomsEyebrow: "Rooms & suites",
    roomsHeading: "A room for settling in, not simply checking in.",
    roomsDescription:
      "Compare each room category by space, amenities, and guest capacity. Choose your stay dates to confirm which rooms are available.",
    footerEyebrow: "Stay with us",
    footerHeading: "A more considered stay starts here.",
    footerCtaLabel: "Reserve your stay",
  };
}

export function resolveReservationWebsiteCopy(
  configured: ReservationWebsiteCopy,
  defaults: ReservationWebsiteCopy,
): ReservationWebsiteCopy {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      configured[key as keyof ReservationWebsiteCopy].trim() || fallback,
    ]),
  ) as ReservationWebsiteCopy;
}
