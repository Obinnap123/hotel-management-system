-- AlterTable
ALTER TABLE "WebsiteContent"
ADD COLUMN "showFeaturedRooms" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showFacilities" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showAboutHotel" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showBookingSteps" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "WebsiteFeaturedRoomType" (
    "id" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "websiteContentId" TEXT NOT NULL,
    "roomTypeId" TEXT NOT NULL,

    CONSTRAINT "WebsiteFeaturedRoomType_pkey" PRIMARY KEY ("id")
);

-- This table is managed only through the application server. Keep it closed to
-- Supabase's browser-facing Data API unless explicit policies are added later.
ALTER TABLE "WebsiteFeaturedRoomType" ENABLE ROW LEVEL SECURITY;

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteFeaturedRoomType_websiteContentId_roomTypeId_key"
ON "WebsiteFeaturedRoomType"("websiteContentId", "roomTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteFeaturedRoomType_websiteContentId_displayOrder_key"
ON "WebsiteFeaturedRoomType"("websiteContentId", "displayOrder");

-- CreateIndex
CREATE INDEX "WebsiteFeaturedRoomType_websiteContentId_idx"
ON "WebsiteFeaturedRoomType"("websiteContentId");

-- CreateIndex
CREATE INDEX "WebsiteFeaturedRoomType_roomTypeId_idx"
ON "WebsiteFeaturedRoomType"("roomTypeId");

-- AddForeignKey
ALTER TABLE "WebsiteFeaturedRoomType"
ADD CONSTRAINT "WebsiteFeaturedRoomType_websiteContentId_fkey"
FOREIGN KEY ("websiteContentId") REFERENCES "WebsiteContent"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteFeaturedRoomType"
ADD CONSTRAINT "WebsiteFeaturedRoomType_roomTypeId_fkey"
FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
