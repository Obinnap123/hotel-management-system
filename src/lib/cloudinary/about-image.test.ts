import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ABOUT_IMAGE_FOLDER,
  ABOUT_IMAGE_MIN_HEIGHT,
  ABOUT_IMAGE_MIN_WIDTH,
  isAboutImagePublicId,
} from "./about-image";

describe("About Hotel image upload boundaries", () => {
  it("uses the production About Hotel image folder", () => {
    assert.equal(
      ABOUT_IMAGE_FOLDER,
      "hotel-management-production/reservation-about",
    );
  });

  it("only accepts image IDs inside the controlled folder", () => {
    assert.equal(
      isAboutImagePublicId(
        "hotel-management-production/reservation-about/lobby",
      ),
      true,
    );
    assert.equal(
      isAboutImagePublicId("hotel-management-system/reservation-about/lobby"),
      false,
    );
  });

  it("keeps a higher minimum resolution than room images", () => {
    assert.equal(ABOUT_IMAGE_MIN_WIDTH, 1600);
    assert.equal(ABOUT_IMAGE_MIN_HEIGHT, 1200);
  });
});
