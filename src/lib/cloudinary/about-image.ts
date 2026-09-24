export const ABOUT_IMAGE_FOLDER =
  "hotel-management-production/reservation-about";
export const ABOUT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const ABOUT_IMAGE_MIN_WIDTH = 1600;
export const ABOUT_IMAGE_MIN_HEIGHT = 1200;
export const ABOUT_IMAGE_OPTIMIZE_MIN_BYTES = 1.5 * 1024 * 1024;
export const ABOUT_IMAGE_MAX_EDGE = 2400;
export const ABOUT_IMAGE_OUTPUT_QUALITY = 0.9;

export const ABOUT_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function isAboutImagePublicId(publicId: string) {
  return publicId.startsWith(`${ABOUT_IMAGE_FOLDER}/`);
}
