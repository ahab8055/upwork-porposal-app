"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  buildSubscriptionPath,
  parseCheckoutStatus,
  type CheckoutStatus,
} from "@/lib/checkout-urls";

const SUBSCRIPTION_POLL_INTERVAL_MS = 2000;
const SUBSCRIPTION_POLL_MAX_ATTEMPTS = 15;

export function useCheckoutReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const handledStatusRef = useRef<string | null>(null);

  const checkoutStatus = parseCheckoutStatus(searchParams.get("checkout"));
  const pendingPlanCode = searchParams.get("plan");
  const [dismissedStatus, setDismissedStatus] = useState<CheckoutStatus | null>(
    null
  );

  const clearCheckoutQueryParams = useCallback(() => {
    router.replace(buildSubscriptionPath(), { scroll: false });
  }, [router]);

  const dismissBanner = useCallback(() => {
    if (checkoutStatus) {
      setDismissedStatus(checkoutStatus);
    }
    clearCheckoutQueryParams();
  }, [checkoutStatus, clearCheckoutQueryParams]);

  const refreshBillingState = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["billing-plans"] }),
      queryClient.invalidateQueries({ queryKey: ["workspace-subscription"] }),
      queryClient.invalidateQueries({ queryKey: ["current-subscription"] }),
      queryClient.invalidateQueries({ queryKey: ["workspace-usage"] }),
      queryClient.invalidateQueries({ queryKey: ["trial-status"] }),
    ]);
  }, [queryClient]);

  useEffect(() => {
    if (!checkoutStatus) {
      return;
    }

    const statusKey = `${checkoutStatus}:${searchParams.toString()}`;
    if (handledStatusRef.current === statusKey) {
      return;
    }
    handledStatusRef.current = statusKey;

    void refreshBillingState();

    if (checkoutStatus === "success") {
      toast.success("Payment successful. Updating your subscription...");
    } else {
      toast.message("Checkout canceled");
    }
  }, [checkoutStatus, refreshBillingState, searchParams]);

  useEffect(() => {
    if (checkoutStatus !== "success") {
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const pollSubscription = async () => {
      while (!cancelled && attempts < SUBSCRIPTION_POLL_MAX_ATTEMPTS) {
        attempts += 1;
        await queryClient.refetchQueries({ queryKey: ["workspace-subscription"] });
        const subscription = queryClient.getQueryData<{
          status?: string;
          plan?: { plan_code?: string };
        }>(["workspace-subscription"]);

        if (
          subscription?.status === "active" ||
          (subscription?.plan?.plan_code &&
            subscription.plan.plan_code !== "free_trial")
        ) {
          return;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, SUBSCRIPTION_POLL_INTERVAL_MS)
        );
      }
    };

    void pollSubscription();

    return () => {
      cancelled = true;
    };
  }, [checkoutStatus, queryClient]);

  const visibleStatus =
    checkoutStatus && dismissedStatus !== checkoutStatus ? checkoutStatus : null;

  return {
    checkoutStatus: visibleStatus,
    pendingPlanCode,
    dismissBanner,
    clearCheckoutQueryParams,
  };
}
