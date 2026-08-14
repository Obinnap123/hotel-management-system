import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSessionToken, verifySessionToken } from "./session-token";

const secret = "test-secret-that-is-not-used-outside-this-test";

describe("staff session tokens", () => {
  it("round-trips a valid signed session", async () => {
    const payload = {
      userId: "user-1",
      fullName: "Hotel Admin",
      email: "admin@example.com",
      role: "ADMIN" as const,
      sessionVersion: 2,
      expiresAt: Date.now() + 60_000,
    };
    const token = await createSessionToken(payload, secret);

    assert.deepEqual(await verifySessionToken(token, secret), payload);
  });

  it("rejects expired sessions", async () => {
    const token = await createSessionToken(
      {
        userId: "user-1",
        fullName: "Hotel Admin",
        email: "admin@example.com",
        role: "ADMIN",
        sessionVersion: 0,
        expiresAt: Date.now() - 1,
      },
      secret,
    );

    assert.equal(await verifySessionToken(token, secret), null);
  });

  it("rejects a token whose payload was changed", async () => {
    const token = await createSessionToken(
      {
        userId: "user-1",
        fullName: "Receptionist",
        email: "staff@example.com",
        role: "RECEPTIONIST",
        sessionVersion: 0,
        expiresAt: Date.now() + 60_000,
      },
      secret,
    );
    const [payload, signature] = token.split(".");
    const changedPayload = `${payload?.slice(0, -1)}A`;

    assert.equal(
      await verifySessionToken(`${changedPayload}.${signature}`, secret),
      null,
    );
  });
});
