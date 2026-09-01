"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  ImagePlus,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
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
import { notifyReservationSiteUpdated } from "@/lib/public/site-refresh";
import {
  reservationWebsiteCopyLimits,
  resolveReservationWebsiteCopy,
  type ReservationWebsiteCopy,
} from "@/lib/reservation-content";
import {
  defaultReservationFacilities,
  reservationFacilityIconOptions,
  reservationFacilityLimits,
  type ReservationFacility,
  type ReservationFacilityIconKey,
} from "@/lib/reservation-facilities";
import { ReservationFacilityIcon } from "@/components/public/ReservationFacilityIcon";
import { SettingsField, settingsInputClass } from "./SettingsField";
import { SettingsPageHeader } from "./SettingsPageHeader";
import { SettingsSectionNav } from "./SettingsSectionNav";
import type { ReservationWebsiteSettingsValues } from "./settings-types";
import {
  WebsiteWordingPreview,
  type WordingPreviewSection,
} from "./WebsiteWordingPreview";

type ExistingHeroImage = {
  publicId: string;
  url: string;
};

type PageScrollLockSnapshot = {
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  htmlOverflow: string;
  scrollY: number;
};

const initialActionState: SettingsActionState = {
  ok: false,
  message: "",
  submissionId: "",
};

const reservationWebsiteCopyFields = Object.keys(
  reservationWebsiteCopyLimits,
) as Array<keyof ReservationWebsiteCopy>;

