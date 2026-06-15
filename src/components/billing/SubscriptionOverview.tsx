"use client";

import {
  Calendar,
  Check,
  Clock,
  Crown,
  Shield,
} from "lucide-react";
import { ManageBillingButton } from "@/components/billing/BillingActions";
import { SubscriptionStatusBadge } from "@/components/billing/SubscriptionStatusBadge";
import { formatBillingDate } from "@/lib/subscription-utils";
import {
  CurrentSubscriptionResponse,
  WorkspaceSubscriptionDetail,
} from "@/types/billing";

interface SubscriptionOverviewProps {
  subscription: CurrentSubscriptionResponse | WorkspaceSubscriptionDetail;
  isOwner?: boolean;
  isLoading?: boolean;
  onManageBilling?: () => void;
  isPortalLoading?: boolean;
}

function getPlanName(
  subscription: CurrentSubscriptionResponse | WorkspaceSubscriptionDetail
): string {
  return subscription.plan?.name ?? "Unknown plan";
}

function getRenewalDate(
  subscription: CurrentSubscriptionResponse | WorkspaceSubscriptionDetail
): string | null {
  if ("renewal_date" in subscription) {
    return subscription.renewal_date;
  }
  if (subscription.is_trial_active) {
    return subscription.trial_end_date ?? subscription.trial_ends_at ?? null;
  }
  return subscription.current_period_end ?? null;
}

export function SubscriptionOverview({
  subscription,
  isOwner = false,
  isLoading = false,
  onManageBilling,
  isPortalLoading = false,
}: SubscriptionOverviewProps) {
  if (isLoading) {
    return (
      <div
        className="h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
        data-testid="subscription-overview-loading"
      />
    );
  }

  const planName = getPlanName(subscription);
  const renewalDate = getRenewalDate(subscription);
  const isTrialActive = subscription.is_trial_active ?? false;
  const trialDaysRemaining = subscription.trial_days_remaining ?? 0;
  const accessGranted =
    "access_granted" in subscription ? subscription.access_granted : true;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;
  const isTrialExpired =
    "is_trial_expired" in subscription && subscription.is_trial_expired;

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6"
      data-testid="subscription-overview"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Current plan</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-2xl font-bold text-slate-900">
                    {planName}
                  </h2>
                  <SubscriptionStatusBadge status={subscription.status} />
                </div>
                {subscription.plan?.description && (
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    {subscription.plan.description}
                  </p>
                )}
              </div>
            </div>
            {isOwner && onManageBilling && (
              <ManageBillingButton
                onClick={onManageBilling}
                isLoading={isPortalLoading}
                variant="outline"
                className="shrink-0"
              />
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {isTrialActive ? "Trial ends" : "Renewal date"}
              </div>
              <p
                className="mt-2 font-medium text-slate-900"
                data-testid="subscription-renewal-date"
              >
                {formatBillingDate(renewalDate)}
              </p>
            </div>

            {isTrialActive && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Clock className="h-4 w-4" />
                  Trial status
                </div>
                <p
                  className="mt-2 font-medium text-blue-900"
                  data-testid="subscription-trial-days"
                >
                  {trialDaysRemaining} day{trialDaysRemaining === 1 ? "" : "s"}{" "}
                  remaining
                </p>
              </div>
            )}

            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="h-4 w-4" />
                Access
              </div>
              <p className="mt-2 font-medium text-slate-900">
                {accessGranted ? "Premium features enabled" : "Limited access"}
              </p>
            </div>
          </div>

          {isTrialExpired && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              Your free trial has ended. Upgrade to restore full access to premium
              features.
            </p>
          )}

          {cancelAtPeriodEnd && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Your subscription is set to cancel at the end of the current billing
              period.
            </p>
          )}

          {!isOwner && (
            <p className="text-sm text-slate-500">
              Billing changes can only be made by the workspace owner.
            </p>
          )}
        </div>

        {"features" in subscription && subscription.features.length > 0 && (
          <div className="w-full lg:max-w-sm">
            <p className="mb-3 text-sm font-medium text-slate-700">Plan includes</p>
            <ul className="space-y-2">
              {subscription.features.slice(0, 5).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
