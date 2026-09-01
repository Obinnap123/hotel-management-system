"use client";

import Image from "next/image";
import {
  ImagePlus,
  Monitor,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { HotelLogo } from "@/components/branding/HotelLogo";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import {
  type SettingsActionState,
  updateBrandingSettingsAction,
} from "@/features/settings/actions";
import {
  createReservationThemeStyle,
  defaultReservationThemeSettings,
  normalizeReservationThemeSettings,
  reservationColorSchemes,
  reservationTypographyPresets,
  type ReservationColorScheme,
  type ReservationThemeStyle,
  type ReservationTypographyPreset,
} from "@/lib/reservation-theme";
import { notifyReservationSiteUpdated } from "@/lib/public/site-refresh";
import { SettingsPageHeader } from "./SettingsPageHeader";
import { SettingsSectionNav } from "./SettingsSectionNav";
import type { BrandingSettingsValues } from "./settings-types";

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function BrandingSettingsForm({
  settings,
}: {
  settings: BrandingSettingsValues;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateBrandingSettingsAction,
    initialActionState,
  );
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [typographyPreset, setTypographyPreset] =
    useState<ReservationTypographyPreset>(settings.typographyPreset);
  const [colorScheme, setColorScheme] = useState<ReservationColorScheme>(
    settings.colorScheme,
  );
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const previewTheme = normalizeReservationThemeSettings({
    primaryColor,
    accentColor,
    typographyPreset,
    colorScheme,
  });
  const previewStyle = createReservationThemeStyle(previewTheme);

  useEffect(() => {
    if (!state.ok || !state.submissionId) return;
    notifyReservationSiteUpdated();
    router.refresh();
  }, [router, state.ok, state.submissionId]);

  function restoreDefaultTheme() {
    setPrimaryColor(defaultReservationThemeSettings.primaryColor);
    setAccentColor(defaultReservationThemeSettings.accentColor);
    setTypographyPreset(defaultReservationThemeSettings.typographyPreset);
    setColorScheme(defaultReservationThemeSettings.colorScheme);
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7">
      <SettingsPageHeader
        description="Manage the trusted visual marks used across the HMS, reservation website, and browser tabs."
        showBackLink
        title="Branding"
      />
      <SettingsSectionNav active="/dashboard/settings/branding" />

      <form action={formAction} className="space-y-5">
        {state.message ? (
          <AutoDismissMessage variant={state.ok ? "success" : "error"}>
            {state.message}
          </AutoDismissMessage>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-950">
              Hotel marks
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Add clear PNG, JPG, or WebP files up to 5MB. Transparent PNG or
              WebP logos usually give the best result. Large empty outer
              margins are removed automatically when saved logos are shown.
            </p>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2 sm:p-6 xl:grid-cols-3">
            <BrandingImageField
              description="Shown on light HMS surfaces. Compact and horizontal logos both work."
              existingUrl={settings.logoUrl}
              fileName="logo"
              label="Main logo"
              removeField="removeLogo"
            />
            <BrandingImageField
              darkPreview
              description="Shown in the reservation website's dark navigation. Use a light-coloured version."
              existingUrl={settings.lightLogoUrl}
              fileName="lightLogo"
              label="Light logo"
              removeField="removeLightLogo"
            />
            <BrandingImageField
              description="Shown in browser tabs. Use a simple square image."
              existingUrl={settings.faviconUrl}
              fileName="favicon"
              label="Favicon"
              removeField="removeFavicon"
              square
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-950">
              Brand theme
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Choose the colours, typography, and appearance guests see on the
              reservation website. Supporting colours are calculated
              automatically for readability.
            </p>
          </div>

          <div className="grid gap-8 p-5 sm:p-6 xl:grid-cols-[minmax(0,.9fr)_minmax(22rem,1.1fr)] xl:items-start">
            <div className="min-w-0 space-y-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <BrandColorField
                  description="Used for navigation, important sections, and primary actions."
                  id="primaryColor"
                  label="Primary colour"
                  onChange={setPrimaryColor}
                  value={primaryColor}
                />
                <BrandColorField
                  description="Used for highlights, emphasis, and selected call-to-action buttons."
                  id="accentColor"
                  label="Accent colour"
                  onChange={setAccentColor}
                  value={accentColor}
                />
              </div>

              <fieldset>
                <legend className="text-sm font-semibold text-slate-950">
                  Typography
                </legend>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose one approved combination. Body text remains clear and
                  readable in every option.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {reservationTypographyPresets.map((preset) => (
                    <label
                      className={`cursor-pointer rounded-lg border p-4 transition focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2 ${
                        typographyPreset === preset.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      key={preset.value}
                    >
                      <input
                        checked={typographyPreset === preset.value}
                        className="sr-only"
                        name="typographyPreset"
                        onChange={() => setTypographyPreset(preset.value)}
                        type="radio"
                        value={preset.value}
                      />
                      <span
                        className="block min-w-0 text-xl leading-tight text-slate-950 sm:text-[0.95rem] xl:text-sm"
                        style={{ fontFamily: preset.headingFont }}
                      >
                        {preset.label}
                      </span>
                      <span className="mt-2 block text-xs leading-5 text-slate-500">
                        {preset.description}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-slate-950">
                  Website appearance
                </legend>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose one appearance or let each guest&apos;s device decide.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {reservationColorSchemes.map((scheme) => (
                    <label
                      className={`cursor-pointer rounded-lg border p-4 transition focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2 ${
                        colorScheme === scheme.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      key={scheme.value}
                    >
                      <input
                        checked={colorScheme === scheme.value}
                        className="sr-only"
                        name="colorScheme"
                        onChange={() => setColorScheme(scheme.value)}
                        type="radio"
                        value={scheme.value}
                      />
                      <span className="block text-sm font-semibold text-slate-950">
                        {scheme.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {scheme.description}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                onClick={restoreDefaultTheme}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Restore default theme
              </button>
            </div>

            <ThemePreview
              colorScheme={previewTheme.colorScheme}
              mode={previewMode}
              onModeChange={setPreviewMode}
              style={previewStyle}
            />
          </div>
        </section>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
            disabled={pending}
            type="submit"
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            {pending ? "Saving…" : "Save branding"}
          </button>
        </div>
      </form>
    </div>
  );
}

function BrandColorField({
  description,
  id,
  label,
  onChange,
  value,
}: {
  description: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const validColor = isHexColor(value);
  const colorInputValue = validColor ? value : "#000000";
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label className="text-sm font-semibold text-slate-950" htmlFor={id}>
        {label}
      </label>
      <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500" id={helpId}>
        {description}
      </p>
      <div className="mt-3 flex min-w-0 items-center gap-3">
        <label
          className="relative h-11 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md border border-slate-300 bg-white p-1 shadow-sm focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2"
          title={`Choose ${label.toLowerCase()}`}
        >
          <span className="sr-only">Choose {label.toLowerCase()}</span>
          <input
            aria-label={`Choose ${label.toLowerCase()}`}
            className="absolute inset-[-8px] h-16 w-16 cursor-pointer border-0 p-0"
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            type="color"
            value={colorInputValue}
          />
        </label>
        <input
          aria-describedby={`${helpId}${validColor ? "" : ` ${errorId}`}`}
          aria-invalid={!validColor}
          className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 font-mono text-sm uppercase text-slate-950 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          id={id}
          maxLength={7}
          name={id}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          pattern="#[0-9A-Fa-f]{6}"
          placeholder="#173B32"
          required
          spellCheck={false}
          type="text"
          value={value}
        />
      </div>
      {!validColor ? (
        <p className="mt-2 text-xs font-medium text-red-700" id={errorId}>
          Enter a colour in the format #173B32.
        </p>
      ) : null}
    </div>
  );
}

function ThemePreview({
  colorScheme,
  mode,
  onModeChange,
  style,
}: {
  colorScheme: ReservationColorScheme;
  mode: "desktop" | "mobile";
  onModeChange: (mode: "desktop" | "mobile") => void;
  style: ReservationThemeStyle;
}) {
  return (
    <div className="min-w-0 xl:sticky xl:top-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">Live preview</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            A focused sample of the guest-facing website.
          </p>
        </div>
        <div
          aria-label="Preview width"
          className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1"
          role="group"
        >
          <PreviewModeButton
            active={mode === "desktop"}
            icon={Monitor}
            label="Desktop preview"
            onClick={() => onModeChange("desktop")}
          />
          <PreviewModeButton
            active={mode === "mobile"}
            icon={Smartphone}
            label="Mobile preview"
            onClick={() => onModeChange("mobile")}
          />
        </div>
      </div>

      <div
        aria-label={
          mode === "desktop" ? "Scrollable desktop website preview" : undefined
        }
        className={`mt-3 rounded-lg border border-slate-200 bg-slate-100 p-3 sm:p-4 ${
          mode === "desktop" ? "overflow-x-auto" : "overflow-hidden"
        }`}
        tabIndex={mode === "desktop" ? 0 : undefined}
      >
        <div
          className={`reservation-theme overflow-hidden rounded-md border border-[var(--reservation-line)] bg-[var(--reservation-ivory)] shadow-sm transition-[width,max-width] duration-300 ${
            mode === "mobile"
              ? "mx-auto w-full max-w-[22rem]"
              : "w-[58rem] max-w-none lg:mx-auto lg:w-full"
          }`}
          data-color-scheme={colorScheme.toLowerCase()}
          style={style}
        >
          <div className="flex h-12 items-center justify-between bg-[var(--reservation-primary)] px-4 text-[var(--reservation-on-primary)]">
            <span className="font-semibold tracking-[-0.02em]">Your hotel</span>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.14em] opacity-75">
              Rooms&nbsp;&nbsp; Book
            </span>
          </div>
          <div
            className={`grid ${mode === "mobile" ? "grid-cols-1" : "grid-cols-[1.12fr_.88fr]"}`}
          >
            <div className="min-w-0 bg-[var(--reservation-primary-deep)] px-5 py-8 text-[var(--reservation-on-primary)] sm:px-7 sm:py-10">
              <p className="reservation-kicker reservation-kicker-on-primary">
                Welcome to your hotel
              </p>
              <p
                className={`reservation-heading mt-3 ${
                  mode === "mobile" ? "text-3xl!" : "text-[2.15rem]!"
                }`}
              >
                A stay worth remembering.
              </p>
              <p className="mt-4 max-w-sm text-xs leading-6 opacity-72">
                Thoughtful rooms, direct reservations, and an experience shaped
                around every guest.
              </p>
              <button
                className="mt-6 inline-flex min-h-10 items-center bg-[var(--reservation-accent)] px-4 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-[var(--reservation-on-accent)]"
                type="button"
              >
                Explore rooms
              </button>
            </div>
            <div className="min-w-0 overflow-hidden bg-[var(--reservation-paper)] p-5 sm:p-7">
              <p className="reservation-kicker">Direct booking</p>
              <h4 className="mt-3 font-serif text-2xl text-[var(--reservation-ink)]">
                Reserve with confidence.
              </h4>
              <p className="mt-3 text-xs leading-6 text-[var(--reservation-muted)]">
                Clear details and comfortable choices from search to arrival.
              </p>
              <div className="mt-5 border border-[var(--reservation-line)] bg-[var(--reservation-control)] p-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[var(--reservation-subtle)]">
                  Available room
                </p>
                <p className="mt-2 font-semibold text-[var(--reservation-ink)]">
                  Executive suite
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mode === "desktop" ? (
        <p className="mt-2 text-[0.7rem] leading-5 text-slate-500 lg:hidden">
          Scroll sideways to explore the full desktop preview.
        </p>
      ) : null}
    </div>
  );
}

function PreviewModeButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Monitor;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`grid h-9 w-9 place-items-center rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-500 hover:text-slate-800"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

function BrandingImageField({
  darkPreview = false,
  description,
  existingUrl,
  fileName,
  label,
  removeField,
  square = false,
}: {
  darkPreview?: boolean;
  description: string;
  existingUrl: string | null;
  fileName: string;
  label: string;
  removeField: string;
  square?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [fileError, setFileError] = useState("");
  const imageUrl = preview ?? (!removed ? existingUrl : null);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

    if (!allowedTypes.has(file.type)) {
      event.target.value = "";
      clearSelectedPreview();
      setFileError("Choose a PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      clearSelectedPreview();
      setFileError("Choose an image that is 5MB or smaller.");
      return;
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;
    setPreview(objectUrl);
    setRemoved(false);
    setFileError("");
  }

  function clearSelectedPreview() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreview(null);
  }

  function removeCurrent() {
    const hadPreview = Boolean(previewRef.current);
    clearSelectedPreview();
    if (inputRef.current) inputRef.current.value = "";
    setFileError("");

    setRemoved(Boolean(existingUrl) && !hadPreview);
  }

  function restoreCurrent() {
    setRemoved(false);
    setFileError("");
  }

  return (
    <fieldset className="min-w-0 rounded-lg border border-slate-200 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-950">
        {label}
      </legend>
      <p className="min-h-10 text-xs leading-5 text-slate-500">{description}</p>

      <div
        className={`mt-4 grid place-items-center overflow-hidden rounded-md border border-slate-200 ${
          darkPreview ? "bg-slate-900" : "bg-slate-50"
        } ${square ? "mx-auto aspect-square w-28" : "aspect-[16/7] w-full"}`}
      >
        {imageUrl ? (
          square || preview ? (
            <div
              className={`relative ${
                square ? "h-full w-full" : "h-14 w-40 max-w-[80%]"
              }`}
            >
              <Image
                alt={`${label} preview`}
                className="object-contain p-3"
                fill
                sizes={square ? "112px" : "160px"}
                src={imageUrl}
                unoptimized={Boolean(preview) || imageUrl.includes("res.cloudinary.com")}
              />
            </div>
          ) : (
            <HotelLogo
              alt={`${label} preview`}
              className="h-14 w-40 max-w-[80%]"
              position="center"
              sizes="160px"
              url={imageUrl}
            />
          )
        ) : (
          <div className={`text-center ${darkPreview ? "text-white/55" : "text-slate-400"}`}>
            <ImagePlus aria-hidden="true" className="mx-auto h-6 w-6" />
            <p className="mt-2 text-xs">No image added</p>
          </div>
        )}
      </div>

      <input name={removeField} type="hidden" value={String(removed)} />
      {fileError ? (
        <p aria-live="polite" className="mt-3 text-xs font-medium text-red-700">
          {fileError}
        </p>
      ) : null}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        <label
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2"
          htmlFor={inputId}
        >
          <ImagePlus aria-hidden="true" className="h-4 w-4" />
          {imageUrl ? "Replace" : "Choose image"}
          <input
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            id={inputId}
            name={fileName}
            onChange={handleFile}
            ref={inputRef}
            type="file"
          />
        </label>

        {removed && existingUrl ? (
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            onClick={restoreCurrent}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Restore
          </button>
        ) : imageUrl ? (
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-red-700 transition hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
            onClick={removeCurrent}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            {preview ? "Clear selected" : "Remove"}
          </button>
        ) : null}
      </div>
    </fieldset>
  );
}
