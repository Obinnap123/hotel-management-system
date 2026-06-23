export function formatPublicCurrency(
  value: number | string,
  currency = "NGN",
) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return `${currency} 0`;
  }

  return `${currency} ${amount.toLocaleString()}`;
}

export function formatPublicDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function formatPublicBookingNumber(bookingId: string) {
  return `BK-${bookingId.slice(-6).toUpperCase()}`;
}
