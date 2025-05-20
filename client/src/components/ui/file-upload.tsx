import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./button";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary"}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {isDragActive
          ? "Drop the files here..."
          : "Drag and drop files here, or click to select files"}
      </p>
      <Button variant="outline" className="mt-4">
        Select Files
      </Button>
    </div>
  );
} 