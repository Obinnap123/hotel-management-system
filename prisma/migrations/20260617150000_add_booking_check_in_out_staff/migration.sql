ALTER TABLE "Booking" ADD COLUMN "checkedInById" TEXT;
ALTER TABLE "Booking" ADD COLUMN "checkedOutById" TEXT;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_checkedInById_fkey"
FOREIGN KEY ("checkedInById") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_checkedOutById_fkey"
FOREIGN KEY ("checkedOutById") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "Booking_checkedInById_idx" ON "Booking"("checkedInById");
CREATE INDEX "Booking_checkedOutById_idx" ON "Booking"("checkedOutById");
