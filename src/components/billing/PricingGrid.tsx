"use client";

import { Loader2 } from "lucide-react";
import { PricingCard } from "@/components/billing/PricingCard";
import { BillingPlanItem } from "@/types/billing";

interface PricingGridProps {
  plans: BillingPlanItem[];
  isLoading?: boolean;
  currentPlanCode?: string | null;
  subscriptionStatus?: string | null;
  isAuthenticated?: boolean;
  isOwner?: boolean;
  onSelectPlan?: (plan: BillingPlanItem) => void;
  onStartTrial?: () => void;
  isCheckoutLoading?: boolean;
  isTrialLoading?: boolean;
  checkoutPlanCode?: string | null;
}

export function PricingGrid({
  plans,
  isLoading = false,
  currentPlanCode,
  subscriptionStatus,
  isAuthenticated = false,
  isOwner = false,
  onSelectPlan,
  onStartTrial,
  isCheckoutLoading = false,
  isTrialLoading = false,
  checkoutPlanCode,
}: PricingGridProps) {
  if (isLoading) {
    return (
      <div
        className="flex min-h-[320px] items-center justify-center"
        data-testid="pricing-loading"
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const sortedPlans = [...plans].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
      data-testid="pricing-grid"
    >
      {sortedPlans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          currentPlanCode={currentPlanCode}
          subscriptionStatus={subscriptionStatus}
          isAuthenticated={isAuthenticated}
          isOwner={isOwner}
          onSelectPlan={onSelectPlan}
          onStartTrial={onStartTrial}
          isCheckoutLoading={isCheckoutLoading}
          isTrialLoading={isTrialLoading}
          checkoutPlanCode={checkoutPlanCode}
        />
      ))}
    </div>
  );
}
