import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
  disabled?: boolean;
}

/**
 * A file upload component that renders as a button and provides a modal interface for
 * file management.
 * 
 * Features:
 * - Renders as a customizable button that opens a file upload modal
 * - Provides a modal interface for:
 *   - File selection
 *   - File preview
 *   - Upload progress tracking
 *   - Upload status display
 * 
 * The component uses Uppy under the hood to handle all file upload functionality.
 * All file management features are automatically handled by the Uppy dashboard modal.
 * 
 * @param props - Component props
 * @param props.maxNumberOfFiles - Maximum number of files allowed to be uploaded
 *   (default: 1)
 * @param props.maxFileSize - Maximum file size in bytes (default: 10MB)
 * @param props.allowedFileTypes - Array of allowed MIME types
 * @param props.onGetUploadParameters - Function to get upload parameters (method and URL).
 *   Typically used to fetch a presigned URL from the backend server for direct-to-S3
 *   uploads.
 * @param props.onComplete - Callback function called when upload is complete. Typically
 *   used to make post-upload API calls to update server state and set object ACL
 *   policies.
 * @param props.buttonClassName - Optional CSS class name for the button
 * @param props.children - Content to be rendered inside the button
 * @param props.disabled - Whether the upload button is disabled
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  allowedFileTypes,
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  disabled = false,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  
  const [uppy] = useState(() => {
    const restrictions: any = {
      maxNumberOfFiles,
      maxFileSize,
    };

    if (allowedFileTypes && allowedFileTypes.length > 0) {
      restrictions.allowedFileTypes = allowedFileTypes;
    }

    const uppyInstance = new Uppy({
      restrictions,
      autoProceed: true,
      onBeforeFileAdded: (currentFile) => {
        console.log("File added:", currentFile.name, "Size:", currentFile.size, "Type:", currentFile.type);
        return true;
      },
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
      .on("file-added", (file) => {
        console.log("File queued for upload:", file.name);
      })
      .on("upload", (data) => {
        console.log("Upload started:", data);
      })
      .on("upload-success", (file, response) => {
        console.log("Upload success:", file?.name, response);
      })
      .on("complete", (result) => {
        console.log("Upload complete:", result);
        if (result.successful && result.successful.length > 0) {
          toast({
            title: "Upload Complete",
            description: `${result.successful.length} file(s) uploaded successfully.`,
          });
        }
        onComplete?.(result);
        setShowModal(false);
      })
      .on("restriction-failed", (file, error) => {
        console.error("Restriction failed:", error);
        toast({
          variant: "destructive",
          title: "File Restriction Error",
          description: error.message || "File does not meet requirements.",
        });
      })
      .on("upload-error", (file, error) => {
        console.error("Upload error:", file?.name, error);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file?.name || "file"}. ${error.message || "Please try again."}`,
        });
      })
      .on("error", (error) => {
        console.error("Uppy error:", error);
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: error.message || "An error occurred during upload.",
        });
      });
    
    return uppyInstance;
  });

  return (
    <div>
      <Button 
        onClick={() => setShowModal(true)} 
        className={buttonClassName}
        disabled={disabled}
        type="button"
      >
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}