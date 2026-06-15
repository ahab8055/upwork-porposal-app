import { WorkspaceTrialStatusResponse } from "@/types/billing";

/** Routes that require an active subscription or valid trial. */
export const PREMIUM_ROUTE_PATTERNS: RegExp[] = [
  /^\/new-proposal(?:\/|$)/,
  /^\/analytics(?:\/|$)/,
  /^\/proposals\/[^/]+\/edit(?:\/|$)/,
];

export function isPremiumRoute(pathname: string): boolean {
  return PREMIUM_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function hasPremiumAccess(
  trial: WorkspaceTrialStatusResponse | null | undefined
): boolean {
  if (!trial) {
    return true;
  }

  if (trial.access_granted) {
    return true;
  }

  return trial.status === "active" || trial.status === "past_due";
}

export function isSubscriptionExpired(
  trial: WorkspaceTrialStatusResponse | null | undefined
): boolean {
  if (!trial) {
    return false;
  }

  return !hasPremiumAccess(trial);
}

export function getExpiredReasonLabel(
  trial: WorkspaceTrialStatusResponse
): string {
  if (trial.is_trial_expired || trial.status === "trialing") {
    return "Your free trial has ended";
  }

  if (trial.status === "canceled") {
    return "Your subscription has been canceled";
  }

  if (trial.status === "past_due") {
    return "Your subscription payment is past due";
  }

  return "Your subscription has expired";
}
