import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildReservationSiteConfig,
  defaultReservationBranding,
  defaultReservationHeroImages,
} from "./reservation-site-config";

const hotel = {
  hotelName: "Old George HA",
  phoneNumber: "+234 800 000 0000",
  emailAddress: "stay@example.com",
  physicalAddress: "Lagos, Nigeria",
  defaultCheckInTime: "14:00",
  defaultCheckOutTime: "12:00",
  currency: "NGN",
  updatedAt: new Date("2026-08-13T12:00:00Z"),
};

describe("reservation-site configuration", () => {
  it("keeps configured values separate from public fallback values", () => {
    const config = buildReservationSiteConfig({
      branding: null,
      hotel,
      website: null,
    });

    assert.equal(config.website.configuredTitle, "");
    assert.equal(config.website.configuredDescription, "");
    assert.equal(
      config.website.title,
      "Old George HA | Official Website & Reservations",
    );
    assert.match(config.website.description, /Old George HA/);
  });

  it("uses safe visual defaults when branding and custom images are absent", () => {
    const config = buildReservationSiteConfig({
      branding: null,
      hotel,
      website: null,
    });

    assert.equal(
      config.website.heroImages.length,
      defaultReservationHeroImages.length,
    );
    assert.equal(config.website.heroImages.every((image) => image.isDefault), true);
    assert.equal(
      config.branding.primaryColor,
      defaultReservationBranding.primaryColor,
    );
    assert.equal(
      config.branding.accentColor,
      defaultReservationBranding.accentColor,
    );
  });

  it("returns custom hero images in display order with their storage IDs", () => {
    const config = buildReservationSiteConfig({
      branding: null,
      hotel,
      website: {
        websiteTitle: "Stay with us",
        websiteDescription: "Reserve directly.",
        updatedAt: new Date("2026-08-13T13:00:00Z"),
        heroImages: [
          {
            id: "second",
            imageUrl: "https://example.com/second.jpg",
            storagePublicId: "hotel/second",
            displayOrder: 1,
            alternativeText: "Hotel exterior",
          },
          {
            id: "first",
            imageUrl: "https://example.com/first.jpg",
            storagePublicId: "hotel/first",
            displayOrder: 0,
            alternativeText: "Hotel lobby",
          },
        ],
      },
    });

    assert.deepEqual(
      config.website.customHeroImages.map((image) => image.id),
      ["first", "second"],
    );
    assert.deepEqual(
      config.website.customHeroImages.map((image) => image.storageId),
      ["hotel/first", "hotel/second"],
    );
    assert.equal(config.website.heroImages[0]?.isDefault, false);
  });
});
