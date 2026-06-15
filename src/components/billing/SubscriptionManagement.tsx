"use client";

import { Loader2 } from "lucide-react";
import { BillingActions } from "@/components/billing/BillingActions";
import { SubscriptionOverview } from "@/components/billing/SubscriptionOverview";
import { UsageStatistics } from "@/components/billing/UsageStatistics";
import {
  useCurrentSubscription,
  useWorkspaceSubscription,
  useWorkspaceUsage,
} from "@/hooks/useBilling";
import { useOpenBillingPortal } from "@/hooks/useOpenBillingPortal";
import { useAuthStore } from "@/store/auth-store";

interface SubscriptionManagementProps {
  onViewPlans?: () => void;
}

export function SubscriptionManagement({
  onViewPlans,
}: SubscriptionManagementProps) {
  const getCurrentWorkspace = useAuthStore((state) => state.getCurrentWorkspace);
  const isOwner = getCurrentWorkspace()?.role === "owner";

  const {
    data: ownerSubscription,
    isLoading: ownerLoading,
  } = useCurrentSubscription(isOwner);

  const {
    data: memberSubscription,
    isLoading: memberLoading,
  } = useWorkspaceSubscription(true);

  const subscription =
    (isOwner ? ownerSubscription : null) ?? memberSubscription ?? undefined;

  const isLoading =
    !subscription && (memberLoading || (isOwner && ownerLoading));

  const { data: usage, isLoading: usageLoading } = useWorkspaceUsage();
  const {
    openBillingPortal,
    isOpeningPortal,
    portalError,
    clearPortalError,
  } = useOpenBillingPortal();

  const handleManageBilling = () => {
    clearPortalError();
    openBillingPortal();
  };

  const handleViewPlans = () => {
    onViewPlans?.();
  };

  if (isLoading && !subscription) {
    return (
      <div
        className="flex min-h-[240px] items-center justify-center"
        data-testid="subscription-management-loading"
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div
        className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500"
        data-testid="subscription-management-empty"
      >
        Subscription information could not be loaded for this workspace.
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="subscription-management">
      <SubscriptionOverview
        subscription={subscription}
        isOwner={isOwner}
        isLoading={isLoading}
        onManageBilling={isOwner ? handleManageBilling : undefined}
        isPortalLoading={isOpeningPortal}
      />
      <UsageStatistics usage={usage} isLoading={usageLoading} />
      <BillingActions
        isOwner={isOwner}
        onManageBilling={handleManageBilling}
        onViewPlans={handleViewPlans}
        isPortalLoading={isOpeningPortal}
        portalError={portalError}
        onRetryPortal={handleManageBilling}
        onDismissPortalError={clearPortalError}
      />
    </div>
  );
}
