export const bookingStatusValues = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
] as const;

export type BookingStatusValue = (typeof bookingStatusValues)[number];

export const editableBookingStatuses = ["PENDING", "CONFIRMED"] as const;

export const paymentMethodValues = ["CASH", "TRANSFER", "POS"] as const;

export type PaymentMethodValue = (typeof paymentMethodValues)[number];

export const roomStatusValues = [
  "AVAILABLE",
  "RESERVED",
  "OCCUPIED",
  "MAINTENANCE",
] as const;

export type RoomStatusValue = (typeof roomStatusValues)[number];

export const userRoleValues = ["ADMIN", "RECEPTIONIST"] as const;

export type UserRoleValue = (typeof userRoleValues)[number];

export const userStatusValues = ["ACTIVE", "INACTIVE"] as const;

export type UserStatusValue = (typeof userStatusValues)[number];
