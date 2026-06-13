"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Document, DocumentProcessingStatus } from "@/types/knowledge-base";
import { isDocumentProcessing } from "@/components/knowledge-base/DocumentProcessingStatusBadge";

export function useDocumentProcessingNotifications(documents: Document[]) {
  const previousStatusRef = useRef<Record<string, DocumentProcessingStatus>>({});

  useEffect(() => {
    for (const doc of documents) {
      const documentId = doc.document_id;
      const currentStatus = doc.processing_status ?? "completed";
      const previousStatus = previousStatusRef.current[documentId];

      if (
        previousStatus &&
        isDocumentProcessing(previousStatus) &&
        currentStatus === "completed"
      ) {
        toast.success(`${doc.title} is ready for AI features`);
      }

      if (previousStatus && previousStatus !== "failed" && currentStatus === "failed") {
        toast.error(`${doc.title} processing failed`);
      }

      previousStatusRef.current[documentId] = currentStatus;
    }
  }, [documents]);
}
