"use client";

import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { getExpiredReasonLabel } from "@/lib/subscription-access";
import { useAuthStore } from "@/store/auth-store";

export function SubscriptionExpiredBanner() {
  const { trial, isLoading, isError, isExpired } = useSubscriptionAccess();
  const isOwner = useAuthStore((state) => state.getCurrentWorkspace())?.role === "owner";

  if (isLoading || isError || !isExpired || !trial) {
    return null;
  }

  const reason = getExpiredReasonLabel(trial);

  return (
    <div
      className="border-b border-red-200 bg-red-50 px-4 py-3"
      data-testid="subscription-expired-banner"
      role="alert"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="font-medium text-red-900">{reason}</p>
            <p className="mt-0.5 text-sm text-red-800/80">
              {isOwner
                ? "Upgrade to restore AI proposals, job analysis, and uploads."
                : "Contact your workspace owner to restore access."}
            </p>
          </div>
        </div>

        {isOwner ? (
          <Button
            asChild
            size="sm"
            className="shrink-0 bg-red-600 hover:bg-red-700"
            data-testid="expired-banner-upgrade-btn"
          >
            <Link href="/subscription?tab=plans&plan=pro">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade now
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="shrink-0 border-red-200 text-red-800 hover:bg-red-100"
          >
            <Link href="/subscription">Learn more</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
