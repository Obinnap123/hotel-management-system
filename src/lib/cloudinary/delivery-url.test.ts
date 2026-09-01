import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLogoDeliveryUrl } from "./delivery-url";

describe("Cloudinary logo delivery URLs", () => {
  it("trims uniform outer margins from Cloudinary logo assets", () => {
    assert.equal(
      getLogoDeliveryUrl(
        "https://res.cloudinary.com/demo/image/upload/v123/branding/logo.jpg",
      ),
      "https://res.cloudinary.com/demo/image/upload/e_trim:10/v123/branding/logo.jpg",
    );
  });

  it("does not duplicate an existing trim transformation", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/e_trim:10/v123/branding/logo.png";

    assert.equal(getLogoDeliveryUrl(url), url);
  });

  it("leaves non-Cloudinary and non-upload URLs unchanged", () => {
    assert.equal(
      getLogoDeliveryUrl("https://example.com/logo.svg"),
      "https://example.com/logo.svg",
    );
    assert.equal(
      getLogoDeliveryUrl(
        "https://res.cloudinary.com/demo/image/fetch/https://example.com/logo.png",
      ),
      "https://res.cloudinary.com/demo/image/fetch/https://example.com/logo.png",
    );
  });
});
