import Link from "next/link";

export function PublicNavbar() {
  return (
    <header className="border-b border-black/10 bg-[#f7f3ed]/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link className="text-lg font-semibold tracking-tight" href="/">
          Obinna&apos;s Hotel
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#415064]">
          <Link className="rounded-full px-3 py-2 hover:bg-black/5" href="/">
            Home
          </Link>
          <Link
            className="rounded-full px-3 py-2 hover:bg-black/5"
            href="/rooms"
          >
            Rooms
          </Link>
          <Link
            className="rounded-full bg-[#172033] px-4 py-2 text-white hover:bg-[#24314a]"
            href="/book"
          >
            Reserve
          </Link>
          <Link
            className="rounded-full px-3 py-2 hover:bg-black/5"
            href="/login"
          >
            Staff Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
