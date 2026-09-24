import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAcceptedRoomImageType,
  isRoomImagePublicId,
  ROOM_IMAGE_FOLDER,
} from "./room-images";

describe("room image upload boundaries", () => {
  it("uses the production room-type folder without changing the API key name", () => {
    assert.equal(ROOM_IMAGE_FOLDER, "hotel-management-production/room-types");
  });

  it("only accepts room image IDs inside the controlled folder", () => {
    assert.equal(
      isRoomImagePublicId("hotel-management-production/room-types/deluxe"),
      true,
    );
    assert.equal(
      isRoomImagePublicId("hotel-management-system/room-types/deluxe"),
      false,
    );
  });

  it("allows the supported browser image formats", () => {
    assert.equal(isAcceptedRoomImageType("image/jpeg"), true);
    assert.equal(isAcceptedRoomImageType("image/png"), true);
    assert.equal(isAcceptedRoomImageType("image/webp"), true);
    assert.equal(isAcceptedRoomImageType("image/svg+xml"), false);
  });
});
