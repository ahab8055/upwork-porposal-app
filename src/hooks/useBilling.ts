import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { buildCheckoutReturnUrls } from "@/lib/checkout-urls";
import { billingService } from "@/services/billingService";
import { useOpenBillingPortal } from "@/hooks/useOpenBillingPortal";
import { useAuthStore } from "@/store/auth-store";
import { BillingPlanItem, CreateCheckoutSessionRequest } from "@/types/billing";
import { toast } from "sonner";

export const useBillingPlans = (enabled = true) => {
  return useQuery({
    queryKey: ["billing-plans"],
    queryFn: billingService.getPlans,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWorkspaceSubscription = (enabled = true) => {
  return useQuery({
    queryKey: ["workspace-subscription"],
    queryFn: billingService.getWorkspaceSubscription,
    enabled,
    retry: false,
  });
};

export const useCurrentSubscription = (enabled = true) => {
  return useQuery({
    queryKey: ["current-subscription"],
    queryFn: billingService.getCurrentSubscription,
    enabled,
    retry: false,
  });
};

export const useWorkspaceUsage = (enabled = true) => {
  return useQuery({
    queryKey: ["workspace-usage"],
    queryFn: billingService.getWorkspaceUsage,
    enabled,
    staleTime: 60 * 1000,
  });
};

export const useTrialStatus = (enabled = true) => {
  const currentWorkspaceId = useAuthStore((state) => state.currentWorkspaceId);

  return useQuery({
    queryKey: ["trial-status", currentWorkspaceId],
    queryFn: billingService.getTrialStatus,
    enabled: enabled && Boolean(currentWorkspaceId),
    staleTime: 60 * 1000,
    retry: false,
  });
};

export const useCreateBillingPortalSession = () => {
  const { openBillingPortal, isOpeningPortal, portalError, clearPortalError } =
    useOpenBillingPortal();

  return {
    mutate: openBillingPortal,
    isPending: isOpeningPortal,
    error: portalError,
    reset: clearPortalError,
  };
};

// Re-export for convenience
export { useOpenBillingPortal } from "@/hooks/useOpenBillingPortal";

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (payload: CreateCheckoutSessionRequest) =>
      billingService.createCheckoutSession(payload),
    onSuccess: (data) => {
      if (!data.checkout_url) {
        toast.error("Stripe checkout URL was not returned.");
        return;
      }
      window.location.assign(data.checkout_url);
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message =
        error.response?.data?.detail || "Unable to start checkout. Please try again.";
      toast.error(message);
    },
  });
};

export function useStartCheckout() {
  const checkoutMutation = useCreateCheckoutSession();

  const startCheckout = useCallback(
    (plan: Pick<BillingPlanItem, "plan_code" | "is_purchasable">) => {
      if (plan.plan_code === "free_trial") {
        toast.error("Use Start Free Trial to activate the trial plan.");
        return;
      }

      if (!plan.is_purchasable) {
        toast.error(
          "This plan is not linked to Stripe yet. Add STRIPE_PRO_PRICE_ID / STRIPE_AGENCY_PRICE_ID on the API."
        );
        return;
      }

      const { success_url, cancel_url } = buildCheckoutReturnUrls(
        window.location.origin
      );

      checkoutMutation.mutate({
        plan_code: plan.plan_code,
        success_url,
        cancel_url,
      });
    },
    [checkoutMutation]
  );

  return {
    startCheckout,
    isStartingCheckout: checkoutMutation.isPending,
    checkoutPlanCode: checkoutMutation.variables?.plan_code ?? null,
    checkoutError: checkoutMutation.error,
  };
}

export function useStartFreeTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => billingService.startFreeTrial(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["trial-status"] });
      queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
      toast.success("Free trial activated!");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message =
        error.response?.data?.detail || "Unable to start free trial.";
      toast.error(message);
    },
  });
}
