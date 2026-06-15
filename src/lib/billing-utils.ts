/** Split API price_display into amount and period suffix. */
export function parsePriceDisplay(priceDisplay: string): {
  amount: string;
  period: string | null;
} {
  const slashIndex = priceDisplay.indexOf("/");
  if (slashIndex === -1) {
    return { amount: priceDisplay, period: null };
  }

  return {
    amount: priceDisplay.slice(0, slashIndex),
    period: priceDisplay.slice(slashIndex),
  };
}

export const POPULAR_PLAN_CODE = "pro";

export function isCurrentPlan(
  planCode: string,
  currentPlanCode: string | null | undefined,
  status: string | null | undefined
): boolean {
  if (!currentPlanCode) {
    return false;
  }

  if (planCode === currentPlanCode) {
    return true;
  }

  // Active trial maps to the free_trial plan in the catalog.
  if (
    planCode === "free_trial" &&
    currentPlanCode === "free_trial" &&
    status === "trialing"
  ) {
    return true;
  }

  return false;
}
