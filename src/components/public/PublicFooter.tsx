import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

type PublicFooterProps = {
  hotelName: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
};

export function PublicFooter({
  emailAddress,
  hotelName,
  phoneNumber,
  physicalAddress,
}: PublicFooterProps) {
  const displayAddress = physicalAddress || "Address available on request";
  const displayPhone = phoneNumber || "Reception available on request";
  const displayEmail = emailAddress || "reservations available on request";

  return (
    <footer className="border-t border-white/10 bg-[#101725] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.9fr_0.9fr]">
          <div>
            <p className="text-xl font-semibold tracking-tight">{hotelName}</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/66">
              Elegant stays, thoughtful service, and reservations that flow
              directly into hotel operations.
            </p>
            <Link
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#172033] transition hover:bg-white/90"
              href="/book"
            >
              Reserve your stay
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6bd8d]">
              Explore
            </p>
            <nav className="mt-4 grid gap-3 text-sm text-white/68">
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
              <Link className="transition hover:text-white" href="/rooms">
                Rooms
              </Link>
              <Link className="transition hover:text-white" href="/book">
                Reserve
              </Link>
              <Link className="transition hover:text-white" href="/login">
                Staff Login
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6bd8d]">
              Reservations
            </p>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Book online and present your booking number at reception when you
              arrive.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Payments, check-in, and check-out are completed by hotel staff.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d6bd8d]">
              Contact
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/68">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d6bd8d]" />
                <span>{displayAddress}</span>
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#d6bd8d]" />
                <span>{displayPhone}</span>
              </p>
              <p className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#d6bd8d]" />
                <span>{displayEmail}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {hotelName}. All rights
            reserved.
          </p>
          <p>
            Public reservations connected to the internal Hotel Management
            System.
          </p>
        </div>
      </div>
    </footer>
  );
}
