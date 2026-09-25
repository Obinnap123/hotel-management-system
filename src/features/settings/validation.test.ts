import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createDefaultReservationWebsiteCopy } from "@/lib/reservation-content";
import {
  brandingThemeSettingsSchema,
  homepageStructureSchema,
  reservationFacilitiesSchema,
  reservationWebsiteSettingsSchema,
} from "./validation";

describe("homepage structure validation", () => {
  it("accepts ordered featured rooms and optional section visibility", () => {
    const result = homepageStructureSchema.safeParse({
      featuredRoomTypeIds: ["deluxe", "suite", "classic"],
      showFeaturedRooms: true,
      showFacilities: true,
      showAboutHotel: false,
      showBookingSteps: true,
    });

    assert.equal(result.success, true);
  });

  it("requires a selection when featured rooms are visible", () => {
    const result = homepageStructureSchema.safeParse({
      featuredRoomTypeIds: [],
      showFeaturedRooms: true,
      showFacilities: true,
      showAboutHotel: true,
      showBookingSteps: true,
    });

    assert.equal(result.success, false);
  });

  it("allows no selection when the featured section is hidden", () => {
    const result = homepageStructureSchema.safeParse({
      featuredRoomTypeIds: [],
      showFeaturedRooms: false,
      showFacilities: true,
      showAboutHotel: true,
      showBookingSteps: true,
    });

    assert.equal(result.success, true);
  });

  it("rejects duplicates and more than three featured rooms", () => {
    const base = {
      showFeaturedRooms: true,
      showFacilities: true,
      showAboutHotel: true,
      showBookingSteps: true,
    };

    assert.equal(
      homepageStructureSchema.safeParse({
        ...base,
        featuredRoomTypeIds: ["suite", "suite"],
      }).success,
      false,
    );
    assert.equal(
      homepageStructureSchema.safeParse({
        ...base,
        featuredRoomTypeIds: ["one", "two", "three", "four"],
      }).success,
      false,
    );
  });
});

describe("branding theme settings validation", () => {
  it("accepts approved values and normalizes hexadecimal colours", () => {
    const result = brandingThemeSettingsSchema.parse({
      primaryColor: "#123abc",
      accentColor: "#f5d680",
      typographyPreset: "CLASSIC",
      colorScheme: "SYSTEM",
    });

    assert.deepEqual(result, {
      primaryColor: "#123ABC",
      accentColor: "#F5D680",
      typographyPreset: "CLASSIC",
      colorScheme: "SYSTEM",
    });
  });

  it("rejects short or malformed colour values", () => {
    const result = brandingThemeSettingsSchema.safeParse({
      primaryColor: "#FFF",
      accentColor: "gold",
      typographyPreset: "EDITORIAL",
      colorScheme: "LIGHT",
    });

    assert.equal(result.success, false);
  });

  it("rejects unapproved typography and appearance options", () => {
    const result = brandingThemeSettingsSchema.safeParse({
      primaryColor: "#173B32",
      accentColor: "#E5D2A9",
      typographyPreset: "CUSTOM",
      colorScheme: "AUTO",
    });

    assert.equal(result.success, false);
  });
});

describe("homepage facilities validation", () => {
  it("accepts one to six facilities with approved icons", () => {
    const result = reservationFacilitiesSchema.safeParse([
      {
        title: "Swimming pool",
        description: "Open daily for registered guests",
        iconKey: "POOL",
        displayOrder: 0,
      },
    ]);

    assert.equal(result.success, true);
  });

  it("rejects unknown icons and more than six facilities", () => {
    const facility = {
      title: "Facility",
      description: "A helpful hotel service",
      iconKey: "CUSTOM_ICON",
      displayOrder: 0,
    };

    assert.equal(
      reservationFacilitiesSchema.safeParse(
        Array.from({ length: 7 }, (_, displayOrder) => ({
          ...facility,
          displayOrder,
        })),
      ).success,
      false,
    );
  });
});

describe("reservation website wording validation", () => {
  const validSettings = {
    websiteTitle: "Old George Holiday Apartment",
    websiteDescription: "Reserve directly with Old George.",
    ...createDefaultReservationWebsiteCopy("Old George HA"),
  };

  it("accepts the approved website copy structure", () => {
    const result = reservationWebsiteSettingsSchema.safeParse(validSettings);

    assert.equal(result.success, true);
  });

  it("allows blank fields so the recommended wording can be used", () => {
    const result = reservationWebsiteSettingsSchema.safeParse(
      Object.fromEntries(
        Object.keys(validSettings).map((key) => [key, ""]),
      ),
    );

    assert.equal(result.success, true);
  });

  it("rejects copy that can break the protected website layout", () => {
    const result = reservationWebsiteSettingsSchema.safeParse({
      ...validSettings,
      heroPrimaryCtaLabel: "A".repeat(31),
    });

    assert.equal(result.success, false);
  });
});
