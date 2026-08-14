export const maximumFailedLoginAttempts = 5;
export const loginLockDurationMs = 15 * 60 * 1000;

export function getFailedLoginState({
  currentAttempts,
  lockedUntil,
  now,
}: {
  currentAttempts: number;
  lockedUntil: Date | null;
  now: Date;
}) {
  const previousLockExpired = Boolean(lockedUntil && lockedUntil <= now);
  const failedLoginAttempts = previousLockExpired ? 1 : currentAttempts + 1;

  return {
    failedLoginAttempts,
    lockedUntil:
      failedLoginAttempts >= maximumFailedLoginAttempts
        ? new Date(now.getTime() + loginLockDurationMs)
        : null,
  };
}

export function isLoginLocked(lockedUntil: Date | null, now: Date) {
  return Boolean(lockedUntil && lockedUntil > now);
}
