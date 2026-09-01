import {
  Car,
  Coffee,
  ConciergeBell,
  Dumbbell,
  Headphones,
  Plane,
  ShieldCheck,
  Shirt,
  Sparkles,
  Soup,
  Waves,
  Wifi,
} from "lucide-react";
import type { ReservationFacilityIconKey } from "@/lib/reservation-facilities";

const icons = {
  WIFI: Wifi,
  BREAKFAST: Coffee,
  PARKING: Car,
  FITNESS: Dumbbell,
  HOUSEKEEPING: Sparkles,
  RECEPTION: Headphones,
  SECURITY: ShieldCheck,
  POOL: Waves,
  RESTAURANT: Soup,
  SPA: ConciergeBell,
  LAUNDRY: Shirt,
  AIRPORT_TRANSFER: Plane,
} satisfies Record<ReservationFacilityIconKey, typeof Wifi>;

export function ReservationFacilityIcon({
  iconKey,
  className,
}: {
  iconKey: ReservationFacilityIconKey;
  className?: string;
}) {
  const Icon = icons[iconKey];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.5} />;
}
