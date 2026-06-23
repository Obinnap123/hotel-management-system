export function AboutHotel() {
  return (
    <section className="bg-[#f7f3ed]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_55px_rgba(23,32,51,0.08)]">
          <img
            alt="Elegant hotel lounge"
            className="h-[420px] w-full object-cover"
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a6f46]">
            About the hotel
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
            A refined stay experience, backed by organized hotel operations.
          </h2>
          <p className="mt-5 leading-8 text-[#5f6b7a]">
            Obinna&apos;s Hotel brings together warm hospitality, practical
            comfort, and a reservation process that is simple for guests and
            immediately visible to hotel staff.
          </p>
          <p className="mt-4 leading-8 text-[#5f6b7a]">
            Every online reservation flows into the hotel management system, so
            reception can prepare for arrivals, confirm payments, and manage
            each stay with clarity.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Metric label="Guest-first" value="Service" />
            <Metric label="Direct" value="Reservations" />
            <Metric label="Reliable" value="Operations" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-lg font-semibold text-[#172033]">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#7b8794]">
        {label}
      </p>
    </div>
  );
}
