import "dotenv/config";
import { prisma } from "../src/server/db/prisma";

async function main() {
  const source = await prisma.hotelSettings.findUnique({
    where: { singletonKey: "default" },
    select: {
      websiteTitle: true,
      websiteDescription: true,
      heroImages: true,
      heroImagePublicIds: true,
    },
  });

  if (!source) {
    throw new Error("The default HotelSettings record is missing.");
  }

  if (process.argv.includes("--source-only")) {
    console.log(
      JSON.stringify({
        hotelSettingsFound: true,
        descriptionLength: source.websiteDescription.length,
        heroImageCount: source.heroImages.length,
        heroStorageIdCount: source.heroImagePublicIds.filter(Boolean).length,
      }),
    );
    return;
  }

  const [branding, content] = await Promise.all([
    prisma.brandingSettings.findUnique({
      where: { singletonKey: "default" },
    }),
    prisma.websiteContent.findUnique({
      where: { singletonKey: "default" },
      include: {
        heroImages: {
          orderBy: { displayOrder: "asc" },
        },
      },
    }),
  ]);

  if (!branding) {
    throw new Error("The default BrandingSettings record is missing.");
  }

  if (!content) {
    throw new Error("The default WebsiteContent record is missing.");
  }

  const copiedUrls = content.heroImages.map((image) => image.imageUrl);
  const copiedPublicIds = content.heroImages.map(
    (image) => image.storagePublicId ?? "",
  );
  const sourcePublicIds = source.heroImages.map(
    (_, index) => source.heroImagePublicIds[index] ?? "",
  );

  const titleMatches = content.websiteTitle === source.websiteTitle;
  const descriptionMatches =
    content.websiteDescription === source.websiteDescription;
  const heroUrlsMatch = arraysMatch(copiedUrls, source.heroImages);
  const heroStorageIdsMatch = arraysMatch(copiedPublicIds, sourcePublicIds);

  if (
    !titleMatches ||
    !descriptionMatches ||
    !heroUrlsMatch ||
    !heroStorageIdsMatch
  ) {
    throw new Error("The copied website settings do not match HotelSettings.");
  }

  console.log(
    JSON.stringify({
      brandingSettingsFound: true,
      websiteContentFound: true,
      titleMatches,
      descriptionMatches,
      heroUrlsMatch,
      heroStorageIdsMatch,
      heroImageCount: content.heroImages.length,
    }),
  );
}

function arraysMatch(first: string[], second: string[]) {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
