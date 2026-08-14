import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getFailedLoginState,
  isLoginLocked,
  loginLockDurationMs,
} from "./security";

describe("login attempt protection", () => {
  const now = new Date("2026-08-08T12:00:00Z");

  it("locks an account on the fifth failed attempt", () => {
    const state = getFailedLoginState({
      currentAttempts: 4,
      lockedUntil: null,
      now,
    });

    assert.equal(state.failedLoginAttempts, 5);
    assert.equal(
      state.lockedUntil?.getTime(),
      now.getTime() + loginLockDurationMs,
    );
  });

  it("starts a fresh count after an old lock expires", () => {
    const state = getFailedLoginState({
      currentAttempts: 5,
      lockedUntil: new Date(now.getTime() - 1),
      now,
    });

    assert.equal(state.failedLoginAttempts, 1);
    assert.equal(state.lockedUntil, null);
  });

  it("only treats a future lock time as locked", () => {
    assert.equal(isLoginLocked(new Date(now.getTime() + 1), now), true);
    assert.equal(isLoginLocked(new Date(now.getTime() - 1), now), false);
    assert.equal(isLoginLocked(null, now), false);
  });
});
