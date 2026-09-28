ALTER TABLE "HotelSettings"
ADD COLUMN "cancellationPolicy" TEXT NOT NULL DEFAULT '',
ADD COLUMN "checkInRequirements" TEXT NOT NULL DEFAULT '',
ADD COLUMN "houseRules" TEXT NOT NULL DEFAULT '',
ADD COLUMN "reservationTerms" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Booking"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "policySnapshot" JSONB;
