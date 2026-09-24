import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateOptimizedImageDimensions } from "./direct-image-upload";

describe("shared direct image optimization", () => {
  it("reduces a large landscape image while preserving its proportions", () => {
    assert.deepEqual(
      calculateOptimizedImageDimensions(4000, 3000, 1600, 1200, 2400),
      { width: 2400, height: 1800 },
    );
  });

  it("does not shrink a narrow portrait below the minimum width", () => {
    assert.deepEqual(
      calculateOptimizedImageDimensions(1600, 4000, 1600, 1200, 2400),
      { width: 1600, height: 4000 },
    );
  });
});
