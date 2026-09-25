import assert from "node:assert/strict";
import test from "node:test";
import {
  isTransientDatabaseConnectionError,
  retryTransientDatabaseRead,
} from "./retry";

test("recognizes the Supabase connection timeout message", () => {
  assert.equal(
    isTransientDatabaseConnectionError(
      new Error("Connection terminated due to connection timeout"),
    ),
    true,
  );
});

test("recognizes common transient connection error codes", () => {
  assert.equal(
    isTransientDatabaseConnectionError(
      Object.assign(new Error("lookup failed"), { code: "EAI_AGAIN" }),
    ),
    true,
  );
  assert.equal(
    isTransientDatabaseConnectionError(
      Object.assign(new Error("socket reset"), { code: "ECONNRESET" }),
    ),
    true,
  );
});

test("does not retry ordinary application errors", async () => {
  let attempts = 0;

  await assert.rejects(
    retryTransientDatabaseRead(async () => {
      attempts += 1;
      throw new Error("Invalid reservation website settings");
    }),
    /Invalid reservation website settings/,
  );

  assert.equal(attempts, 1);
});

test("retries a transient read and returns the recovered result", async () => {
  let attempts = 0;

  const result = await retryTransientDatabaseRead(async () => {
    attempts += 1;

    if (attempts === 1) {
      throw new Error("Connection terminated due to connection timeout");
    }

    return "connected";
  });

  assert.equal(result, "connected");
  assert.equal(attempts, 2);
});
