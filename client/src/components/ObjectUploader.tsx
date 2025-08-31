import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, X } from "lucide-react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL: string; name: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file count
    if (files.length > maxNumberOfFiles) {
      alert(`You can only upload up to ${maxNumberOfFiles} files`);
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      alert(`Some files are too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }
    
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const successful: Array<{ uploadURL: string; name: string }> = [];

      for (const file of selectedFiles) {
        try {
          // Get upload parameters
          const { url } = await onGetUploadParameters();
          
          // Upload file
          const response = await fetch(url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          if (response.ok) {
            successful.push({
              uploadURL: url.split('?')[0], // Remove query parameters
              name: file.name,
            });
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      onComplete?.({ successful });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className={buttonClassName}
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isUploading}
        >
          {children}
        </Button>
        
        <Input
          id="file-input"
          type="file"
          multiple={maxNumberOfFiles > 1}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedFiles.length > 0 && (
          <Button
            type="button"
            onClick={uploadFiles}
            disabled={isUploading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(file.size / 1024)}KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}