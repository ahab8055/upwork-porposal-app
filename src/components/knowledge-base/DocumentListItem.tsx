"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DocumentProcessingStatusBadge } from "@/components/knowledge-base/DocumentProcessingStatusBadge";
import { knowledgeBaseService } from "@/services/knowledgeBaseService";
import { toast } from "sonner";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Document as KBDocument } from "@/types/knowledge-base";

function formatFileSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadDate(dateString: string): string {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDocumentType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface DocumentListItemProps {
  document: KBDocument;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function DocumentListItem({
  document: doc,
  onDelete,
  isDeleting = false,
}: DocumentListItemProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileName = doc.file_name || doc.title || "Untitled document";

  const handleView = async () => {
    setIsViewing(true);
    try {
      await knowledgeBaseService.viewDocument(doc.document_id);
    } catch {
      toast.error("Failed to open document");
    } finally {
      setIsViewing(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await knowledgeBaseService.downloadDocument(doc.document_id, fileName);
    } catch {
      toast.error("Failed to download document");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Collapsible
      open={detailsOpen}
      onOpenChange={setDetailsOpen}
      className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
      data-testid={`document-${doc.document_id}`}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p
              className="font-medium text-slate-900 truncate"
              title={fileName}
              data-testid={`document-filename-${doc.document_id}`}
            >
              {fileName}
            </p>
            <p
              className="text-sm text-slate-500 mt-0.5"
              data-testid={`document-upload-date-${doc.document_id}`}
            >
              Uploaded {formatUploadDate(doc.created_at)}
            </p>
            {doc.title && doc.title !== fileName && (
              <p className="text-xs text-slate-400 mt-0.5 truncate" title={doc.title}>
                {doc.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <DocumentProcessingStatusBadge status={doc.processing_status} />

          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            disabled={isViewing}
            data-testid={`view-document-${doc.document_id}`}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {isViewing ? "Opening..." : "View"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            data-testid={`download-document-${doc.document_id}`}
          >
            <Download className="w-4 h-4 mr-1.5" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              data-testid={`document-details-toggle-${doc.document_id}`}
            >
              Details
              <ChevronDown
                className={cn(
                  "w-4 h-4 ml-1.5 transition-transform",
                  detailsOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(doc.document_id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            data-testid={`delete-document-${doc.document_id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CollapsibleContent>
        <div
          className="border-t border-slate-100 px-4 py-4 bg-slate-50/50"
          data-testid={`document-details-${doc.document_id}`}
        >
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <DetailItem label="File name" value={fileName} />
            <DetailItem
              label="Upload date"
              value={formatUploadDate(doc.created_at)}
            />
            <DetailItem
              label="Document type"
              value={formatDocumentType(doc.document_type)}
            />
            <DetailItem label="File size" value={formatFileSize(doc.file_size)} />
            <DetailItem
              label="Content type"
              value={doc.content_type || "application/pdf"}
            />
            <DetailItem
              label="Processing status"
              value={doc.processing_status || "completed"}
            />
            {doc.updated_at && (
              <DetailItem
                label="Last updated"
                value={formatUploadDate(doc.updated_at)}
              />
            )}
          </dl>

          {doc.processing_error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <span className="font-medium">Processing error: </span>
              {doc.processing_error}
            </div>
          )}

          {doc.extracted_skills && doc.extracted_skills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
                Extracted skills ({doc.extracted_skills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {doc.extracted_skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-slate-900 break-words">{value}</dd>
    </div>
  );
}
