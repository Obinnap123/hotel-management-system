-- AlterTable
ALTER TABLE "WebsiteContent"
ADD COLUMN "aboutImageUrl" TEXT,
ADD COLUMN "aboutImagePublicId" TEXT,
ADD COLUMN "aboutImageAlt" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "WebsiteFacility" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "websiteContentId" TEXT NOT NULL,

    CONSTRAINT "WebsiteFacility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteFacility_websiteContentId_displayOrder_key"
ON "WebsiteFacility"("websiteContentId", "displayOrder");

-- CreateIndex
CREATE INDEX "WebsiteFacility_websiteContentId_idx"
ON "WebsiteFacility"("websiteContentId");

-- AddForeignKey
ALTER TABLE "WebsiteFacility"
ADD CONSTRAINT "WebsiteFacility_websiteContentId_fkey"
FOREIGN KEY ("websiteContentId") REFERENCES "WebsiteContent"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
