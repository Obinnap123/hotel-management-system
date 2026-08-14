export function isTransactionWriteConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2034"
  );
}

export function isOverlappingBookingConstraintError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("Booking_no_overlapping_active_stays");
}
