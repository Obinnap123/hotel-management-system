export const hotelPolicyLimits = {
  cancellationPolicy: 1200,
  checkInRequirements: 1200,
  houseRules: 1600,
  reservationTerms: 1600,
} as const;

export type HotelPolicies = {
  cancellationPolicy: string;
  checkInRequirements: string;
  houseRules: string;
  reservationTerms: string;
};

export type HotelPolicySnapshot = HotelPolicies & {
  acceptedAt: string;
  version: 1;
};

export function createDefaultHotelPolicies({
  checkInTime,
  checkOutTime,
  hotelName,
}: {
  checkInTime: string;
  checkOutTime: string;
  hotelName: string;
}): HotelPolicies {
  return {
    cancellationPolicy:
      "Contact the hotel as soon as possible if your plans change. The hotel will confirm whether the reservation can be cancelled and whether any charges apply.",
    checkInRequirements: `Standard check-in is from ${checkInTime} and check-out is by ${checkOutTime}. Guests may be asked to present a valid means of identification when they arrive.`,
    houseRules: `Only registered guests may occupy the reserved room. Guests are expected to respect ${hotelName}, its staff, other guests, and hotel property throughout their stay.`,
    reservationTerms:
      "Submitting a reservation request does not guarantee a confirmed stay. The reservation remains pending until the hotel confirms availability. Payment arrangements and final room assignment are handled by hotel staff.",
  };
}

export function resolveHotelPolicies(
  configured: HotelPolicies,
  defaults: HotelPolicies,
): HotelPolicies {
  return {
    cancellationPolicy:
      configured.cancellationPolicy.trim() || defaults.cancellationPolicy,
    checkInRequirements:
      configured.checkInRequirements.trim() || defaults.checkInRequirements,
    houseRules: configured.houseRules.trim() || defaults.houseRules,
    reservationTerms:
      configured.reservationTerms.trim() || defaults.reservationTerms,
  };
}

export function createHotelPolicySnapshot(
  policies: HotelPolicies,
  acceptedAt: Date,
): HotelPolicySnapshot {
  return {
    version: 1,
    acceptedAt: acceptedAt.toISOString(),
    ...policies,
  };
}
