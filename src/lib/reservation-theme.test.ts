import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createReservationThemeStyle,
  defaultReservationThemeSettings,
  getContrastRatio,
  normalizeReservationThemeSettings,
} from "./reservation-theme";

describe("reservation theme", () => {
  it("normalizes valid colours and falls back from unsupported options", () => {
    const theme = normalizeReservationThemeSettings({
      primaryColor: "#123abc",
      accentColor: "invalid",
      typographyPreset: "UNKNOWN",
      colorScheme: "UNKNOWN",
    });

    assert.equal(theme.primaryColor, "#123ABC");
    assert.equal(theme.accentColor, defaultReservationThemeSettings.accentColor);
    assert.equal(
      theme.typographyPreset,
      defaultReservationThemeSettings.typographyPreset,
    );
    assert.equal(theme.colorScheme, defaultReservationThemeSettings.colorScheme);
  });

  it("deepens a light primary colour enough for readable white text", () => {
    const style = createReservationThemeStyle({
      ...defaultReservationThemeSettings,
      primaryColor: "#FFF4B8",
    });

    assert.ok(
      getContrastRatio(style["--reservation-primary"], "#FFFFFF") >= 4.5,
    );
  });

  it("chooses readable text for an accent-filled action", () => {
    const style = createReservationThemeStyle({
      ...defaultReservationThemeSettings,
      accentColor: "#F6E58D",
    });

    assert.ok(
      getContrastRatio(
        style["--reservation-accent"],
        style["--reservation-on-accent"],
      ) >= 4.5,
    );
  });

  it("returns the selected approved font stack", () => {
    const style = createReservationThemeStyle({
      ...defaultReservationThemeSettings,
      typographyPreset: "CONTEMPORARY",
    });

    assert.match(style["--reservation-heading-font"], /Trebuchet MS/);
    assert.match(style["--reservation-body-font"], /Segoe UI/);
  });
});
