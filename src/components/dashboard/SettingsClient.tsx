"use client";

import Image from "next/image";
import { ImagePlus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  updateSettingsAction,
  type SettingsActionState,
} from "@/features/settings/actions";
import { AutoDismissMessage } from "@/components/ui/AutoDismissMessage";

export type SettingsFormValues = {
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  currency: string;
  heroImages: string[];
  heroImagePublicIds: string[];
  updatedAt: string;
};

type SettingsClientProps = {
  settings: SettingsFormValues;
};

type ExistingHeroImage = {
  url: string;
  publicId: string;
};

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

export function SettingsClient({ settings }: SettingsClientProps) {
  const [state, formAction, pending] = useActionState(
    updateSettingsAction,
    initialActionState,
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-950">Settings</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Manage hotel information, reservation-site media, and operational defaults.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      >
        {state.message ? (
          <AutoDismissMessage variant={state.ok ? "success" : "error"}>
            {state.message}
          </AutoDismissMessage>
        ) : null}

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Hotel information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField label="Hotel name">
              <input className={inputClass} defaultValue={settings.hotelName} name="hotelName" required />
            </SettingsField>
            <SettingsField label="Phone number">
              <input autoComplete="tel" className={inputClass} defaultValue={settings.phoneNumber} name="phoneNumber" required type="tel" />
            </SettingsField>
            <SettingsField label="Email address">
              <input autoComplete="email" className={inputClass} defaultValue={settings.emailAddress} name="emailAddress" required type="email" />
            </SettingsField>
            <SettingsField className="sm:col-span-2" label="Physical address">
              <textarea className={`${inputClass} min-h-24 py-2`} defaultValue={settings.physicalAddress} name="physicalAddress" required />
            </SettingsField>
          </div>
        </section>

        <HeroImageManager key={settings.updatedAt} settings={settings} state={state} />

        <section className="space-y-4 border-t border-zinc-200 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Operational settings
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <SettingsField label="Default check-in time">
              <input className={inputClass} defaultValue={settings.defaultCheckInTime} name="defaultCheckInTime" required type="time" />
            </SettingsField>
            <SettingsField label="Default check-out time">
              <input className={inputClass} defaultValue={settings.defaultCheckOutTime} name="defaultCheckOutTime" required type="time" />
            </SettingsField>
            <SettingsField label="Currency">
              <input className={`${inputClass} uppercase`} defaultValue={settings.currency} maxLength={3} minLength={3} name="currency" required />
            </SettingsField>
          </div>
        </section>

        <div className="flex justify-end border-t border-zinc-200 pt-5">
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400" disabled={pending} type="submit">
            <Save aria-hidden="true" className="h-4 w-4" />
            {pending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function HeroImageManager({ settings, state }: { settings: SettingsFormValues; state: SettingsActionState }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewsRef = useRef<string[]>([]);
  const [existing, setExisting] = useState<ExistingHeroImage[]>(() => mapExisting(settings));
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => () => {
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    if (!state.ok || !state.submissionId) return;
    router.refresh();
  }, [router, state.ok, state.submissionId]);

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
    <section className="space-y-4 border-t border-zinc-200 pt-5">
      <div className="max-w-2xl">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Reservation website hero</h3>
        <p className="mt-1 text-sm leading-6 text-zinc-600">
          Upload up to four landscape images. They fade across the homepage hero in this order. If none are set, the curated default set remains active.
        </p>
      </div>

      {existing.map((image) => (
        <div key={image.url}>
          <input name="existingHeroImages" type="hidden" value={image.url} />
          <input name="existingHeroImagePublicIds" type="hidden" value={image.publicId} />
        </div>
      ))}

      {existing.length > 0 || previews.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {existing.map((image, index) => (
            <HeroPreview key={image.url} label={`Current hero image ${index + 1}`} onRemove={() => setExisting((items) => items.filter((item) => item.url !== image.url))} src={image.url} />
          ))}
          {previews.map((url, index) => (
            <HeroPreview key={url} label={`New hero image ${index + 1}`} src={url} unoptimized />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center text-sm text-zinc-600">
          No custom hero images. The reservation site is using its default photography.
        </div>
      )}

      {error ? <p className="text-sm font-medium text-red-700" role="alert">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
          <ImagePlus aria-hidden="true" className="h-4 w-4" />
          Choose hero images
          <input accept="image/*" className="sr-only" multiple name="heroImages" onChange={handleFiles} ref={inputRef} type="file" />
        </label>
        {previews.length > 0 ? (
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50" onClick={clearSelected} type="button">
            <Trash2 aria-hidden="true" className="h-4 w-4" /> Clear selected
          </button>
        ) : null}
      </div>
    </section>
  );
}

function HeroPreview({ label, onRemove, src, unoptimized = false }: { label: string; onRemove?: () => void; src: string; unoptimized?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-zinc-200 bg-zinc-100">
      <Image alt={label} className="aspect-[16/10] w-full object-cover" height={240} src={src} unoptimized={unoptimized || src.includes("res.cloudinary.com")} width={384} />
      {onRemove ? (
        <button aria-label={`Remove ${label.toLowerCase()}`} className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/60 bg-white/95 text-zinc-800 shadow-sm hover:bg-white" onClick={onRemove} type="button">
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

function SettingsField({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return <label className={`block ${className}`}><span className="text-sm font-medium text-zinc-800">{label}</span>{children}</label>;
}

function mapExisting(settings: SettingsFormValues) {
  const heroImages = settings.heroImages ?? [];
  const heroImagePublicIds = settings.heroImagePublicIds ?? [];

  return heroImages.map((url, index) => ({
    url,
    publicId: heroImagePublicIds[index] ?? "",
  }));
}

const inputClass = "mt-1 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900";
