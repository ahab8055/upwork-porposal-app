"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadDocument } from "@/hooks/useKnowledgeBase";

const PDF_ACCEPT = {
  "application/pdf": [".pdf"],
} as const;

interface DocumentUploadZoneProps {
  documentType?: string;
}

export function DocumentUploadZone({
  documentType = "other",
}: DocumentUploadZoneProps) {
  const uploadDocumentMutation = useUploadDocument();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      for (const file of acceptedFiles) {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          toast.error(`${file.name}: only PDF files are supported`);
          continue;
        }

        uploadDocumentMutation.mutate({ file, documentType });
      }
    },
    [documentType, uploadDocumentMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: PDF_ACCEPT,
    multiple: true,
    disabled: uploadDocumentMutation.isPending,
    onDropRejected: () => {
      toast.error("Only PDF files are supported");
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        uploadDocumentMutation.isPending
          ? "border-slate-200 bg-slate-50 cursor-wait"
          : isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
      }`}
      data-testid="document-upload-dropzone"
    >
      <input {...getInputProps({ accept: ".pdf,application/pdf" })} data-testid="document-upload-input" />
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Upload className="w-6 h-6 text-slate-600" />
      </div>
      {uploadDocumentMutation.isPending ? (
        <p className="text-slate-600">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-blue-600">Drop PDF files here</p>
      ) : (
        <>
          <p className="text-slate-900 font-medium mb-1">
            Drag & drop PDFs or click to browse
          </p>
          <p className="text-sm text-slate-500">PDF files only</p>
        </>
      )}
    </div>
  );
}
