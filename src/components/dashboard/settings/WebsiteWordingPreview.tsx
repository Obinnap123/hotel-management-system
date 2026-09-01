"use client";

import Image from "next/image";
import {
  BedDouble,
  MapPin,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import type { ReservationWebsiteCopy } from "@/lib/reservation-content";
import {
  createReservationThemeStyle,
  type ReservationThemeSettings,
} from "@/lib/reservation-theme";
import type { ReservationFacility } from "@/lib/reservation-facilities";
import { ReservationFacilityIcon } from "@/components/public/ReservationFacilityIcon";

export const wordingPreviewSections = [
  { value: "hero", label: "Hero" },
  { value: "featured", label: "Featured rooms" },
  { value: "amenities", label: "Amenities" },
  { value: "about", label: "About" },
  { value: "rooms", label: "Rooms page" },
  { value: "footer", label: "Footer" },
] as const;

export type WordingPreviewSection =
  (typeof wordingPreviewSections)[number]["value"];

type WebsiteWordingPreviewProps = {
  activeSection: WordingPreviewSection;
  copy: ReservationWebsiteCopy;
  facilities: ReservationFacility[];
  hotelName: string;
  initialMode?: "desktop" | "mobile";
  isDirty: boolean;
  onSectionChange: (section: WordingPreviewSection) => void;
  preview: ReservationThemeSettings & {
    emailAddress: string;
    heroImageUrl: string;
    aboutImageUrl: string;
    phoneNumber: string;
    physicalAddress: string;
  };
};

export function WebsiteWordingPreview({
  activeSection,
  copy,
  facilities,
  hotelName,
  initialMode = "desktop",
  isDirty,
  onSectionChange,
  preview,
}: WebsiteWordingPreviewProps) {
  const [mode, setMode] = useState<"desktop" | "mobile">(initialMode);
  const style = createReservationThemeStyle(preview);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-950">Live preview</p>
            <span
              aria-live="polite"
              className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                isDirty
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {isDirty ? "Unsaved preview" : "Published wording"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Changes appear here while you type. Save to publish them.
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
            onClick={() => setMode("desktop")}
          />
          <PreviewModeButton
            active={mode === "mobile"}
            icon={Smartphone}
            label="Mobile preview"
            onClick={() => setMode("mobile")}
          />
        </div>
      </div>

      <div
        aria-label="Website section to preview"
        className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1"
        role="group"
      >
        {wordingPreviewSections.map((section) => (
          <button
            aria-pressed={activeSection === section.value}
            className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
              activeSection === section.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
            key={section.value}
            onClick={() => onSectionChange(section.value)}
            type="button"
          >
            {section.label}
          </button>
        ))}
      </div>

      <div
        aria-label={`${mode === "desktop" ? "Desktop" : "Mobile"} ${wordingPreviewSections.find((section) => section.value === activeSection)?.label} preview`}
        className={`mt-3 rounded-lg border border-slate-200 bg-slate-100 p-3 ${
          mode === "desktop" ? "overflow-x-auto" : "overflow-hidden"
        }`}
        tabIndex={mode === "desktop" ? 0 : undefined}
      >
        <div
          className={`reservation-theme overflow-hidden rounded-md border border-[var(--reservation-line)] bg-[var(--reservation-ivory)] shadow-sm ${
            mode === "mobile"
              ? "mx-auto w-full max-w-[20rem]"
              : "w-[52rem] max-w-none"
          }`}
          data-color-scheme={preview.colorScheme.toLowerCase()}
          style={style}
        >
          <PreviewNavbar hotelName={hotelName} mobile={mode === "mobile"} />
          <PreviewSection
            copy={copy}
            facilities={facilities}
            hotelName={hotelName}
            mobile={mode === "mobile"}
            preview={preview}
            section={activeSection}
          />
        </div>
      </div>
      {mode === "desktop" ? (
        <p className="mt-2 text-[0.7rem] leading-5 text-slate-500">
          Scroll sideways when the full desktop frame is wider than this panel.
        </p>
      ) : null}
    </div>
  );
}

function PreviewNavbar({ hotelName, mobile }: { hotelName: string; mobile: boolean }) {
  return (
    <div className="flex h-12 items-center justify-between bg-[var(--reservation-primary)] px-4 text-[var(--reservation-on-primary)]">
      <span className="max-w-[12rem] truncate text-xs font-semibold tracking-[-0.01em]">
        {hotelName}
      </span>
      <span className="text-[0.55rem] font-bold uppercase tracking-[0.14em] opacity-75">
        {mobile ? "Menu" : "Rooms   Our hotel   Reserve"}
      </span>
    </div>
  );
}

function PreviewSection({
  copy,
  facilities,
  hotelName,
  mobile,
  preview,
  section,
}: {
  copy: ReservationWebsiteCopy;
  facilities: ReservationFacility[];
  hotelName: string;
  mobile: boolean;
  preview: WebsiteWordingPreviewProps["preview"];
  section: WordingPreviewSection;
}) {
  switch (section) {
    case "hero":
      return <HeroPreview copy={copy} imageUrl={preview.heroImageUrl} mobile={mobile} />;
    case "featured":
      return <FeaturedPreview copy={copy} mobile={mobile} />;
    case "amenities":
      return <AmenitiesPreview copy={copy} facilities={facilities} mobile={mobile} />;
    case "about":
      return <AboutPreview copy={copy} hotelName={hotelName} imageUrl={preview.aboutImageUrl} mobile={mobile} />;
    case "rooms":
      return <RoomsPreview copy={copy} mobile={mobile} />;
    case "footer":
      return <FooterPreview copy={copy} hotelName={hotelName} mobile={mobile} preview={preview} />;
  }
}

function HeroPreview({ copy, imageUrl, mobile }: { copy: ReservationWebsiteCopy; imageUrl: string; mobile: boolean }) {
  return (
    <section className={`relative overflow-hidden bg-[var(--reservation-primary-deep)] text-[var(--reservation-on-primary)] ${mobile ? "min-h-[29rem]" : "min-h-[25rem]"}`}>
      {imageUrl ? <Image alt="" aria-hidden="true" className="object-cover" fill sizes={mobile ? "320px" : "832px"} src={imageUrl} unoptimized={imageUrl.includes("res.cloudinary.com")} /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,29,24,.88)_0%,rgba(9,30,26,.52)_64%,rgba(9,25,22,.2)_100%)]" />
      <div className={`relative flex min-h-[inherit] flex-col justify-end ${mobile ? "p-5 pb-8" : "p-8"}`}>
        <p className="reservation-kicker reservation-kicker-on-primary">{copy.heroEyebrow}</p>
        <h2 className={`mt-4 whitespace-pre-line font-serif leading-[.94] tracking-[-0.035em] ${mobile ? "text-[2.6rem]" : "max-w-[34rem] text-[3.8rem]"}`}>{copy.heroHeading}</h2>
        <p className={`mt-5 leading-6 text-white/76 ${mobile ? "text-xs" : "max-w-[30rem] text-sm"}`}>{copy.heroDescription}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="inline-flex min-h-10 items-center bg-[var(--reservation-accent)] px-4 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-[var(--reservation-on-accent)]">{copy.heroPrimaryCtaLabel}</span>
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.13em] text-white/80">{copy.heroSecondaryCtaLabel}</span>
        </div>
      </div>
    </section>
  );
}

