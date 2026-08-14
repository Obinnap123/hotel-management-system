export function isValidStayDateRange(checkInDate: Date, checkOutDate: Date) {
  return (
    Number.isFinite(checkInDate.getTime()) &&
    Number.isFinite(checkOutDate.getTime()) &&
    checkOutDate > checkInDate
  );
}

export function doStayDateRangesOverlap({
  firstCheckIn,
  firstCheckOut,
  secondCheckIn,
  secondCheckOut,
}: {
  firstCheckIn: Date;
  firstCheckOut: Date;
  secondCheckIn: Date;
  secondCheckOut: Date;
}) {
  return firstCheckIn < secondCheckOut && firstCheckOut > secondCheckIn;
}

export function calculateStayNights(checkInDate: Date, checkOutDate: Date) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.max(
    1,
    Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / millisecondsPerDay,
    ),
  );
}
