-- Invalidate sessions after security-sensitive staff account changes and
-- retain a small amount of state for database-backed login throttling.
ALTER TABLE "User"
ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lockedUntil" TIMESTAMP(3);

-- A reservation describes when a room is reserved. The room status describes
-- its current operating condition. Clean up the old mixed-state value.
UPDATE "Room"
SET "status" = 'AVAILABLE'
WHERE "status" = 'RESERVED';

-- The application uses serializable transactions too, but this database
-- constraint is the final safeguard against two overlapping active stays.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_no_overlapping_active_stays"
EXCLUDE USING GIST (
  "roomId" WITH =,
  tsrange("checkInDate", "checkOutDate", '[)') WITH &&
)
WHERE ("status" IN ('PENDING', 'CONFIRMED', 'CHECKED_IN'));
