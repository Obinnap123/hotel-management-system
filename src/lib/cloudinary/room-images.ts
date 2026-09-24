export const ROOM_IMAGE_FOLDER = "hotel-management-production/room-types";
export const ROOM_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const ROOM_IMAGE_MIN_WIDTH = 1200;
export const ROOM_IMAGE_MIN_HEIGHT = 900;
export const ROOM_IMAGE_MAX_GALLERY_COUNT = 8;
export const ROOM_IMAGE_OPTIMIZE_MIN_BYTES = 1.5 * 1024 * 1024;
export const ROOM_IMAGE_MAX_EDGE = 2400;
export const ROOM_IMAGE_OUTPUT_QUALITY = 0.9;

export const ROOM_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type UploadedRoomImage = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
};

export function isRoomImagePublicId(publicId: string) {
  return publicId.startsWith(`${ROOM_IMAGE_FOLDER}/`);
}

export function isAcceptedRoomImageType(type: string) {
  return ROOM_IMAGE_ACCEPTED_TYPES.some((acceptedType) => acceptedType === type);
}

export function shouldOptimizeRoomImage(
  bytes: number,
  width: number,
  height: number,
) {
  return (
    bytes >= ROOM_IMAGE_OPTIMIZE_MIN_BYTES ||
    Math.max(width, height) > ROOM_IMAGE_MAX_EDGE
  );
}

export function calculateOptimizedRoomImageDimensions(
  width: number,
  height: number,
) {
  const longestEdge = Math.max(width, height);
  const desiredScale = Math.min(1, ROOM_IMAGE_MAX_EDGE / longestEdge);
  const minimumScale = Math.max(
    ROOM_IMAGE_MIN_WIDTH / width,
    ROOM_IMAGE_MIN_HEIGHT / height,
  );
  const scale = Math.min(1, Math.max(desiredScale, minimumScale));

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}
