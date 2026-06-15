"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { billingService } from "@/services/billingService";
import {
  buildBillingPortalReturnUrl,
  getBillingPortalErrorMessage,
} from "@/lib/billing-portal";
import { CreateBillingPortalSessionRequest } from "@/types/billing";
import { toast } from "sonner";

export function useOpenBillingPortal() {
  const mutation = useMutation({
    mutationFn: (payload?: CreateBillingPortalSessionRequest) =>
      billingService.createBillingPortalSession(payload),
    onSuccess: (data) => {
      if (!data.portal_url) {
        toast.error("Billing portal URL was not returned.");
        return;
      }
      window.location.assign(data.portal_url);
    },
  });

  const openBillingPortal = useCallback(
    (returnUrl?: string) => {
      mutation.mutate({
        return_url: returnUrl ?? buildBillingPortalReturnUrl(),
      });
    },
    [mutation]
  );

  const portalError = mutation.isError
    ? getBillingPortalErrorMessage(mutation.error)
    : null;

  return {
    openBillingPortal,
    isOpeningPortal: mutation.isPending,
    portalError,
    clearPortalError: mutation.reset,
  };
}
