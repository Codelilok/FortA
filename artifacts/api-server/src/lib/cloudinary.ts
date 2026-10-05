import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";

export type CloudinaryUploadInstructions = {
  uploadURL: string;
  objectPath: string;
  uploadMethod: "POST";
  uploadFields: Record<string, string>;
};

function requiredCloudinaryEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be set before using Cloudinary uploads.`);
  }
  return value;
}

function createUploadSignature(
  params: Record<string, string>,
  apiSecret: string,
): string {
  const serialized = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${serialized}${apiSecret}`)
    .digest("hex");
}

export class CloudinaryService {
  getUploadInstructions(contentType: string): CloudinaryUploadInstructions {
    if (!contentType.startsWith("image/")) {
      throw new Error("Only image uploads are supported.");
    }

    const cloudName = requiredCloudinaryEnvironmentVariable(
      "CLOUDINARY_CLOUD_NAME",
    );
    const apiKey = requiredCloudinaryEnvironmentVariable(
      "CLOUDINARY_API_KEY",
    );
    const apiSecret = requiredCloudinaryEnvironmentVariable(
      "CLOUDINARY_API_SECRET",
    );
    const folder =
      process.env.CLOUDINARY_FOLDER?.trim() || "forth-architecture";
    const publicId = randomUUID();
    const timestamp = String(Math.floor(Date.now() / 1000));
    const signedParams = {
      folder,
      public_id: publicId,
      timestamp,
    };
    const signature = createUploadSignature(signedParams, apiSecret);
    const cloudinaryPath = `${folder}/${publicId}`;
    const encodedCloudName = encodeURIComponent(cloudName);

    return {
      uploadURL: `https://api.cloudinary.com/v1_1/${encodedCloudName}/image/upload`,
      objectPath: `https://res.cloudinary.com/${encodedCloudName}/image/upload/f_auto,q_auto/${cloudinaryPath}`,
      uploadMethod: "POST",
      uploadFields: {
        ...signedParams,
        api_key: apiKey,
        signature,
      },
    };
  }
}