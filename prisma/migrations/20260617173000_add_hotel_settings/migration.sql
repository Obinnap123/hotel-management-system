CREATE TABLE "HotelSettings" (
  "id" TEXT NOT NULL,
  "singletonKey" TEXT NOT NULL DEFAULT 'default',
  "hotelName" TEXT NOT NULL DEFAULT 'Hotel Management',
  "phoneNumber" TEXT NOT NULL DEFAULT '',
  "emailAddress" TEXT NOT NULL DEFAULT '',
  "physicalAddress" TEXT NOT NULL DEFAULT '',
  "defaultCheckInTime" TEXT NOT NULL DEFAULT '14:00',
  "defaultCheckOutTime" TEXT NOT NULL DEFAULT '12:00',
  "currency" TEXT NOT NULL DEFAULT 'NGN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "HotelSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HotelSettings_singletonKey_key" ON "HotelSettings"("singletonKey");

INSERT INTO "HotelSettings" (
  "id",
  "singletonKey",
  "hotelName",
  "phoneNumber",
  "emailAddress",
  "physicalAddress",
  "defaultCheckInTime",
  "defaultCheckOutTime",
  "currency",
  "createdAt",
  "updatedAt"
) VALUES (
  'hotel_settings_default',
  'default',
  'Hotel Management',
  '',
  '',
  '',
  '14:00',
  '12:00',
  'NGN',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
