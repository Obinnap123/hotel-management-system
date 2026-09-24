import type { UploadedRoomImage } from "@/lib/cloudinary/room-images";

export type ImageUploadSignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
};

export type ImagePreparationOptions = {
  acceptedTypes: readonly string[];
  label: string;
  maxBytes: number;
  maxEdge: number;
  minHeight: number;
  minWidth: number;
  optimizeMinBytes: number;
  outputQuality: number;
};

export async function prepareImageFile(
  file: File,
  options: ImagePreparationOptions,
) {
  if (!options.acceptedTypes.includes(file.type)) {
    throw new Error(`Use a JPEG, PNG, or WebP image for the ${options.label}.`);
  }

  if (file.size > options.maxBytes) {
    throw new Error(`${file.name} is larger than 5 MB.`);
  }

  const image = await loadImage(file);
  const dimensions = {
    width: image.naturalWidth,
    height: image.naturalHeight,
  };

  if (
    dimensions.width < options.minWidth ||
    dimensions.height < options.minHeight
  ) {
    throw new Error(
      `${file.name} is ${dimensions.width} × ${dimensions.height}. Use an image that is at least ${options.minWidth} × ${options.minHeight} pixels.`,
    );
  }

  if (
    file.size < options.optimizeMinBytes &&
    Math.max(dimensions.width, dimensions.height) <= options.maxEdge
  ) {
    return file;
  }

  const optimizedDimensions = calculateOptimizedImageDimensions(
    dimensions.width,
    dimensions.height,
    options.minWidth,
    options.minHeight,
    options.maxEdge,
  );
  const optimizedBlob = await renderOptimizedImage(
    image,
    optimizedDimensions.width,
    optimizedDimensions.height,
    options.outputQuality,
  );

  if (!optimizedBlob || optimizedBlob.size >= file.size * 0.95) {
    return file;
  }

  return new File([optimizedBlob], replaceExtension(file.name, "webp"), {
    type: "image/webp",
    lastModified: file.lastModified,
  });
}

export async function uploadImageDirect(
  file: File,
  upload: ImageUploadSignature,
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

export function calculateOptimizedImageDimensions(
  width: number,
  height: number,
  minWidth: number,
  minHeight: number,
  maxEdge: number,
) {
  const longestEdge = Math.max(width, height);
  const desiredScale = Math.min(1, maxEdge / longestEdge);
  const minimumScale = Math.max(minWidth / width, minHeight / height);
  const scale = Math.min(1, Math.max(desiredScale, minimumScale));

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
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
  quality: number,
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
    canvas.toBlob(resolve, "image/webp", quality);
  });
}

function replaceExtension(fileName: string, extension: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "hotel-image";
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
