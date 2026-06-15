"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/** Refresh billing data when the user returns from the Stripe billing portal. */
export function useBillingPortalReturnRefresh() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshBillingQueries = () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["workspace-subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["current-subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["workspace-usage"] }),
        queryClient.invalidateQueries({ queryKey: ["trial-status"] }),
      ]);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshBillingQueries();
      }
    };

    window.addEventListener("focus", refreshBillingQueries);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", refreshBillingQueries);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient]);
}
