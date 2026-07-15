CREATE TABLE IF NOT EXISTS "demo_requests" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "workEmail" TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "hotelName" TEXT NOT NULL,
  "hotelLocation" TEXT NOT NULL,
  "numberOfRooms" INTEGER NOT NULL,
  "role" TEXT NOT NULL,
  "additionalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "demo_requests_workEmail_idx" ON "demo_requests"("workEmail");
CREATE INDEX IF NOT EXISTS "demo_requests_createdAt_idx" ON "demo_requests"("createdAt");
