import { WorkspaceTrialStatusResponse } from "@/types/billing";
import { formatBillingDate } from "@/lib/subscription-utils";

export function getTrialRemainingLabel(daysRemaining: number): string {
  if (daysRemaining <= 0) {
    return "Your trial ends today";
  }
  if (daysRemaining === 1) {
    return "1 day remaining in your free trial";
  }
  return `${daysRemaining} days remaining in your free trial`;
}

export function shouldShowTrialBanner(
  trial: WorkspaceTrialStatusResponse | null | undefined
): trial is WorkspaceTrialStatusResponse {
  if (!trial) {
    return false;
  }

  if (trial.status === "active" || trial.status === "past_due") {
    return false;
  }

  return trial.is_trial_active && !trial.is_trial_expired;
}

export function getTrialBannerTone(daysRemaining: number): "default" | "urgent" {
  return daysRemaining <= 3 ? "urgent" : "default";
}

export function getTrialEndLabel(trialEndDate: string | null): string | null {
  if (!trialEndDate) {
    return null;
  }
  return `Trial ends ${formatBillingDate(trialEndDate)}`;
}
