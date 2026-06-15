"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { PricingGrid } from "@/components/billing/PricingGrid";
import { CheckoutStatusBanner } from "@/components/billing/CheckoutStatusBanner";
import {
  useBillingPlans,
  useStartCheckout,
  useWorkspaceSubscription,
} from "@/hooks/useBilling";
import { useCheckoutReturn } from "@/hooks/useCheckoutReturn";
import { STATIC_BILLING_PLANS } from "@/lib/static-billing-plans";
import { useAuthStore } from "@/store/auth-store";
import { BillingPlanItem } from "@/types/billing";
import { cn } from "@/lib/utils";

interface PricingPageContentProps {
  variant?: "public" | "dashboard";
  className?: string;
  showCheckoutBanner?: boolean;
  showPageHeader?: boolean;
}

export function PricingPageContent({
  variant = "public",
  className,
  showCheckoutBanner = true,
  showPageHeader = true,
}: PricingPageContentProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getCurrentWorkspace = useAuthStore((state) => state.getCurrentWorkspace);
  const currentWorkspace = getCurrentWorkspace();
  const isOwner = currentWorkspace?.role === "owner";

  const useLiveData = isAuthenticated;
  const { data: plansData, isLoading: plansLoading } = useBillingPlans(useLiveData);
  const { data: subscription } = useWorkspaceSubscription(useLiveData);
  const { startCheckout, isStartingCheckout, checkoutPlanCode, checkoutError } =
    useStartCheckout();
  const { checkoutStatus, pendingPlanCode, dismissBanner } = useCheckoutReturn();
  const autoCheckoutAttempted = useRef(false);

  const plans = useMemo(() => {
    if (useLiveData && plansData?.items?.length) {
      return plansData.items;
    }
    return STATIC_BILLING_PLANS;
  }, [useLiveData, plansData]);

  const currentPlanCode =
    subscription?.plan?.plan_code ??
    (subscription?.status === "trialing" ? "free_trial" : null);

  const handleSelectPlan = useCallback(
    (plan: BillingPlanItem) => {
      startCheckout(plan);
    },
    [startCheckout]
  );

  useEffect(() => {
    if (checkoutError) {
      autoCheckoutAttempted.current = false;
    }
  }, [checkoutError]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !isOwner ||
      !pendingPlanCode ||
      autoCheckoutAttempted.current ||
      isStartingCheckout ||
      checkoutStatus
    ) {
      return;
    }

    const targetPlan = plans.find((plan) => plan.plan_code === pendingPlanCode);
    if (!targetPlan?.is_purchasable) {
      return;
    }

    autoCheckoutAttempted.current = true;
    startCheckout(targetPlan);
  }, [
    checkoutStatus,
    isOwner,
    isStartingCheckout,
    pendingPlanCode,
    plans,
    startCheckout,
    isAuthenticated,
  ]);

  const isDashboard = variant === "dashboard";

  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)}>
      <div
        className={cn(
          "mb-10 text-center",
          isDashboard ? "mb-12" : "mb-16"
        )}
      >
        {showCheckoutBanner && checkoutStatus && (
          <CheckoutStatusBanner
            status={checkoutStatus}
            onDismiss={dismissBanner}
          />
        )}

        {showPageHeader && (
          <>
            <h1
              className={cn(
                "font-heading font-bold text-slate-900",
                isDashboard ? "text-3xl" : "text-3xl md:text-4xl"
              )}
            >
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Compare plans and choose the right fit for your team. Start with a
              free trial, then upgrade when you are ready to scale.
            </p>
          </>
        )}

        {isAuthenticated && subscription && showPageHeader && (
          <p className="mt-4 text-sm text-slate-500">
            Current workspace plan:{" "}
            <span className="font-medium text-slate-700">
              {subscription.plan?.name ?? subscription.status}
            </span>
            {!isOwner && " — contact your workspace owner to change plans"}
          </p>
        )}

        {pendingPlanCode && isAuthenticated && isOwner && isStartingCheckout && (
          <p
            className="mt-4 text-sm text-blue-600"
            data-testid="checkout-redirecting"
          >
            Redirecting to secure Stripe checkout...
          </p>
        )}
      </div>

      <PricingGrid
        plans={plans}
        isLoading={useLiveData && plansLoading}
        currentPlanCode={currentPlanCode}
        subscriptionStatus={subscription?.status}
        isAuthenticated={isAuthenticated}
        isOwner={isOwner}
        onSelectPlan={handleSelectPlan}
        isCheckoutLoading={isStartingCheckout}
        checkoutPlanCode={checkoutPlanCode}
      />
    </div>
  );
}
