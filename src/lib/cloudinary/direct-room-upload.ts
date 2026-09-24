import {
  isAcceptedRoomImageType,
  ROOM_IMAGE_MAX_BYTES,
  ROOM_IMAGE_MIN_HEIGHT,
  ROOM_IMAGE_MIN_WIDTH,
  ROOM_IMAGE_OUTPUT_QUALITY,
  calculateOptimizedRoomImageDimensions,
  shouldOptimizeRoomImage,
  type UploadedRoomImage,
} from "@/lib/cloudinary/room-images";

export type RoomImageUploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
};

export async function prepareRoomImageFile(file: File) {
  if (!isAcceptedRoomImageType(file.type)) {
    throw new Error("Use a JPEG, PNG, or WebP image.");
  }

  if (file.size > ROOM_IMAGE_MAX_BYTES) {
    throw new Error(`${file.name} is larger than 5 MB.`);
  }

  const image = await loadImage(file);
  const dimensions = {
    width: image.naturalWidth,
    height: image.naturalHeight,
  };

  if (
    dimensions.width < ROOM_IMAGE_MIN_WIDTH ||
    dimensions.height < ROOM_IMAGE_MIN_HEIGHT
  ) {
    throw new Error(
      `${file.name} is ${dimensions.width} × ${dimensions.height}. Use an image that is at least ${ROOM_IMAGE_MIN_WIDTH} × ${ROOM_IMAGE_MIN_HEIGHT} pixels.`,
    );
  }

  if (!shouldOptimizeRoomImage(file.size, dimensions.width, dimensions.height)) {
    return file;
  }

  const optimizedDimensions = calculateOptimizedRoomImageDimensions(
    dimensions.width,
    dimensions.height,
  );
  const optimizedBlob = await renderOptimizedImage(
    image,
    optimizedDimensions.width,
    optimizedDimensions.height,
  );

  // Keep the original when browser encoding does not produce a useful saving.
  if (!optimizedBlob || optimizedBlob.size >= file.size * 0.95) {
    return file;
  }

  return new File([optimizedBlob], replaceExtension(file.name, "webp"), {
    type: "image/webp",
    lastModified: file.lastModified,
  });
}

export async function uploadRoomImageDirect(
  file: File,
  upload: RoomImageUploadSignature,
): Promise<UploadedRoomImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", upload.apiKey);
  formData.append("timestamp", String(upload.timestamp));
  formData.append("folder", upload.folder);
  formData.append("signature", upload.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(upload.cloudName)}/image/upload`,
    { method: "POST", body: formData },
  );
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok || !result || typeof result !== "object") {
    const message = readCloudinaryError(result);
    throw new Error(message || "Cloudinary could not upload this image.");
  }

  const data = result as Record<string, unknown>;
  const uploaded: UploadedRoomImage = {
    secureUrl: String(data.secure_url ?? ""),
    publicId: String(data.public_id ?? ""),
    width: Number(data.width),
    height: Number(data.height),
    bytes: Number(data.bytes),
    format: String(data.format ?? ""),
  };

  if (!uploaded.secureUrl || !uploaded.publicId) {
    throw new Error("Cloudinary returned incomplete image details.");
  }

  return uploaded;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = document.createElement("img");

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`${file.name} could not be read as an image.`));
    };
    image.src = objectUrl;
  });
}

function renderOptimizedImage(
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  return new Promise<Blob | null>((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      resolve(null);
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);
    canvas.toBlob(resolve, "image/webp", ROOM_IMAGE_OUTPUT_QUALITY);
  });
}

function replaceExtension(fileName: string, extension: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "room-image";
  return `${baseName}.${extension}`;
}

function readCloudinaryError(result: unknown) {
  if (!result || typeof result !== "object") {
    return "";
  }

  const error = (result as Record<string, unknown>).error;
  if (!error || typeof error !== "object") {
    return "";
  }

  const message = (error as Record<string, unknown>).message;
  return typeof message === "string" ? message : "";
}
