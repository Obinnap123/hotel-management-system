export const reservationFacilityIconKeys = [
  "WIFI",
  "BREAKFAST",
  "PARKING",
  "FITNESS",
  "HOUSEKEEPING",
  "RECEPTION",
  "SECURITY",
  "POOL",
  "RESTAURANT",
  "SPA",
  "LAUNDRY",
  "AIRPORT_TRANSFER",
] as const;

export type ReservationFacilityIconKey =
  (typeof reservationFacilityIconKeys)[number];

export type ReservationFacility = {
  id: string;
  title: string;
  description: string;
  iconKey: ReservationFacilityIconKey;
  displayOrder: number;
};

export const reservationFacilityLimits = {
  minimum: 1,
  maximum: 6,
  title: 45,
  description: 110,
} as const;

export const reservationFacilityIconOptions: ReadonlyArray<{
  value: ReservationFacilityIconKey;
  label: string;
}> = [
  { value: "WIFI", label: "Wi-Fi" },
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "PARKING", label: "Parking" },
  { value: "FITNESS", label: "Fitness" },
  { value: "HOUSEKEEPING", label: "Housekeeping" },
  { value: "RECEPTION", label: "Reception" },
  { value: "SECURITY", label: "Security" },
  { value: "POOL", label: "Swimming pool" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "SPA", label: "Spa" },
  { value: "LAUNDRY", label: "Laundry" },
  { value: "AIRPORT_TRANSFER", label: "Airport transfer" },
];

export const defaultReservationFacilities: ReservationFacility[] = [
  { id: "default-wifi", title: "Reliable Wi-Fi", description: "Across rooms and shared spaces", iconKey: "WIFI", displayOrder: 0 },
  { id: "default-breakfast", title: "Breakfast service", description: "A thoughtful start to your morning", iconKey: "BREAKFAST", displayOrder: 1 },
  { id: "default-parking", title: "Secure parking", description: "Convenient on-site access", iconKey: "PARKING", displayOrder: 2 },
  { id: "default-fitness", title: "Fitness access", description: "Space to maintain your routine", iconKey: "FITNESS", displayOrder: 3 },
  { id: "default-housekeeping", title: "Prepared rooms", description: "Carefully readied before arrival", iconKey: "HOUSEKEEPING", displayOrder: 4 },
  { id: "default-reception", title: "Reception support", description: "Help throughout your stay", iconKey: "RECEPTION", displayOrder: 5 },
];

export function isReservationFacilityIconKey(
  value: string,
): value is ReservationFacilityIconKey {
  return reservationFacilityIconKeys.includes(
    value as ReservationFacilityIconKey,
  );
}
