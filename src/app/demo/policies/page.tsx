import { Clock3, FileCheck2, ShieldCheck, Undo2 } from "lucide-react";
import { getReservationSiteConfig } from "@/features/settings/queries";

export const dynamic = "force-dynamic";

export default async function HotelPoliciesPage() {
  const config = await getReservationSiteConfig();
  const policies = config.policies.resolved;

  return (
    <section className="reservation-container reservation-section max-w-5xl!">
      <div className="max-w-3xl">
        <p className="reservation-kicker">Before you reserve</p>
        <h1 className="mt-5 font-serif text-5xl leading-[0.98] tracking-[-0.04em] text-[var(--reservation-ink)] sm:text-6xl">
          Hotel policies, explained clearly.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--reservation-muted)]">
          Review the policies that apply to reservation requests and stays at {" "}
          {config.hotel.name}. Contact reception if anything needs clarification
          before you submit a reservation.
        </p>
      </div>

      <div className="mt-12 divide-y divide-[var(--reservation-line)] border-y border-[var(--reservation-line)]">
        <PolicySection
          icon={<Undo2 />}
          text={policies.cancellationPolicy}
          title="Cancellation policy"
        />
        <PolicySection
          icon={<Clock3 />}
          text={policies.checkInRequirements}
          title="Check-in requirements"
        />
        <PolicySection
          icon={<ShieldCheck />}
          text={policies.houseRules}
          title="Hotel and house rules"
        />
        <PolicySection
          icon={<FileCheck2 />}
          text={policies.reservationTerms}
          title="Reservation terms"
        />
      </div>
    </section>
  );
}

function PolicySection({
  icon,
  text,
  title,
}: {
  icon: React.ReactNode;
  text: string;
  title: string;
}) {
  return (
    <article className="grid gap-5 py-8 sm:grid-cols-[3rem_minmax(0,1fr)] sm:py-10">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center bg-[var(--reservation-primary)] text-[var(--reservation-on-primary)] [&>svg]:h-5 [&>svg]:w-5"
      >
        {icon}
      </span>
      <div>
        <h2 className="font-serif text-2xl text-[var(--reservation-ink)]">
          {title}
        </h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--reservation-muted)]">
          {text}
        </p>
      </div>
    </article>
  );
}
