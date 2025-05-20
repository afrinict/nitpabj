import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

export function FileUpload({ onFileSelect, accept = "*", maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      return;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse
        </Button>
      </div>
      {selectedFile && (
        <p className="text-sm text-gray-500">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
        </p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 