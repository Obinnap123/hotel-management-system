import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCurrencyPreview,
  getCurrencyOptions,
  isSupportedCurrencyCode,
} from "./currency";

describe("currency settings", () => {
  it("puts familiar currencies first with names, symbols, and codes", () => {
    const options = getCurrencyOptions("NGN");

    assert.equal(options[0]?.code, "NGN");
    assert.equal(options[0]?.name, "Nigerian Naira");
    assert.equal(options[0]?.symbol, "₦");
  });

  it("validates recognized ISO currency codes", () => {
    assert.equal(isSupportedCurrencyCode("ngn"), true);
    assert.equal(isSupportedCurrencyCode("NGR"), false);
  });

  it("creates a readable room-price preview", () => {
    assert.equal(formatCurrencyPreview("NGN"), "₦120,000 (NGN)");
  });
});
