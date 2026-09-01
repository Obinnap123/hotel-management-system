import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertAdminRole,
  canAccessPath,
  isAdminOnlyPath,
} from "./permissions";

describe("staff permissions", () => {
  it("allows administrators to access every settings route", () => {
    assert.equal(canAccessPath("ADMIN", "/dashboard/settings"), true);
    assert.equal(
      canAccessPath("ADMIN", "/dashboard/settings/reservation-website"),
      true,
    );
  });

  it("blocks receptionists from settings routes and their descendants", () => {
    assert.equal(isAdminOnlyPath("/dashboard/settings"), true);
    assert.equal(
      canAccessPath("RECEPTIONIST", "/dashboard/settings/branding"),
      false,
    );
  });

  it("still allows receptionists to perform hotel operations", () => {
    assert.equal(canAccessPath("RECEPTIONIST", "/dashboard/bookings"), true);
    assert.equal(canAccessPath("RECEPTIONIST", "/dashboard/check-ins"), true);
  });

  it("rejects a receptionist at the server authorization boundary", () => {
    assert.throws(
      () => assertAdminRole("RECEPTIONIST"),
      /do not have permission/,
    );
    assert.doesNotThrow(() => assertAdminRole("ADMIN"));
  });
});
