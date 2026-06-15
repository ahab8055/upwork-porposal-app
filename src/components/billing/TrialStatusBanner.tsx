"use client";

import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrialStatus } from "@/hooks/useBilling";
import {
  getTrialBannerTone,
  getTrialEndLabel,
  getTrialRemainingLabel,
  shouldShowTrialBanner,
} from "@/lib/trial-utils";
import { cn } from "@/lib/utils";

export function TrialStatusBanner() {
  const { data: trial, isLoading, isError } = useTrialStatus();

  if (isLoading || isError || !shouldShowTrialBanner(trial)) {
    return null;
  }

  const daysRemaining = trial.trial_days_remaining;
  const tone = getTrialBannerTone(daysRemaining);
  const endLabel = getTrialEndLabel(trial.trial_end_date);

  return (
    <div
      className={cn(
        "border-b px-4 py-3",
        tone === "urgent"
          ? "border-amber-200 bg-amber-50"
          : "border-blue-200 bg-blue-50"
      )}
      data-testid="trial-status-banner"
      role="status"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              tone === "urgent" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
            )}
          >
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p
              className={cn(
                "font-medium",
                tone === "urgent" ? "text-amber-900" : "text-blue-900"
              )}
              data-testid="trial-status-message"
            >
              {getTrialRemainingLabel(daysRemaining)}
            </p>
            {endLabel && (
              <p
                className={cn(
                  "mt-0.5 text-sm",
                  tone === "urgent" ? "text-amber-800/80" : "text-blue-800/80"
                )}
                data-testid="trial-status-end-date"
              >
                {endLabel}
              </p>
            )}
          </div>
        </div>

        <Button
          asChild
          size="sm"
          className={cn(
            "shrink-0",
            tone === "urgent"
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-blue-600 hover:bg-blue-700"
          )}
          data-testid="trial-upgrade-btn"
        >
          <Link href="/subscription?plan=pro">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade now
          </Link>
        </Button>
      </div>
    </div>
  );
}
