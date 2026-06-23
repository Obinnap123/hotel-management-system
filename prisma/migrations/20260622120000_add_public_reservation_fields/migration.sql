-- RoomType public website fields
ALTER TABLE "RoomType" ADD COLUMN "slug" TEXT;
ALTER TABLE "RoomType" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "RoomType" ADD COLUMN "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "RoomType" ADD COLUMN "amenities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill slugs from existing names before enforcing the constraint.
UPDATE "RoomType"
SET "slug" = COALESCE(
  NULLIF(
    TRIM(BOTH '-' FROM REGEXP_REPLACE(LOWER("name"), '[^a-z0-9]+', '-', 'g')),
    ''
  ),
  LOWER("id")
);

ALTER TABLE "RoomType" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "RoomType_slug_key" ON "RoomType"("slug");

-- Public reservation fields
ALTER TABLE "Booking" ADD COLUMN "guestCount" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Booking" ADD COLUMN "specialRequests" TEXT;