export function ReservationWebsiteSettingsForm({
  settings,
}: {
  settings: ReservationWebsiteSettingsValues;
}) {
  const router = useRouter();
  const publishedCopy = resolveReservationWebsiteCopy(
    settings.configuredCopy,
    settings.defaultCopy,
  );
  const [state, formAction, pending] = useActionState(
    updateReservationWebsiteSettingsAction,
    initialActionState,
  );
  const [draftCopy, setDraftCopy] = useState<ReservationWebsiteCopy>(() =>
    publishedCopy,
  );
  const [activePreviewSection, setActivePreviewSection] =
    useState<WordingPreviewSection>("hero");
  const [facilities, setFacilities] = useState<ReservationFacility[]>(() =>
    settings.facilities.map((facility) => ({ ...facility })),
  );
  const [aboutImagePreviewUrl, setAboutImagePreviewUrl] = useState(
    settings.aboutImage.url,
  );
  const [aboutImageDirty, setAboutImageDirty] = useState(false);
  const wordingPreviewDialogRef = useRef<HTMLDialogElement | null>(null);
  const pageScrollLockRef = useRef<PageScrollLockSnapshot | null>(null);
  const wordingDirty = reservationWebsiteCopyFields.some(
    (field) => draftCopy[field] !== publishedCopy[field],
  );
  const facilitiesDirty =
    JSON.stringify(facilities.map(({ title, description, iconKey }) => ({ title, description, iconKey }))) !==
    JSON.stringify(settings.facilities.map(({ title, description, iconKey }) => ({ title, description, iconKey })));
  const previewDirty = wordingDirty || facilitiesDirty || aboutImageDirty;

  useEffect(() => {
    if (!state.ok || !state.submissionId) return;
    notifyReservationSiteUpdated();
    router.refresh();
  }, [router, state.ok, state.submissionId]);

  useEffect(
    () => () => {
      releasePageScroll();
    },
    [],
  );

  function lockPageScroll() {
    if (pageScrollLockRef.current) return;

    pageScrollLockRef.current = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
      scrollY: window.scrollY,
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${pageScrollLockRef.current.scrollY}px`;
    document.body.style.width = "100%";
  }

  function releasePageScroll() {
    const snapshot = pageScrollLockRef.current;
    if (!snapshot) return;

    document.documentElement.style.overflow = snapshot.htmlOverflow;
    document.body.style.overflow = snapshot.bodyOverflow;
    document.body.style.position = snapshot.bodyPosition;
    document.body.style.top = snapshot.bodyTop;
    document.body.style.width = snapshot.bodyWidth;
    pageScrollLockRef.current = null;
    window.scrollTo({ left: 0, top: snapshot.scrollY, behavior: "instant" });
  }

  function openWordingPreview() {
    const dialog = wordingPreviewDialogRef.current;
    if (!dialog || dialog.open) return;

    lockPageScroll();
    dialog.showModal();
  }

  function closeWordingPreview() {
    wordingPreviewDialogRef.current?.close();
    releasePageScroll();
  }

  function handleWordingChange(event: FormEvent<HTMLDivElement>) {
    const target = event.target;

    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      return;
    }

    const name = target.name as keyof ReservationWebsiteCopy;
    if (!(name in reservationWebsiteCopyLimits)) return;

    setDraftCopy((current) => ({
      ...current,
      [name]: target.value.trim() || settings.defaultCopy[name],
    }));
  }

  function updateFacility(
    id: string,
    field: "title" | "description" | "iconKey",
    value: string,
  ) {
    setFacilities((current) =>
      current.map((facility) =>
        facility.id === id
          ? { ...facility, [field]: value as ReservationFacilityIconKey }
          : facility,
      ),
    );
  }

  function addFacility() {
    if (facilities.length >= reservationFacilityLimits.maximum) return;

    setFacilities((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        iconKey: "WIFI",
        displayOrder: current.length,
      },
    ]);
    setActivePreviewSection("amenities");
  }

  function removeFacility(id: string) {
    if (facilities.length <= reservationFacilityLimits.minimum) return;
    setFacilities((current) =>
      current
        .filter((facility) => facility.id !== id)
        .map((facility, displayOrder) => ({ ...facility, displayOrder })),
    );
  }

  function moveFacility(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= facilities.length) return;

    setFacilities((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next.map((facility, displayOrder) => ({
        ...facility,
        displayOrder,
      }));
    });
  }

  function restoreFacilities() {
    setFacilities(
      defaultReservationFacilities.map((facility) => ({ ...facility })),
    );
    setActivePreviewSection("amenities");
  }

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
        <input
          name="facilities"
          type="hidden"
          value={JSON.stringify(
            facilities.map((facility, displayOrder) => ({
              title: facility.title,
              description: facility.description,
              iconKey: facility.iconKey,
              displayOrder,
            })),
          )}
        />
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
          description="Personalize the main wording guests see. Leave any field blank to keep the recommended wording shown as its example."
          title="Website wording"
        >
          <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 xl:hidden">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Preview your changes
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Check the selected section without leaving this form.
              </p>
            </div>
            <button
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              onClick={openWordingPreview}
              type="button"
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              Preview
            </button>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,.72fr)] xl:items-start">
          <div
            className="divide-y divide-slate-200"
            onInputCapture={handleWordingChange}
          >
            <ContentGroup
              description="The first message and actions guests see when they arrive on the website."
              onFocus={() => setActivePreviewSection("hero")}
              title="Homepage hero"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <WebsiteCopyField
                  label="Welcome text"
                  name="heroEyebrow"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Main heading"
                  multiline
                  name="heroHeading"
                  settings={settings}
                />
                <WebsiteCopyField
                  className="sm:col-span-2"
                  label="Introduction"
                  multiline
                  name="heroDescription"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Primary button"
                  name="heroPrimaryCtaLabel"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Secondary link"
                  name="heroSecondaryCtaLabel"
                  settings={settings}
                />
              </div>
            </ContentGroup>

            <ContentGroup
              description="Introduces the room categories highlighted on the homepage."
              onFocus={() => setActivePreviewSection("featured")}
              title="Featured rooms"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <WebsiteCopyField
                  label="Section label"
                  name="featuredEyebrow"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Link text"
                  name="featuredCtaLabel"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Heading"
                  multiline
                  name="featuredHeading"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Introduction"
                  multiline
                  name="featuredDescription"
                  settings={settings}
                />
              </div>
            </ContentGroup>

            <ContentGroup
              description="Explains the hotel conveniences shown above the facility cards."
              onFocus={() => setActivePreviewSection("amenities")}
              title="Amenities introduction"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <WebsiteCopyField
                  label="Section label"
                  name="amenitiesEyebrow"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Heading"
                  multiline
                  name="amenitiesHeading"
                  settings={settings}
                />
                <WebsiteCopyField
                  className="sm:col-span-2"
                  label="Introduction"
                  multiline
                  name="amenitiesDescription"
                  settings={settings}
                />
              </div>
            </ContentGroup>

            <ContentGroup
              description="Tells guests what makes the hotel and its service distinctive."
              onFocus={() => setActivePreviewSection("about")}
              title="About the hotel"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <WebsiteCopyField
                  label="Section label"
                  name="aboutEyebrow"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Image caption"
                  multiline
                  name="aboutImageCaption"
                  settings={settings}
                />
                <WebsiteCopyField
                  className="sm:col-span-2"
                  label="Heading"
                  multiline
                  name="aboutHeading"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="First paragraph"
                  multiline
                  name="aboutBodyPrimary"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Second paragraph"
                  multiline
                  name="aboutBodySecondary"
                  settings={settings}
                />
              </div>
            </ContentGroup>

            <ContentGroup
              description="Introduces the complete room collection on the Rooms & Suites page."
              onFocus={() => setActivePreviewSection("rooms")}
              title="Rooms & Suites page"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <WebsiteCopyField
                  label="Page label"
                  name="roomsEyebrow"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Heading"
                  multiline
                  name="roomsHeading"
                  settings={settings}
                />
                <WebsiteCopyField
                  className="sm:col-span-2"
                  label="Introduction"
                  multiline
                  name="roomsDescription"
                  settings={settings}
                />
              </div>
            </ContentGroup>

            <ContentGroup
              description="The final invitation shown before guests leave the website."
              onFocus={() => setActivePreviewSection("footer")}
              title="Footer invitation"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <WebsiteCopyField
                  label="Section label"
                  name="footerEyebrow"
                  settings={settings}
                />
                <WebsiteCopyField
                  label="Button text"
                  name="footerCtaLabel"
                  settings={settings}
                />
                <WebsiteCopyField
                  className="sm:col-span-2"
                  label="Heading"
                  multiline
                  name="footerHeading"
                  settings={settings}
                />
              </div>
            </ContentGroup>
          </div>
            <div className="hidden min-w-0 xl:sticky xl:top-6 xl:block">
              <WebsiteWordingPreview
                activeSection={activePreviewSection}
                copy={draftCopy}
                hotelName={settings.hotelName}
                facilities={facilities}
                isDirty={previewDirty}
                onSectionChange={setActivePreviewSection}
                preview={{
                  ...settings.preview,
                  aboutImageUrl: aboutImagePreviewUrl,
                }}
              />
            </div>
          </div>

          <dialog
            aria-labelledby="wording-preview-dialog-title"
            className="m-auto max-h-[92dvh] w-[min(94vw,64rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 text-slate-950 shadow-2xl backdrop:bg-slate-950/55"
            onCancel={(event) => event.preventDefault()}
            onClose={releasePageScroll}
            ref={wordingPreviewDialogRef}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
              <div>
                <h4 className="text-sm font-semibold" id="wording-preview-dialog-title">
                  Website wording preview
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                  Review your draft, then close this window to continue editing.
                </p>
              </div>
              <button
                aria-label="Close wording preview"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                onClick={closeWordingPreview}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <WebsiteWordingPreview
                activeSection={activePreviewSection}
                copy={draftCopy}
                hotelName={settings.hotelName}
                initialMode="mobile"
                facilities={facilities}
                isDirty={previewDirty}
                onSectionChange={setActivePreviewSection}
                preview={{
                  ...settings.preview,
                  aboutImageUrl: aboutImagePreviewUrl,
                }}
              />
            </div>
          </dialog>
        </SettingsPanel>

        <SettingsPanel
          description="Choose the practical services guests see on the homepage. Their order here is their order on the website."
          title="Homepage facilities"
        >
          <div className="space-y-4">
            {facilities.map((facility, index) => (
              <FacilityEditorCard
                facility={facility}
                index={index}
                isFirst={index === 0}
                isLast={index === facilities.length - 1}
                key={facility.id}
                onChange={updateFacility}
                onMove={moveFacility}
                onRemove={removeFacility}
                removeDisabled={
                  facilities.length <= reservationFacilityLimits.minimum
                }
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200 pt-5">
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={facilities.length >= reservationFacilityLimits.maximum}
              onClick={addFacility}
              type="button"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add facility
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              onClick={restoreFacilities}
              type="button"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Restore recommended facilities
            </button>
          </div>
        </SettingsPanel>

        <SettingsPanel
          description="Upload the photograph used beside the About Hotel story. A clear description helps guests who use screen readers."
          title="About Hotel image"
        >
          <AboutImageManager
            key={`${settings.updatedAt}-${settings.aboutImage.url}`}
            onDirtyChange={setAboutImageDirty}
            onPreviewChange={setAboutImagePreviewUrl}
            settings={settings}
          />
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

function ContentGroup({
  children,
  description,
  onFocus,
  title,
}: {
  children: React.ReactNode;
  description: string;
  onFocus: () => void;
  title: string;
}) {
  return (
    <section
      className="py-7 first:pt-0 last:pb-0"
      onFocusCapture={onFocus}
    >
      <div className="mb-5 max-w-2xl">
        <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function WebsiteCopyField({
  className,
  label,
  multiline = false,
  name,
  settings,
}: {
  className?: string;
  label: string;
  multiline?: boolean;
  name: keyof ReservationWebsiteCopy;
  settings: ReservationWebsiteSettingsValues;
}) {
  const maximumLength = reservationWebsiteCopyLimits[name];
  const sharedProps = {
    defaultValue: settings.configuredCopy[name],
    maxLength: maximumLength,
    name,
    placeholder: settings.defaultCopy[name],
  };

  return (
    <SettingsField
      className={className}
      hint={`Up to ${maximumLength} characters. Leave blank to use the recommended wording.`}
      label={label}
    >
      {multiline ? (
        <textarea
          {...sharedProps}
          className={`${settingsInputClass} min-h-24 resize-y py-2.5 leading-6`}
          rows={name.includes("Body") ? 5 : 3}
        />
      ) : (
        <input {...sharedProps} className={settingsInputClass} />
      )}
    </SettingsField>
  );
}

function FacilityEditorCard({
  facility,
  index,
  isFirst,
  isLast,
  onChange,
  onMove,
  onRemove,
  removeDisabled,
}: {
  facility: ReservationFacility;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onChange: (
    id: string,
    field: "title" | "description" | "iconKey",
    value: string,
  ) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  removeDisabled: boolean;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-700">
            <ReservationFacilityIcon
              className="h-4 w-4"
              iconKey={facility.iconKey}
            />
          </span>
          <p className="truncate text-sm font-semibold text-slate-950">
            Facility {index + 1}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            disabled={isFirst}
            label={`Move facility ${index + 1} up`}
            onClick={() => onMove(index, -1)}
          >
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </IconButton>
          <IconButton
            disabled={isLast}
            label={`Move facility ${index + 1} down`}
            onClick={() => onMove(index, 1)}
          >
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </IconButton>
          <IconButton
            disabled={removeDisabled}
            label={`Remove facility ${index + 1}`}
            onClick={() => onRemove(facility.id)}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <SettingsField
          hint={`Up to ${reservationFacilityLimits.title} characters.`}
          label="Facility name"
        >
          <input
            className={settingsInputClass}
            maxLength={reservationFacilityLimits.title}
            onChange={(event) =>
              onChange(facility.id, "title", event.target.value)
            }
            required
            value={facility.title}
          />
        </SettingsField>
        <SettingsField label="Icon">
          <select
            className={settingsInputClass}
            onChange={(event) =>
              onChange(facility.id, "iconKey", event.target.value)
            }
            value={facility.iconKey}
          >
            {reservationFacilityIconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingsField>
        <SettingsField
          className="sm:col-span-2"
          hint={`Up to ${reservationFacilityLimits.description} characters.`}
          label="Short description"
        >
          <input
            className={settingsInputClass}
            maxLength={reservationFacilityLimits.description}
            onChange={(event) =>
              onChange(facility.id, "description", event.target.value)
            }
            required
            value={facility.description}
          />
        </SettingsField>
      </div>
    </article>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function AboutImageManager({
  onDirtyChange,
  onPreviewChange,
  settings,
}: {
  onDirtyChange: (dirty: boolean) => void;
  onPreviewChange: (url: string) => void;
  settings: ReservationWebsiteSettingsValues;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(settings.aboutImage.url);
  const [removeExisting, setRemoveExisting] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  function replacePreview(url: string) {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setPreviewUrl(url);
    onPreviewChange(url);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setError("Choose a PNG, JPG, or WebP image that is 5 MB or smaller.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    setRemoveExisting(false);
    setError("");
    onPreviewChange(nextUrl);
    onDirtyChange(true);
  }

  function restoreDefault() {
    if (inputRef.current) inputRef.current.value = "";
    replacePreview(settings.aboutImage.defaultUrl);
    setRemoveExisting(true);
    setError("");
    onDirtyChange(!settings.aboutImage.isDefault);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,.72fr)] lg:items-start">
      <div className="space-y-5">
        <input
          name="removeAboutImage"
          type="hidden"
          value={removeExisting ? "true" : "false"}
        />
        <SettingsField
          hint="Describe what is visible in the image, not its file name. Up to 120 characters."
          label="Image description"
        >
          <input
            className={settingsInputClass}
            defaultValue={settings.aboutImage.alternativeText}
            maxLength={120}
            name="aboutImageAlt"
            placeholder={`A welcoming space at ${settings.hotelName}`}
          />
        </SettingsField>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2">
            <ImagePlus aria-hidden="true" className="h-4 w-4" />
            {settings.aboutImage.isDefault ? "Choose an image" : "Replace image"}
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              name="aboutImage"
              onChange={handleFile}
              ref={inputRef}
              type="file"
            />
          </label>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            onClick={restoreDefault}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Use recommended image
          </button>
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <figure className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <Image
          alt="About Hotel image preview"
          className="aspect-[5/4] w-full object-cover"
          height={500}
          src={previewUrl}
          unoptimized={
            previewUrl.startsWith("blob:") ||
            previewUrl.includes("res.cloudinary.com")
          }
          width={625}
        />
        <figcaption className="border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          {removeExisting || settings.aboutImage.isDefault
            ? "Recommended image"
            : "Current About Hotel image"}
        </figcaption>
      </figure>
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
