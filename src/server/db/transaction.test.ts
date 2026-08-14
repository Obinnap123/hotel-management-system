import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isOverlappingBookingConstraintError,
  isTransactionWriteConflict,
} from "./transaction-errors";

describe("database transaction rules", () => {
  it("recognizes Prisma serializable write conflicts", () => {
    assert.equal(isTransactionWriteConflict({ code: "P2034" }), true);
    assert.equal(isTransactionWriteConflict({ code: "P2002" }), false);
    assert.equal(isTransactionWriteConflict(new Error("network")), false);
  });

  it("recognizes the final overlapping-booking database safeguard", () => {
    assert.equal(
      isOverlappingBookingConstraintError(
        new Error(
          "Constraint failed: Booking_no_overlapping_active_stays",
        ),
      ),
      true,
    );
    assert.equal(
      isOverlappingBookingConstraintError(new Error("Different constraint")),
      false,
    );
  });
});
