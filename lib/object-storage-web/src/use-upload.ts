import { useState, useCallback } from "react";
import type { UppyFile } from "@uppy/core";

interface UploadMetadata {
  name: string;
  size: number;
  contentType: string;
}

interface UploadResponse {
  uploadURL: string;
  objectPath: string;
  uploadMethod?: "POST" | "PUT";
  uploadFields?: Record<string, string>;
  metadata: UploadMetadata;
}

interface UseUploadOptions {
  /** Base path where object storage routes are mounted (default: "/api/storage") */
  basePath?: string;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * React hook for handling direct image uploads.
 *
 * This hook implements the two-step presigned URL upload flow:
 * 1. Request signed upload parameters from the backend.
 * 2. Upload the file directly to Cloudinary.
 *
 * @example
 * ```tsx
 * function FileUploader() {
 *   const { uploadFile, isUploading, error } = useUpload({
 *     onSuccess: (response) => {
 *       console.log("Uploaded to:", response.objectPath);
 *     },
 *   });
 *
 *   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (file) {
 *       await uploadFile(file);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <input type="file" onChange={handleFileChange} disabled={isUploading} />
 *       {isUploading && <p>Uploading...</p>}
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUpload(options: UseUploadOptions = {}) {
  const basePath = options.basePath ?? "/api/storage";
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const requestUploadUrl = useCallback(
    async (file: File): Promise<UploadResponse> => {
      const response = await fetch(`${basePath}/uploads/request-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      return response.json();
    },
    []
  );

  const uploadToStorage = useCallback(
    async (file: File, uploadResponse: UploadResponse): Promise<UploadResponse> => {
      const method = uploadResponse.uploadMethod ?? "PUT";
      let response: Response;
      if (method === "POST" && uploadResponse.uploadFields) {
        const formData = new FormData();
        Object.entries(uploadResponse.uploadFields).forEach(([key, value]) =>
          formData.append(key, value),
        );
        formData.append("file", file);
        response = await fetch(uploadResponse.uploadURL, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(uploadResponse.uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });
      }

      const uploadResult = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          uploadResult?.error?.message || "Failed to upload image",
        );
      }

      if (method === "POST" && typeof uploadResult?.secure_url !== "string") {
        throw new Error("Image provider did not return a secure image URL");
      }

      const secureUrl =
        typeof uploadResult?.secure_url === "string"
          ? uploadResult.secure_url.replace(
              "/image/upload/",
              "/image/upload/f_auto,q_auto/",
            )
          : undefined;

      return {
        ...uploadResponse,
        objectPath: secureUrl || uploadResponse.objectPath,
      };
    },
    []
  );

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResponse | null> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        setProgress(10);
        const uploadResponse = await requestUploadUrl(file);

        setProgress(30);
        const completedUpload = await uploadToStorage(file, uploadResponse);

        setProgress(100);
        options.onSuccess?.(completedUpload);
        return completedUpload;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [requestUploadUrl, uploadToStorage, options]
  );

  const getUploadParameters = useCallback(
    async (
      file: UppyFile<Record<string, unknown>, Record<string, unknown>>
    ): Promise<{
      method: "PUT";
      url: string;
      headers?: Record<string, string>;
    }> => {
      const response = await fetch(`${basePath}/uploads/request-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const data = await response.json();
      return {
        method: data.uploadMethod ?? "PUT",
        url: data.uploadURL,
        ...(data.uploadFields ? { fields: data.uploadFields } : {}),
        ...(data.uploadMethod === "POST"
          ? {}
          : { headers: { "Content-Type": file.type || "application/octet-stream" } }),
      };
    },
    []
  );

  return {
    uploadFile,
    getUploadParameters,
    isUploading,
    error,
    progress,
  };
}
