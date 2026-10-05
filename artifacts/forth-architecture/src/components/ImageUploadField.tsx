import { useRef, useState, type ChangeEvent } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  previewAlt: string;
  previewClassName?: string;
  required?: boolean;
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function ImageUploadField({
  label,
  value,
  onChange,
  previewAlt,
  previewClassName = "h-32 w-full",
  required = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { uploadFile, isUploading, error, progress } = useUpload();
  const inputId = `image-url-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setValidationError(null);

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setValidationError("Choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setValidationError("Images must be 10 MB or smaller.");
      return;
    }

    const result = await uploadFile(file);
    if (result) {
      onChange(result.objectPath);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={inputId}>
          {label}{required ? " *" : ""}
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} className="mr-2" />
          {isUploading ? `Uploading ${progress}%` : "Upload image"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-label={`Upload ${label}`}
          onChange={handleFileChange}
        />
      </div>
      <Input
        id={inputId}
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://..."
        required={required}
      />
      {(validationError || error) && (
        <p className="text-sm text-destructive" role="alert">
          {validationError || error?.message}
        </p>
      )}
      {value && (
        <img
          src={value}
          alt={previewAlt}
          className={`${previewClassName} rounded-lg object-cover`}
        />
      )}
    </div>
  );
}
