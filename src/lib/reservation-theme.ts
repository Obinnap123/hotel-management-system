import type { CSSProperties } from "react";

export const reservationTypographyPresetValues = [
  "EDITORIAL",
  "CONTEMPORARY",
  "CLASSIC",
] as const;

export type ReservationTypographyPreset =
  (typeof reservationTypographyPresetValues)[number];

export const reservationColorSchemeValues = [
  "LIGHT",
  "DARK",
  "SYSTEM",
] as const;

export type ReservationColorScheme =
  (typeof reservationColorSchemeValues)[number];

export const reservationTypographyPresets: ReadonlyArray<{
  value: ReservationTypographyPreset;
  label: string;
  description: string;
  headingFont: string;
  bodyFont: string;
}> = [
  {
    value: "EDITORIAL",
    label: "Editorial",
    description: "Expressive serif headings with a clean, understated body.",
    headingFont: 'Georgia, "Times New Roman", serif',
    bodyFont: 'Arial, Helvetica, sans-serif',
  },
  {
    value: "CONTEMPORARY",
    label: "Contemporary",
    description: "A precise sans-serif system for a crisp, modern hotel.",
    headingFont: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
    bodyFont: '"Segoe UI", Arial, sans-serif',
  },
  {
    value: "CLASSIC",
    label: "Classic",
    description: "Refined traditional headings with calm, readable body text.",
    headingFont: '"Palatino Linotype", Palatino, Georgia, serif',
    bodyFont: '"Segoe UI", Arial, sans-serif',
  },
];

export const reservationColorSchemes: ReadonlyArray<{
  value: ReservationColorScheme;
  label: string;
  description: string;
}> = [
  {
    value: "LIGHT",
    label: "Light",
    description: "Keep the reservation website light for every guest.",
  },
  {
    value: "DARK",
    label: "Dark",
    description: "Use a dark, low-glare presentation for every guest.",
  },
  {
    value: "SYSTEM",
    label: "Follow device",
    description: "Match each guest's light or dark device preference.",
  },
];

export const defaultReservationThemeSettings = {
  primaryColor: "#173B32",
  accentColor: "#E5D2A9",
  typographyPreset: "EDITORIAL",
  colorScheme: "LIGHT",
} as const satisfies ReservationThemeSettings;

export type ReservationThemeSettings = {
  primaryColor: string;
  accentColor: string;
  typographyPreset: ReservationTypographyPreset;
  colorScheme: ReservationColorScheme;
};

export type ReservationThemeStyle = CSSProperties &
  Record<`--reservation-${string}`, string>;

const lightSurface = "#F4F1E9";
const darkSurface = "#151F1C";

export function normalizeHexColor(value: string, fallback: string) {
  const trimmed = value.trim();

  if (!/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return fallback.toUpperCase();
  }

  return trimmed.toUpperCase();
}

export function normalizeReservationThemeSettings(settings: {
  primaryColor?: string | null;
  accentColor?: string | null;
  typographyPreset?: string | null;
  colorScheme?: string | null;
}): ReservationThemeSettings {
  const typographyPreset = reservationTypographyPresetValues.includes(
    settings.typographyPreset as ReservationTypographyPreset,
  )
    ? (settings.typographyPreset as ReservationTypographyPreset)
    : defaultReservationThemeSettings.typographyPreset;
  const colorScheme = reservationColorSchemeValues.includes(
    settings.colorScheme as ReservationColorScheme,
  )
    ? (settings.colorScheme as ReservationColorScheme)
    : defaultReservationThemeSettings.colorScheme;

  return {
    primaryColor: normalizeHexColor(
      settings.primaryColor ?? "",
      defaultReservationThemeSettings.primaryColor,
    ),
    accentColor: normalizeHexColor(
      settings.accentColor ?? "",
      defaultReservationThemeSettings.accentColor,
    ),
    typographyPreset,
    colorScheme,
  };
}

export function createReservationThemeStyle(
  settings: ReservationThemeSettings,
): ReservationThemeStyle {
  const normalized = normalizeReservationThemeSettings(settings);
  const typography =
    reservationTypographyPresets.find(
      (preset) => preset.value === normalized.typographyPreset,
    ) ?? reservationTypographyPresets[0];
  const primary = normalized.primaryColor;
  const primarySolid = ensureContrast(primary, "#FFFFFF", 4.5, "#000000");
  const primaryHover = mixHex(primarySolid, "#000000", 0.12);
  const primaryDeep = mixHex(primarySolid, "#000000", 0.22);
  const accent = normalized.accentColor;
  const onAccent = bestContrastText(accent);
  const accentHover = mixHex(
    accent,
    onAccent === "#000000" ? "#FFFFFF" : "#000000",
    0.1,
  );
  const accentCopyLight = ensureContrast(
    accent,
    lightSurface,
    4.5,
    "#000000",
  );
  const accentCopyDark = ensureContrast(
    accent,
    darkSurface,
    4.5,
    "#FFFFFF",
  );
  const accentOnPrimary = ensureContrast(
    accent,
    primarySolid,
    3,
    "#FFFFFF",
  );

  return {
    "--reservation-primary": primarySolid,
    "--reservation-primary-hover": primaryHover,
    "--reservation-primary-deep": primaryDeep,
    "--reservation-on-primary": "#FFFFFF",
    "--reservation-accent": accent,
    "--reservation-accent-hover": accentHover,
    "--reservation-on-accent": onAccent,
    "--reservation-accent-copy-light": accentCopyLight,
    "--reservation-accent-copy-dark": accentCopyDark,
    "--reservation-accent-on-primary": accentOnPrimary,
    "--reservation-heading-font": typography.headingFont,
    "--reservation-body-font": typography.bodyFont,
  };
}

export function getContrastRatio(first: string, second: string) {
  const firstLuminance = getRelativeLuminance(first);
  const secondLuminance = getRelativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function bestContrastText(background: string) {
  return getContrastRatio(background, "#000000") >=
    getContrastRatio(background, "#FFFFFF")
    ? "#000000"
    : "#FFFFFF";
}

function ensureContrast(
  foreground: string,
  background: string,
  minimumRatio: number,
  target: "#000000" | "#FFFFFF",
) {
  if (getContrastRatio(foreground, background) >= minimumRatio) {
    return foreground;
  }

  for (let amount = 0.05; amount <= 1; amount += 0.05) {
    const candidate = mixHex(foreground, target, amount);

    if (getContrastRatio(candidate, background) >= minimumRatio) {
      return candidate;
    }
  }

  return target;
}

function mixHex(first: string, second: string, amount: number) {
  const firstRgb = hexToRgb(first);
  const secondRgb = hexToRgb(second);
  const weight = Math.min(1, Math.max(0, amount));

  return rgbToHex({
    red: Math.round(firstRgb.red + (secondRgb.red - firstRgb.red) * weight),
    green: Math.round(
      firstRgb.green + (secondRgb.green - firstRgb.green) * weight,
    ),
    blue: Math.round(firstRgb.blue + (secondRgb.blue - firstRgb.blue) * weight),
  });
}

function getRelativeLuminance(color: string) {
  const { red, green, blue } = hexToRgb(color);
  const channels = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function hexToRgb(color: string) {
  const normalized = normalizeHexColor(color, "#000000").slice(1);

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex({ red, green, blue }: { red: number; green: number; blue: number }) {
  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}
