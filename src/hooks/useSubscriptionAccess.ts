import { useTrialStatus } from "@/hooks/useBilling";
import {
  hasPremiumAccess,
  isSubscriptionExpired,
} from "@/lib/subscription-access";

export function useSubscriptionAccess() {
  const { data: trial, isLoading, isError, refetch } = useTrialStatus();

  const expired = isSubscriptionExpired(trial);
  const canAccessPremium = hasPremiumAccess(trial);

  return {
    trial,
    isLoading,
    isError,
    isExpired: expired,
    canAccessPremium,
    refetch,
  };
}
