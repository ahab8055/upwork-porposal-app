export type CheckoutStatus = "success" | "cancelled";

export function buildCheckoutReturnUrls(origin: string) {
  return {
    success_url: `${origin}/subscription?checkout=success`,
    cancel_url: `${origin}/subscription?checkout=cancelled`,
  };
}

export function buildSubscriptionPath(options?: { plan?: string; checkout?: CheckoutStatus }) {
  const params = new URLSearchParams();
  if (options?.plan) {
    params.set("plan", options.plan);
  }
  if (options?.checkout) {
    params.set("checkout", options.checkout);
  }
  const query = params.toString();
  return query ? `/subscription?${query}` : "/subscription";
}

export function buildLoginCheckoutPath(planCode: string) {
  const destination = buildSubscriptionPath({ plan: planCode });
  return `/login?redirect=${encodeURIComponent(destination)}`;
}

export function parseCheckoutStatus(
  value: string | null | undefined
): CheckoutStatus | null {
  if (value === "success") {
    return "success";
  }
  if (value === "cancelled" || value === "canceled") {
    return "cancelled";
  }
  return null;
}
