export function PublicFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#172033] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 text-sm sm:grid-cols-3 lg:px-8">
        <div>
          <p className="text-base font-semibold">Obinna&apos;s Hotel</p>
          <p className="mt-2 max-w-sm text-white/70">
            Elegant stays, thoughtful service, and seamless reservations.
          </p>
        </div>
        <div>
          <p className="font-semibold">Reservations</p>
          <p className="mt-2 text-white/70">
            Book online and present your booking number at reception.
          </p>
        </div>
        <div>
          <p className="font-semibold">Hotel Operations</p>
          <p className="mt-2 text-white/70">
            Public reservations flow directly into the internal HMS.
          </p>
        </div>
      </div>
    </footer>
  );
}
