"use client";

import { CheckCircle2, Loader2, Upload, AlertCircle } from "lucide-react";
import type { DocumentProcessingStatus } from "@/types/knowledge-base";
import { cn } from "@/lib/utils";

interface StatusConfig {
  label: string;
  description: string;
  className: string;
  icon: typeof CheckCircle2;
  spin?: boolean;
  testId: string;
}

function getStatusConfig(
  status?: DocumentProcessingStatus
): StatusConfig {
  switch (status) {
    case "pending":
      return {
        label: "Uploaded",
        description: "Queued for processing",
        className: "bg-blue-100 text-blue-700",
        icon: Upload,
        testId: "document-status-uploaded",
      };
    case "processing":
      return {
        label: "Processing",
        description: "Preparing for AI features",
        className: "bg-amber-100 text-amber-700",
        icon: Loader2,
        spin: true,
        testId: "document-status-processing",
      };
    case "failed":
      return {
        label: "Failed",
        description: "Processing could not complete",
        className: "bg-red-100 text-red-700",
        icon: AlertCircle,
        testId: "document-status-failed",
      };
    case "completed":
    default:
      return {
        label: "Ready",
        description: "Available for AI features",
        className: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle2,
        testId: "document-status-ready",
      };
  }
}

interface DocumentProcessingStatusBadgeProps {
  status?: DocumentProcessingStatus;
  showDescription?: boolean;
  className?: string;
}

export function DocumentProcessingStatusBadge({
  status,
  showDescription = false,
  className,
}: DocumentProcessingStatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-end gap-0.5", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          config.className
        )}
        data-testid={config.testId}
      >
        <Icon className={cn("w-3.5 h-3.5", config.spin && "animate-spin")} />
        {config.label}
      </span>
      {showDescription && (
        <span className="text-xs text-slate-500">{config.description}</span>
      )}
    </div>
  );
}

export function isDocumentProcessing(status?: DocumentProcessingStatus): boolean {
  return status === "pending" || status === "processing";
}

export function isDocumentReady(status?: DocumentProcessingStatus): boolean {
  return !status || status === "completed";
}
