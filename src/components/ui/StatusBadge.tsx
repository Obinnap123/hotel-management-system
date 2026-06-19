import type { RoomStatusValue } from "@/lib/domain/hms-enums";

const statusStyles: Record<RoomStatusValue, string> = {
  AVAILABLE: "border-emerald-200 bg-emerald-50 text-emerald-800",
  RESERVED: "border-amber-200 bg-amber-50 text-amber-800",
  OCCUPIED: "border-cyan-200 bg-cyan-50 text-cyan-800",
  MAINTENANCE: "border-slate-300 bg-slate-100 text-slate-700",
};

export function StatusBadge({ status }: { status: RoomStatusValue }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
