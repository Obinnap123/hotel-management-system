import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildReservationSiteConfig,
  defaultReservationBranding,
  defaultReservationAboutImage,
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
    assert.equal(config.website.configuredCopy.heroHeading, "");
    assert.equal(
      config.website.copy.heroEyebrow,
      "Welcome to Old George HA",
    );
    assert.equal(
      config.website.copy.aboutBodyPrimary.startsWith("Old George HA"),
      true,
    );
  });

  it("uses configured website wording without changing blank fallback fields", () => {
    const config = buildReservationSiteConfig({
      branding: null,
      hotel,
      website: {
        websiteTitle: "",
        websiteDescription: "",
        heroHeading: "Welcome to a quieter stay.",
        footerCtaLabel: "Book with us",
        updatedAt: new Date("2026-08-13T13:00:00Z"),
        heroImages: [],
      },
    });

    assert.equal(
      config.website.copy.heroHeading,
      "Welcome to a quieter stay.",
    );
    assert.equal(config.website.copy.footerCtaLabel, "Book with us");
    assert.equal(
      config.website.copy.featuredHeading,
      "Rooms, considered for the way you travel.",
    );
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
    assert.equal(config.website.facilities.length, 6);
    assert.equal(config.website.aboutImage.url, defaultReservationAboutImage);
    assert.equal(config.website.aboutImage.isDefault, true);
  });

  it("returns configured facilities and About Hotel media", () => {
    const config = buildReservationSiteConfig({
      branding: null,
      hotel,
      website: {
        websiteTitle: "",
        websiteDescription: "",
        updatedAt: new Date("2026-08-13T13:00:00Z"),
        heroImages: [],
        facilities: [
          {
            id: "pool",
            title: "Swimming pool",
            description: "Open daily for registered guests",
            iconKey: "POOL",
            displayOrder: 0,
          },
        ],
        aboutImageUrl: "https://example.com/about.jpg",
        aboutImagePublicId: "reservation-about/about",
        aboutImageAlt: "The hotel swimming pool at sunset",
      },
    });

    assert.equal(config.website.facilities[0]?.iconKey, "POOL");
    assert.equal(config.website.aboutImage.url, "https://example.com/about.jpg");
    assert.equal(
      config.website.aboutImage.storageId,
      "reservation-about/about",
    );
    assert.equal(config.website.aboutImage.isDefault, false);
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

  it("returns main, light, and favicon branding assets", () => {
    const config = buildReservationSiteConfig({
      branding: {
        logoUrl: "https://example.com/logo.png",
        logoPublicId: "branding/logo",
        lightLogoUrl: "https://example.com/logo-light.png",
        lightLogoPublicId: "branding/logo-light",
        faviconUrl: "https://example.com/favicon.png",
        faviconPublicId: "branding/favicon",
        primaryColor: "#173B32",
        accentColor: "#E5D2A9",
        typographyPreset: "EDITORIAL",
        colorScheme: "LIGHT",
      },
      hotel,
      website: null,
    });

    assert.equal(config.branding.logoStorageId, "branding/logo");
    assert.equal(config.branding.lightLogoUrl, "https://example.com/logo-light.png");
    assert.equal(config.branding.lightLogoStorageId, "branding/logo-light");
    assert.equal(config.branding.faviconStorageId, "branding/favicon");
  });
});
