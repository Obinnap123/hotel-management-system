import { BedDouble, CalendarCheck, DoorOpen, Users, Wallet } from "lucide-react";
import type { BookingStatusValue } from "@/lib/domain/hms-enums";

export type DashboardStats = {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  maintenanceRooms: number;
  totalGuests: number;
  todaysCheckIns: number;
  todaysCheckOuts: number;
  revenueToday: string;
  revenueThisMonth: string;
};

export type DashboardBookingItem = {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  roomTypeName: string;
  status: BookingStatusValue;
  checkInDate: string;
  checkOutDate: string;
};

export type DashboardPaymentItem = {
  id: string;
  bookingNumber: string;
  guestName: string;
  roomNumber: string;
  amount: string;
  method: string;
  paymentDate: string;
  recordedBy: string;
};

type DashboardOverviewProps = {
  stats: DashboardStats;
  todaysArrivals: DashboardBookingItem[];
  todaysDepartures: DashboardBookingItem[];
  activeStays: DashboardBookingItem[];
  recentPayments: DashboardPaymentItem[];
};

export function DashboardOverview({
  activeStays,
  recentPayments,
  stats,
  todaysArrivals,
  todaysDepartures,
}: DashboardOverviewProps) {
  const statCards = [
    { label: "Total Rooms", value: stats.totalRooms, icon: BedDouble },
    { label: "Available Rooms", value: stats.availableRooms, icon: DoorOpen },
    { label: "Occupied Rooms", value: stats.occupiedRooms, icon: BedDouble },
    { label: "Reserved Rooms", value: stats.reservedRooms, icon: CalendarCheck },
    { label: "Total Guests", value: stats.totalGuests, icon: Users },
    {
      label: "Today's Check-Ins",
      value: stats.todaysCheckIns,
      icon: CalendarCheck,
    },
    {
      label: "Today's Check-Outs",
      value: stats.todaysCheckOuts,
      icon: DoorOpen,
    },
    {
      label: "Revenue Today",
      value: formatCurrency(stats.revenueToday),
      icon: Wallet,
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(stats.revenueThisMonth),
      icon: Wallet,
    },
  ];

  return (
    <div className="min-w-0 space-y-6">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          High-level view of hotel operations today.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => (
          <div
            className="min-w-0 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            key={stat.label}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[var(--primary)]">
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <RoomStatusPanel stats={stats} />
        <BookingList title="Today's Arrivals" bookings={todaysArrivals} />
        <BookingList title="Today's Departures" bookings={todaysDepartures} />
        <BookingList title="Active Stays" bookings={activeStays} />
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="mb-3">
          <h3 className="text-base font-semibold tracking-tight text-slate-950">
            Recent Payments
          </h3>
        </div>

        <div className="dashboard-table-scroll">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4 font-medium">Booking</th>
                <th className="py-3 pr-4 font-medium">Guest</th>
                <th className="py-3 pr-4 font-medium">Room</th>
                <th className="py-3 pr-4 font-medium">Amount</th>
                <th className="py-3 pr-4 font-medium">Method</th>
                <th className="py-3 pr-4 font-medium">Recorded By</th>
                <th className="py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr className="border-b border-slate-100" key={payment.id}>
                  <td className="py-3 pr-4 font-medium text-slate-950">
                    {payment.bookingNumber}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {payment.guestName}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {payment.roomNumber}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {payment.method}
                  </td>
                  <td className="py-3 pr-4 text-slate-700">
                    {payment.recordedBy}
                  </td>
                  <td className="py-3 text-slate-700">{payment.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentPayments.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No payments have been recorded yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function RoomStatusPanel({ stats }: { stats: DashboardStats }) {
  const statuses = [
    ["Available", stats.availableRooms],
    ["Reserved", stats.reservedRooms],
    ["Occupied", stats.occupiedRooms],
    ["Maintenance", stats.maintenanceRooms],
  ] as const;

  return (
    <section className="min-w-0 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight text-slate-950">
        Rooms By Status
      </h3>
      <div className="mt-4 space-y-3">
        {statuses.map(([label, value]) => (
          <div className="flex items-center justify-between gap-3" key={label}>
            <span className="text-sm text-slate-600">{label}</span>
            <span className="text-sm font-semibold text-slate-950">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BookingList({
  bookings,
  title,
}: {
  bookings: DashboardBookingItem[];
  title: string;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <div className="dashboard-card-scroll mt-4 space-y-3">
        {bookings.map((booking) => (
          <div
            className="border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            key={booking.id}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-950">
                  {booking.guestName}
                </p>
                <p className="mt-1 break-words text-xs text-slate-500">
                  {booking.bookingNumber} - Room {booking.roomNumber}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {booking.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-2 break-words text-xs text-slate-500">
              {booking.roomTypeName} - {booking.checkInDate} to{" "}
              {booking.checkOutDate}
            </p>
          </div>
        ))}

        {bookings.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">No records to show.</p>
        ) : null}
      </div>
    </section>
  );
}

function formatCurrency(value: string) {
  return `NGN ${Number(value).toLocaleString()}`;
}
