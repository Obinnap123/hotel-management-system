export const ROOM_IMAGE_FOLDER = "hotel-management-production/room-types";
export const ROOM_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const ROOM_IMAGE_MIN_WIDTH = 1200;
export const ROOM_IMAGE_MIN_HEIGHT = 900;
export const ROOM_IMAGE_MAX_GALLERY_COUNT = 8;

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
