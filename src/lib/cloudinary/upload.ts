import "server-only";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import {
  ROOM_IMAGE_FOLDER,
  ROOM_IMAGE_MAX_BYTES,
} from "@/lib/cloudinary/room-images";

let configured = false;

export async function uploadRoomTypeImage(file: File) {
  return uploadHotelImage(file, ROOM_IMAGE_FOLDER);
}

export function createRoomImageUploadSignature() {
  const credentials = getCloudinaryCredentials();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { folder: ROOM_IMAGE_FOLDER, timestamp },
    credentials.apiSecret,
  );

  return {
    apiKey: credentials.apiKey,
    cloudName: credentials.cloudName,
    folder: ROOM_IMAGE_FOLDER,
    signature,
    timestamp,
  };
}

export async function uploadHotelImage(file: File, folder: string) {
  assertImageFile(file);

  try {
    configureCloudinary();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Cloudinary configuration failed.";
    console.error("[Cloudinary Config Error]", message);
    throw error;
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadDataUri(dataUri, folder);

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image upload failed.";
    console.error("[Cloudinary Upload Error]", message, {
      fileName: file.name,
      fileSize: file.size,
    });
    throw error;
  }
}

export async function deleteRoomTypeImage(publicId: string) {
  return deleteHotelImage(publicId);
}

export async function deleteHotelImage(publicId: string) {
  if (!publicId) {
    return;
  }

  try {
    configureCloudinary();
    await destroyImage(publicId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image deletion failed.";
    console.error("[Cloudinary Delete Error]", message, { publicId });
    // Don't re-throw - image deletion failures shouldn't block the operation
  }
}

function configureCloudinary() {
  if (configured) {
    return;
  }

  const { apiKey, apiSecret, cloudName } = getCloudinaryCredentials();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

function getCloudinaryCredentials() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required.",
    );
  }

  return { apiKey, apiSecret, cloudName };
}

function uploadDataUri(dataUri: string, folder: string) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload(
      dataUri,
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          const errorDetails = error
            ? {
                message: error.message,
                http_code: error.http_code,
                status_code: error.status_code,
              }
            : "Unknown error";
          console.error(
            "[Cloudinary Upload Failed]",
            JSON.stringify(errorDetails, null, 2),
          );
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result);
      },
    );
  });
}

function destroyImage(publicId: string) {
  return new Promise<void>((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        const errorDetails = {
          message: error.message,
          http_code: error.http_code,
          status_code: error.status_code,
        };
        console.error(
          "[Cloudinary Destroy Failed]",
          JSON.stringify(errorDetails, null, 2),
          { publicId },
        );
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function assertImageFile(file: File) {
  if (!file || file.size === 0) {
    throw new Error("Select an image before uploading.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }

  if (file.size > ROOM_IMAGE_MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }
}