function FeaturedPreview({ copy, mobile }: { copy: ReservationWebsiteCopy; mobile: boolean }) {
  return (
    <section className={mobile ? "p-5 py-8" : "p-8"}>
      <div className={mobile ? "space-y-4" : "grid grid-cols-[1fr_.72fr] items-end gap-7"}>
        <div><p className="reservation-kicker">{copy.featuredEyebrow}</p><h2 className={`${previewHeadingClass(mobile)} mt-3`}>{copy.featuredHeading}</h2></div>
        <div><p className="text-xs leading-6 text-[var(--reservation-muted)]">{copy.featuredDescription}</p><p className="mt-4 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-[var(--reservation-accent-copy)] underline decoration-[var(--reservation-accent-copy)] underline-offset-4">{copy.featuredCtaLabel}</p></div>
      </div>
      <div className={`mt-7 grid gap-4 ${mobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {["Executive suite", "Deluxe room", "Classic room"].slice(0, mobile ? 1 : 3).map((room) => <SampleRoomCard key={room} title={room} />)}
      </div>
    </section>
  );
}

function AmenitiesPreview({ copy, facilities, mobile }: { copy: ReservationWebsiteCopy; facilities: ReservationFacility[]; mobile: boolean }) {
  const items = facilities.slice(0, mobile ? 3 : 6);
  return (
    <section className={`bg-[var(--reservation-primary)] text-[var(--reservation-on-primary)] ${mobile ? "p-5 py-8" : "p-8"}`}>
      <div className={mobile ? "space-y-4" : "grid grid-cols-[.8fr_1fr] items-end gap-8"}>
        <div><p className="reservation-kicker reservation-kicker-on-primary">{copy.amenitiesEyebrow}</p><h2 className={`${previewHeadingClass(mobile)} mt-3`}>{copy.amenitiesHeading}</h2></div>
        <p className="text-xs leading-6 text-white/68">{copy.amenitiesDescription}</p>
      </div>
      <div className={`mt-7 grid border-l border-t border-white/15 ${mobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {items.map((facility) => <div className="border-b border-r border-white/15 p-4" key={facility.id}><ReservationFacilityIcon className="h-4 w-4 text-[var(--reservation-accent-on-primary)]" iconKey={facility.iconKey} /><p className="mt-4 font-serif text-lg">{facility.title || "Facility name"}</p><p className="mt-1 text-[0.68rem] leading-5 text-white/58">{facility.description || "Short facility description"}</p></div>)}
      </div>
    </section>
  );
}

function AboutPreview({ copy, hotelName, imageUrl, mobile }: { copy: ReservationWebsiteCopy; hotelName: string; imageUrl: string; mobile: boolean }) {
  return (
    <section className={`grid gap-7 ${mobile ? "p-5 py-8" : "grid-cols-[.85fr_1.15fr] items-center p-8"}`}>
      <div className="relative">
        <Image alt={`Hotel lounge at ${hotelName}`} className={`w-full object-cover ${mobile ? "aspect-[5/3]" : "aspect-[4/5]"}`} height={500} src={imageUrl} unoptimized={imageUrl.startsWith("blob:") || imageUrl.includes("res.cloudinary.com")} width={600} />
        <p className="absolute -bottom-3 right-3 max-w-[11rem] bg-[var(--reservation-paper)] p-3 font-serif text-sm leading-tight text-[var(--reservation-primary)] shadow-lg">{copy.aboutImageCaption}</p>
      </div>
      <div><p className="reservation-kicker">{copy.aboutEyebrow}</p><h2 className={`${previewHeadingClass(mobile)} mt-3`}>{copy.aboutHeading}</h2><div className="mt-5 space-y-3 text-xs leading-6 text-[var(--reservation-muted)]"><p>{copy.aboutBodyPrimary}</p><p>{copy.aboutBodySecondary}</p></div></div>
    </section>
  );
}

function RoomsPreview({ copy, mobile }: { copy: ReservationWebsiteCopy; mobile: boolean }) {
  return (
    <section className={mobile ? "p-5 py-8" : "p-8"}>
      <p className="reservation-kicker">{copy.roomsEyebrow}</p>
      <div className={mobile ? "mt-3 space-y-4" : "mt-3 grid grid-cols-[1.1fr_.9fr] items-end gap-8"}><h2 className={previewHeadingClass(mobile)}>{copy.roomsHeading}</h2><p className="text-xs leading-6 text-[var(--reservation-muted)]">{copy.roomsDescription}</p></div>
      <div className={`mt-7 grid gap-4 ${mobile ? "grid-cols-1" : "grid-cols-3"}`}>{["Executive suite", "Deluxe room", "Classic room"].slice(0, mobile ? 1 : 3).map((room) => <SampleRoomCard key={room} title={room} />)}</div>
    </section>
  );
}

function FooterPreview({ copy, hotelName, mobile, preview }: { copy: ReservationWebsiteCopy; hotelName: string; mobile: boolean; preview: WebsiteWordingPreviewProps["preview"] }) {
  return (
    <footer className={`bg-[var(--reservation-primary-deep)] text-[var(--reservation-on-primary)] ${mobile ? "p-5 py-8" : "p-8"}`}>
      <div className={mobile ? "space-y-8" : "grid grid-cols-[1.15fr_.55fr_.85fr] gap-8"}>
        <div><p className="reservation-kicker reservation-kicker-on-primary">{copy.footerEyebrow}</p><h2 className={`${previewHeadingClass(mobile)} mt-3`}>{copy.footerHeading}</h2><span className="mt-5 inline-flex min-h-10 items-center bg-[var(--reservation-accent)] px-4 text-[0.58rem] font-bold uppercase tracking-[0.13em] text-[var(--reservation-on-accent)]">{copy.footerCtaLabel}</span></div>
        <div><p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/60">Explore</p><div className="mt-4 space-y-3 text-xs text-white/72"><p>Home</p><p>Rooms & suites</p><p>Reservations</p></div></div>
        <div><p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/60">Find us</p><div className="mt-4 space-y-3 text-xs leading-5 text-white/72"><p className="flex gap-2"><MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--reservation-accent-on-primary)]" />{preview.physicalAddress || "Hotel address"}</p><p>{preview.phoneNumber || "Reception phone number"}</p><p className="break-all">{preview.emailAddress || "Hotel email address"}</p></div></div>
      </div>
      <p className="mt-8 border-t border-white/12 pt-4 text-[0.58rem] uppercase tracking-[0.1em] text-white/55">© {new Date().getFullYear()} {hotelName}</p>
    </footer>
  );
}

function SampleRoomCard({ title }: { title: string }) {
  return <article className="min-w-0 border border-[var(--reservation-line)] bg-[var(--reservation-paper)]"><div className="grid aspect-[4/2.5] place-items-center bg-[var(--reservation-image-placeholder)]"><BedDouble aria-hidden="true" className="h-6 w-6 text-[var(--reservation-subtle)]" /></div><div className="p-3"><p className="truncate font-serif text-base text-[var(--reservation-ink)]">{title}</p><p className="mt-1 text-[0.62rem] text-[var(--reservation-muted)]">Up to 2 guests</p></div></article>;
}

function PreviewModeButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Monitor; label: string; onClick: () => void }) {
  return <button aria-label={label} aria-pressed={active} className={`grid h-9 w-9 place-items-center rounded transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 ${active ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`} onClick={onClick} title={label} type="button"><Icon aria-hidden="true" className="h-4 w-4" /></button>;
}

function previewHeadingClass(mobile: boolean) {
  return `font-serif leading-[1.02] tracking-[-0.03em] ${mobile ? "text-[2rem]" : "text-[2.45rem]"}`;
}
