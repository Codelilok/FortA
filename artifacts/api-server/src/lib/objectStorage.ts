import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

type StoredObject = {
  key: string;
  contentType?: string;
  size?: number;
  isPublic: boolean;
};

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

/**
 * S3-compatible object storage adapter.
 *
 * Works with Amazon S3, Cloudflare R2, MinIO, and other providers that
 * implement the S3 API. File bytes stay in object storage; PostgreSQL stores
 * only the returned object path and metadata.
 */
export class ObjectStorageService {
  private client: S3Client | undefined;

  private getBucket(): string {
    const bucket = process.env.S3_BUCKET?.trim();
    if (!bucket) {
      throw new Error("S3_BUCKET must be set before using object storage.");
    }
    return bucket;
  }

  private getPrefix(name: "public" | "private"): string {
    const value =
      name === "public"
        ? process.env.S3_PUBLIC_PREFIX
        : process.env.S3_PRIVATE_PREFIX;
    return (value || (name === "public" ? "public" : "objects"))
      .trim()
      .replace(/^\/+|\/+$/g, "");
  }

  private getClient(): S3Client {
    if (this.client) {
      return this.client;
    }

    const region = process.env.S3_REGION || "auto";
    const endpoint = process.env.S3_ENDPOINT?.trim() || undefined;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();

    if ((accessKeyId && !secretAccessKey) || (!accessKeyId && secretAccessKey)) {
      throw new Error(
        "S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be provided together.",
      );
    }

    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      ...(accessKeyId && secretAccessKey
        ? { credentials: { accessKeyId, secretAccessKey } }
        : {}),
    });

    return this.client;
  }

  private objectKey(prefix: string, path: string): string {
    const normalizedPath = path.replace(/^\/+/, "").replace(/\.\./g, "");
    return prefix ? `${prefix}/${normalizedPath}` : normalizedPath;
  }

  private relativeObjectPath(prefix: string, key: string): string {
    const prefixWithSlash = prefix ? `${prefix}/` : "";
    return key.startsWith(prefixWithSlash)
      ? key.slice(prefixWithSlash.length)
      : key;
  }

  private async headObject(
    key: string,
    isPublic: boolean,
  ): Promise<StoredObject | null> {
    try {
      const metadata = await this.getClient().send(
        new HeadObjectCommand({
          Bucket: this.getBucket(),
          Key: key,
        }),
      );

      return {
        key,
        isPublic,
        contentType: metadata.ContentType,
        size: metadata.ContentLength,
      };
    } catch (error: any) {
      const status = error?.$metadata?.httpStatusCode;
      const name = error?.name;
      if (status === 404 || name === "NotFound" || name === "NoSuchKey") {
        return null;
      }
      throw error;
    }
  }

  async searchPublicObject(filePath: string): Promise<StoredObject | null> {
    const key = this.objectKey(this.getPrefix("public"), filePath);
    return this.headObject(key, true);
  }

  async downloadObject(
    object: StoredObject,
    cacheTtlSec: number = 3600,
  ): Promise<Response> {
    const result = await this.getClient().send(
      new GetObjectCommand({
        Bucket: this.getBucket(),
        Key: object.key,
      }),
    );

    if (!result.Body) {
      throw new ObjectNotFoundError();
    }

    const headers: Record<string, string> = {
      "Content-Type":
        result.ContentType || object.contentType || "application/octet-stream",
      "Cache-Control": `${object.isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`,
    };
    const contentLength = result.ContentLength ?? object.size;
    if (contentLength !== undefined) {
      headers["Content-Length"] = String(contentLength);
    }

    return new Response(result.Body.transformToWebStream(), { headers });
  }

  async getObjectEntityUploadURL(
    contentType?: string,
  ): Promise<{ uploadURL: string; objectPath: string }> {
    const privatePrefix = this.getPrefix("private");
    const relativePath = `uploads/${randomUUID()}`;
    const key = this.objectKey(privatePrefix, relativePath);

    const uploadURL = await getSignedUrl(
      this.getClient(),
      new PutObjectCommand({
        Bucket: this.getBucket(),
        Key: key,
        ...(contentType ? { ContentType: contentType } : {}),
      }),
      { expiresIn: 900 },
    );

    return {
      uploadURL,
      objectPath: `/objects/${relativePath}`,
    };
  }

  async getObjectEntityFile(objectPath: string): Promise<StoredObject> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const relativePath = objectPath.slice("/objects/".length);
    if (!relativePath || relativePath.includes("..")) {
      throw new ObjectNotFoundError();
    }

    const object = await this.headObject(
      this.objectKey(this.getPrefix("private"), relativePath),
      false,
    );
    if (!object) {
      throw new ObjectNotFoundError();
    }
    return object;
  }
}