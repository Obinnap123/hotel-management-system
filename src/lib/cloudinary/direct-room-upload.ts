import {
  prepareImageFile,
  uploadImageDirect,
  type ImageUploadSignature,
} from "@/lib/cloudinary/direct-image-upload";
import {
  ROOM_IMAGE_ACCEPTED_TYPES,
  ROOM_IMAGE_MAX_BYTES,
  ROOM_IMAGE_MAX_EDGE,
  ROOM_IMAGE_MIN_HEIGHT,
  ROOM_IMAGE_MIN_WIDTH,
  ROOM_IMAGE_OPTIMIZE_MIN_BYTES,
  ROOM_IMAGE_OUTPUT_QUALITY,
} from "@/lib/cloudinary/room-images";

export type RoomImageUploadSignature = ImageUploadSignature;

export function prepareRoomImageFile(file: File) {
  return prepareImageFile(file, {
    acceptedTypes: ROOM_IMAGE_ACCEPTED_TYPES,
    label: "room image",
    maxBytes: ROOM_IMAGE_MAX_BYTES,
    maxEdge: ROOM_IMAGE_MAX_EDGE,
    minHeight: ROOM_IMAGE_MIN_HEIGHT,
    minWidth: ROOM_IMAGE_MIN_WIDTH,
    optimizeMinBytes: ROOM_IMAGE_OPTIMIZE_MIN_BYTES,
    outputQuality: ROOM_IMAGE_OUTPUT_QUALITY,
  });
}

export const uploadRoomImageDirect = uploadImageDirect;
