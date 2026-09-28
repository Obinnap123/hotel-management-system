import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createDefaultHotelPolicies,
  createHotelPolicySnapshot,
  resolveHotelPolicies,
} from "./hotel-policies";

const defaults = createDefaultHotelPolicies({
  checkInTime: "14:00",
  checkOutTime: "12:00",
  hotelName: "Old George HA",
});

describe("hotel policies", () => {
  it("creates operational defaults using the hotel times and name", () => {
    assert.match(defaults.checkInRequirements, /14:00/);
    assert.match(defaults.checkInRequirements, /12:00/);
    assert.match(defaults.houseRules, /Old George HA/);
    assert.match(defaults.reservationTerms, /pending/);
  });

  it("uses configured wording while preserving defaults for blank fields", () => {
    const resolved = resolveHotelPolicies(
      {
        cancellationPolicy: "Cancel at least 24 hours before arrival.",
        checkInRequirements: "",
        houseRules: "  ",
        reservationTerms: "The hotel must confirm the request.",
      },
      defaults,
    );

    assert.equal(
      resolved.cancellationPolicy,
      "Cancel at least 24 hours before arrival.",
    );
    assert.equal(resolved.checkInRequirements, defaults.checkInRequirements);
    assert.equal(resolved.houseRules, defaults.houseRules);
    assert.equal(
      resolved.reservationTerms,
      "The hotel must confirm the request.",
    );
  });

  it("records the exact accepted policy wording and time", () => {
    const acceptedAt = new Date("2026-09-28T12:00:00.000Z");
    const snapshot = createHotelPolicySnapshot(defaults, acceptedAt);

    assert.equal(snapshot.version, 1);
    assert.equal(snapshot.acceptedAt, acceptedAt.toISOString());
    assert.deepEqual(snapshot.cancellationPolicy, defaults.cancellationPolicy);
  });
});
