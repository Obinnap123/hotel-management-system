import assert from "node:assert/strict";
import test from "node:test";
import { formatPublicCurrency } from "./format";

test("formats room prices with the configured hotel currency", () => {
  assert.equal(formatPublicCurrency("125000", "USD"), "USD 125,000");
});

test("keeps the configured currency when the price is invalid", () => {
  assert.equal(formatPublicCurrency("not-a-price", "GBP"), "GBP 0");
});
