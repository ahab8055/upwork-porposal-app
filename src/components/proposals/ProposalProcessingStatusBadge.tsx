"use client";

import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { ProposalProcessingStatus } from "@/types/proposal";
import { cn } from "@/lib/utils";

interface StatusConfig {
  label: string;
  className: string;
  icon: typeof CheckCircle2;
  spin?: boolean;
  testId: string;
}

function getStatusConfig(status: ProposalProcessingStatus): StatusConfig {
  switch (status) {
    case "pending":
      return {
        label: "Queued",
        className: "bg-blue-100 text-blue-700",
        icon: Clock,
        testId: "proposal-status-pending",
      };
    case "processing":
      return {
        label: "Generating",
        className: "bg-amber-100 text-amber-700",
        icon: Loader2,
        spin: true,
        testId: "proposal-status-processing",
      };
    case "failed":
      return {
        label: "Failed",
        className: "bg-red-100 text-red-700",
        icon: AlertCircle,
        testId: "proposal-status-failed",
      };
    case "completed":
    default:
      return {
        label: "Ready",
        className: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle2,
        testId: "proposal-status-completed",
      };
  }
}

interface ProposalProcessingStatusBadgeProps {
  status: ProposalProcessingStatus;
  className?: string;
}

export function ProposalProcessingStatusBadge({
  status,
  className,
}: ProposalProcessingStatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
      data-testid={config.testId}
    >
      <Icon className={cn("w-3.5 h-3.5", config.spin && "animate-spin")} />
      {config.label}
    </span>
  );
}
