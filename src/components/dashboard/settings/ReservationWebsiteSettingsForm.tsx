"use client";

import Image from "next/image";
import { ExternalLink, ImagePlus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";
import {
  updateReservationWebsiteSettingsAction,
  type SettingsActionState,
} from "@/features/settings/actions";
import { publicReservationPath } from "@/lib/public/routes";
import { SettingsField, settingsInputClass } from "./SettingsField";
import { SettingsPageHeader } from "./SettingsPageHeader";
import { SettingsSectionNav } from "./SettingsSectionNav";
import type { ReservationWebsiteSettingsValues } from "./settings-types";

type ExistingHeroImage = {
  publicId: string;
  url: string;
};

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function ReservationWebsiteSettingsForm({
  settings,
}: {
  settings: ReservationWebsiteSettingsValues;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateReservationWebsiteSettingsAction,
    initialActionState,
  );

  useEffect(() => {
    if (!state.ok || !state.submissionId) return;
    router.refresh();
  }, [router, state.ok, state.submissionId]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SettingsPageHeader
          description="Control how the public booking website is identified and the photography guests see first."
          showBackLink
          title="Reservation website"
        />
        <Link
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          href={publicReservationPath("/")}
          rel="noreferrer"
          target="_blank"
        >
          View website
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <SettingsSectionNav active="/dashboard/settings/reservation-website" />

      <form action={formAction} className="space-y-5">
        {state.message ? (
          <AutoDismissMessage variant={state.ok ? "success" : "error"}>
            {state.message}
          </AutoDismissMessage>
        ) : null}

        <SettingsPanel
          description="Used in browser tabs, search results, and links shared by guests."
          title="Website and search appearance"
        >
          <div className="grid gap-5">
            <SettingsField
              hint="Up to 60 characters. Leave blank to use the hotel name automatically."
              label="Website title"
            >
              <input
                className={settingsInputClass}
                defaultValue={settings.websiteTitle}
                maxLength={60}
                name="websiteTitle"
                placeholder={`${settings.hotelName} | Official Website & Reservations`}
              />
            </SettingsField>
            <SettingsField
              hint="Up to 160 characters. Leave blank to generate a booking-focused description."
              label="Website description"
            >
              <textarea
                className={`${settingsInputClass} min-h-28 resize-y py-2.5 leading-6`}
                defaultValue={settings.websiteDescription}
                maxLength={160}
                name="websiteDescription"
                placeholder={`Explore rooms, check availability, and book your stay directly with ${settings.hotelName}.`}
              />
            </SettingsField>
          </div>
        </SettingsPanel>

        <SettingsPanel
          description="Use up to four landscape photographs. They fade across the homepage hero in the order shown."
          title="Homepage hero images"
        >
          <HeroImageManager key={settings.updatedAt} settings={settings} />
        </SettingsPanel>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
            disabled={pending}
            type="submit"
          >
            <Save aria-hidden="true" className="h-4 w-4" />
            {pending ? "Saving…" : "Save website settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function HeroImageManager({
  settings,
}: {
  settings: ReservationWebsiteSettingsValues;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewsRef = useRef<string[]>([]);
  const [existing, setExisting] = useState<ExistingHeroImage[]>(() =>
    mapExisting(settings),
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(
    () => () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (existing.length + files.length > 4) {
      event.target.value = "";
      setError("Keep the hero carousel to a maximum of four images.");
      return;
    }

    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);
    setError("");
  }

  function clearSelected() {
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewsRef.current = [];
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-5">
      {existing.map((image) => (
        <div key={image.url}>
          <input name="existingHeroImages" type="hidden" value={image.url} />
          <input
            name="existingHeroImagePublicIds"
            type="hidden"
            value={image.publicId}
          />
        </div>
      ))}

      {existing.length > 0 || previews.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {existing.map((image, index) => (
            <HeroPreview
              key={image.url}
              label={`Current hero image ${index + 1}`}
              onRemove={() =>
                setExisting((items) =>
                  items.filter((item) => item.url !== image.url),
                )
              }
              src={image.url}
            />
          ))}
          {previews.map((url, index) => (
            <HeroPreview
              key={url}
              label={`New hero image ${index + 1}`}
              src={url}
              unoptimized
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-9 text-center">
          <ImagePlus
            aria-hidden="true"
            className="mx-auto h-6 w-6 text-slate-400"
          />
          <p className="mt-3 text-sm font-medium text-slate-700">
            The reservation site is using its default photography.
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Add custom hotel images whenever they are ready.
          </p>
        </div>
      )}

      {error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2">
          <ImagePlus aria-hidden="true" className="h-4 w-4" />
          Choose hero images
          <input
            accept="image/*"
            className="sr-only"
            multiple
            name="heroImages"
            onChange={handleFiles}
            ref={inputRef}
            type="file"
          />
        </label>
        {previews.length > 0 ? (
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            onClick={clearSelected}
            type="button"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Clear selected
          </button>
        ) : null}
      </div>
    </div>
  );
}

function HeroPreview({
  label,
  onRemove,
  src,
  unoptimized = false,
}: {
  label: string;
  onRemove?: () => void;
  src: string;
  unoptimized?: boolean;
}) {
  return (
    <figure className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Image
        alt={label}
        className="aspect-[16/10] w-full object-cover"
        height={240}
        src={src}
        unoptimized={unoptimized || src.includes("res.cloudinary.com")}
        width={384}
      />
      <figcaption className="border-t border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
        {label}
      </figcaption>
      {onRemove ? (
        <button
          aria-label={`Remove ${label.toLowerCase()}`}
          className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/60 bg-white/95 text-slate-800 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          onClick={onRemove}
          type="button"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </figure>
  );
}

function SettingsPanel({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

function mapExisting(settings: ReservationWebsiteSettingsValues) {
  const heroImages = settings.heroImages ?? [];
  const heroImagePublicIds = settings.heroImagePublicIds ?? [];

  return heroImages.map((url, index) => ({
    url,
    publicId: heroImagePublicIds[index] ?? "",
  }));
}
