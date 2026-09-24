import {
  prepareImageFile,
  uploadImageDirect,
  type ImageUploadSignature,
} from "@/lib/cloudinary/direct-image-upload";
import {
  ABOUT_IMAGE_ACCEPTED_TYPES,
  ABOUT_IMAGE_MAX_BYTES,
  ABOUT_IMAGE_MAX_EDGE,
  ABOUT_IMAGE_MIN_HEIGHT,
  ABOUT_IMAGE_MIN_WIDTH,
  ABOUT_IMAGE_OPTIMIZE_MIN_BYTES,
  ABOUT_IMAGE_OUTPUT_QUALITY,
} from "@/lib/cloudinary/about-image";

export type AboutImageUploadSignature = ImageUploadSignature;

export function prepareAboutImageFile(file: File) {
  return prepareImageFile(file, {
    acceptedTypes: ABOUT_IMAGE_ACCEPTED_TYPES,
    label: "About Hotel image",
    maxBytes: ABOUT_IMAGE_MAX_BYTES,
    maxEdge: ABOUT_IMAGE_MAX_EDGE,
    minHeight: ABOUT_IMAGE_MIN_HEIGHT,
    minWidth: ABOUT_IMAGE_MIN_WIDTH,
    optimizeMinBytes: ABOUT_IMAGE_OPTIMIZE_MIN_BYTES,
    outputQuality: ABOUT_IMAGE_OUTPUT_QUALITY,
  });
}

export const uploadAboutImageDirect = uploadImageDirect;
