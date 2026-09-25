import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { selectDefaultFeaturedRoomTypeIds } from "./homepage-structure";

describe("default featured room selection", () => {
  it("prefers room types with more inventory, then photography", () => {
    const result = selectDefaultFeaturedRoomTypeIds([
      { id: "classic", roomInventoryCount: 1, coverImage: null },
      { id: "deluxe", roomInventoryCount: 4, coverImage: null },
      { id: "suite", roomInventoryCount: 4, coverImage: "/suite.jpg" },
      { id: "family", roomInventoryCount: 2, coverImage: "/family.jpg" },
      { id: "future", roomInventoryCount: 0, coverImage: "/future.jpg" },
    ]);

    assert.deepEqual(result, ["suite", "deluxe", "family"]);
  });

  it("does not return more than three room types", () => {
    const result = selectDefaultFeaturedRoomTypeIds(
      Array.from({ length: 5 }, (_, index) => ({
        id: String(index),
        roomInventoryCount: 5 - index,
        coverImage: null,
      })),
    );

    assert.equal(result.length, 3);
  });
});
