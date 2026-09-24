import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateOptimizedRoomImageDimensions,
  isAcceptedRoomImageType,
  isRoomImagePublicId,
  ROOM_IMAGE_FOLDER,
  shouldOptimizeRoomImage,
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

  it("only optimizes images that are large in bytes or dimensions", () => {
    assert.equal(shouldOptimizeRoomImage(500_000, 1200, 900), false);
    assert.equal(shouldOptimizeRoomImage(2_000_000, 1200, 900), true);
    assert.equal(shouldOptimizeRoomImage(500_000, 3000, 2000), true);
  });

  it("reduces large images without dropping below the quality dimensions", () => {
    assert.deepEqual(calculateOptimizedRoomImageDimensions(4000, 3000), {
      width: 2400,
      height: 1800,
    });
    assert.deepEqual(calculateOptimizedRoomImageDimensions(1200, 3000), {
      width: 1200,
      height: 3000,
    });
  });
});
