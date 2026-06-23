export function HeroAvailabilitySearch() {
  return (
    <form
      action="/book"
      className="mt-10 grid gap-3 rounded-2xl border border-white/20 bg-white/95 p-3 text-[#172033] shadow-lg sm:grid-cols-[1fr_1fr_0.8fr_auto]"
    >
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5f6b7a]">
          Check-in
        </span>
        <input
          className="mt-1 h-11 w-full rounded-lg border border-black/10 px-3 text-sm"
          name="checkInDate"
          type="date"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5f6b7a]">
          Check-out
        </span>
        <input
          className="mt-1 h-11 w-full rounded-lg border border-black/10 px-3 text-sm"
          name="checkOutDate"
          type="date"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#5f6b7a]">
          Guests
        </span>
        <input
          className="mt-1 h-11 w-full rounded-lg border border-black/10 px-3 text-sm"
          defaultValue={1}
          min={1}
          name="guestCount"
          type="number"
        />
      </label>
      <button
        className="self-end rounded-xl bg-[#172033] px-5 py-3 text-sm font-semibold text-white hover:bg-[#24314a]"
        type="submit"
      >
        Check availability
      </button>
    </form>
  );
}
