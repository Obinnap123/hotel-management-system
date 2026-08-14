import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateStayNights,
  doStayDateRangesOverlap,
  isValidStayDateRange,
} from "./rules";

describe("booking date rules", () => {
  it("accepts a checkout after check-in", () => {
    assert.equal(
      isValidStayDateRange(
        new Date("2026-08-10T00:00:00Z"),
        new Date("2026-08-12T00:00:00Z"),
      ),
      true,
    );
  });

  it("rejects an empty or reversed stay", () => {
    const date = new Date("2026-08-10T00:00:00Z");

    assert.equal(isValidStayDateRange(date, date), false);
    assert.equal(
      isValidStayDateRange(
        new Date("2026-08-12T00:00:00Z"),
        new Date("2026-08-10T00:00:00Z"),
      ),
      false,
    );
  });

  it("treats checkout and the next check-in on the same day as non-overlapping", () => {
    assert.equal(
      doStayDateRangesOverlap({
        firstCheckIn: new Date("2026-08-10T00:00:00Z"),
        firstCheckOut: new Date("2026-08-12T00:00:00Z"),
        secondCheckIn: new Date("2026-08-12T00:00:00Z"),
        secondCheckOut: new Date("2026-08-14T00:00:00Z"),
      }),
      false,
    );
  });

  it("detects a stay that crosses an existing stay", () => {
    assert.equal(
      doStayDateRangesOverlap({
        firstCheckIn: new Date("2026-08-10T00:00:00Z"),
        firstCheckOut: new Date("2026-08-13T00:00:00Z"),
        secondCheckIn: new Date("2026-08-12T00:00:00Z"),
        secondCheckOut: new Date("2026-08-14T00:00:00Z"),
      }),
      true,
    );
  });

  it("calculates the number of chargeable nights", () => {
    assert.equal(
      calculateStayNights(
        new Date("2026-08-10T00:00:00Z"),
        new Date("2026-08-13T00:00:00Z"),
      ),
      3,
    );
  });
});
