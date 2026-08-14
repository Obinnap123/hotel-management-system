BEGIN;

-- CreateTable
CREATE TABLE "BrandingSettings" (
    "id" TEXT NOT NULL,
    "singletonKey" TEXT NOT NULL DEFAULT 'default',
    "logoUrl" TEXT,
    "logoPublicId" TEXT,
    "faviconUrl" TEXT,
    "faviconPublicId" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#173B32',
    "accentColor" TEXT NOT NULL DEFAULT '#E5D2A9',
    "typographyPreset" TEXT NOT NULL DEFAULT 'EDITORIAL',
    "colorScheme" TEXT NOT NULL DEFAULT 'LIGHT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteContent" (
    "id" TEXT NOT NULL,
    "singletonKey" TEXT NOT NULL DEFAULT 'default',
    "websiteTitle" TEXT NOT NULL DEFAULT '',
    "websiteDescription" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteHeroImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storagePublicId" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "alternativeText" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "websiteContentId" TEXT NOT NULL,

    CONSTRAINT "WebsiteHeroImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandingSettings_singletonKey_key" ON "BrandingSettings"("singletonKey");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteContent_singletonKey_key" ON "WebsiteContent"("singletonKey");

-- CreateIndex
CREATE INDEX "WebsiteHeroImage_websiteContentId_idx" ON "WebsiteHeroImage"("websiteContentId");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteHeroImage_websiteContentId_displayOrder_key" ON "WebsiteHeroImage"("websiteContentId", "displayOrder");

-- AddForeignKey
ALTER TABLE "WebsiteHeroImage" ADD CONSTRAINT "WebsiteHeroImage_websiteContentId_fkey" FOREIGN KEY ("websiteContentId") REFERENCES "WebsiteContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the branding singleton with values matching the current reservation site.
INSERT INTO "BrandingSettings" (
    "id",
    "singletonKey",
    "primaryColor",
    "accentColor",
    "typographyPreset",
    "colorScheme",
    "createdAt",
    "updatedAt"
) VALUES (
    'branding_settings_default',
    'default',
    '#173B32',
    '#E5D2A9',
    'EDITORIAL',
    'LIGHT',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Copy the current reservation-site metadata without removing it from
-- HotelSettings. Keeping the source columns makes this migration reversible.
INSERT INTO "WebsiteContent" (
    "id",
    "singletonKey",
    "websiteTitle",
    "websiteDescription",
    "createdAt",
    "updatedAt"
)
SELECT
    'website_content_default',
    'default',
    "websiteTitle",
    "websiteDescription",
    "createdAt",
    "updatedAt"
FROM "HotelSettings"
WHERE "singletonKey" = 'default';

-- A brand-new database may not have a HotelSettings row yet. Always leave the
-- settings foundation with a usable singleton record.
INSERT INTO "WebsiteContent" (
    "id",
    "singletonKey",
    "websiteTitle",
    "websiteDescription",
    "createdAt",
    "updatedAt"
)
SELECT
    'website_content_default',
    'default',
    '',
    '',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "WebsiteContent" WHERE "singletonKey" = 'default'
);

-- Convert the old parallel arrays into complete image records. Each URL now
-- remains permanently paired with its Cloudinary public ID and display order.
INSERT INTO "WebsiteHeroImage" (
    "id",
    "imageUrl",
    "storagePublicId",
    "displayOrder",
    "alternativeText",
    "createdAt",
    "updatedAt",
    "websiteContentId"
)
SELECT
    'website_hero_image_' || hero.position::TEXT,
    hero."imageUrl",
    NULLIF(COALESCE(settings."heroImagePublicIds"[hero.position::INTEGER], ''), ''),
    (hero.position - 1)::INTEGER,
    '',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    content."id"
FROM "HotelSettings" AS settings
JOIN "WebsiteContent" AS content
    ON content."singletonKey" = settings."singletonKey"
CROSS JOIN LATERAL unnest(settings."heroImages") WITH ORDINALITY AS hero("imageUrl", position)
WHERE settings."singletonKey" = 'default'
  AND hero."imageUrl" <> '';

COMMIT;
