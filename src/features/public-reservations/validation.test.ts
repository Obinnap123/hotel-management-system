import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publicReservationSchema } from "./validation";

const validReservation = {
  roomTypeSlug: "deluxe",
  fullName: "Ada Guest",
  email: "ada@example.com",
  phoneNumber: "+2348000000000",
  checkInDate: "2026-10-01",
  checkOutDate: "2026-10-03",
  guestCount: "2",
  specialRequests: "",
  termsAccepted: "accepted",
};

describe("public reservation policy acceptance", () => {
  it("accepts a reservation when the guest accepts the policies", () => {
    assert.equal(publicReservationSchema.safeParse(validReservation).success, true);
  });

  it("rejects a reservation without policy acceptance", () => {
    const result = publicReservationSchema.safeParse({
      ...validReservation,
      termsAccepted: undefined,
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.match(result.error.issues[0]?.message ?? "", /accept/i);
    }
  });
});
