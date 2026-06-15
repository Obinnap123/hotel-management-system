-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "totalAmount" DECIMAL(12,2);

-- Backfill existing bookings from the room price and number of nights.
UPDATE "Booking"
SET "totalAmount" = (
  GREATEST(
    1,
    CEIL(EXTRACT(EPOCH FROM ("Booking"."checkOutDate" - "Booking"."checkInDate")) / 86400)
  ) * "Room"."pricePerNight"
)
FROM "Room"
WHERE "Booking"."roomId" = "Room"."id";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "totalAmount" SET NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "Payment_bookingId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");
