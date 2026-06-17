import type { RoomStatusValue } from "@/lib/domain/hms-enums";

const statusStyles: Record<RoomStatusValue, string> = {
  AVAILABLE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RESERVED: "border-amber-200 bg-amber-50 text-amber-700",
  OCCUPIED: "border-sky-200 bg-sky-50 text-sky-700",
  MAINTENANCE: "border-zinc-300 bg-zinc-100 text-zinc-700",
};

export function StatusBadge({ status }: { status: RoomStatusValue }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
