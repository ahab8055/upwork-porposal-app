"use client";

import { Check, Loader2 } from "lucide-react";
import { useBillingPlans } from "@/hooks/useBilling";
import { STATIC_BILLING_PLANS } from "@/lib/static-billing-plans";
import { parsePriceDisplay } from "@/lib/billing-utils";
import { cn } from "@/lib/utils";

interface PlanSelectionStepProps {
  selectedPlanCode: string | null;
  onChange: (planCode: string) => void;
}

export function PlanSelectionStep({
  selectedPlanCode,
  onChange,
}: PlanSelectionStepProps) {
  const { data: plansData, isLoading } = useBillingPlans(true);
  const plans = plansData?.items?.length ? plansData.items : STATIC_BILLING_PLANS;

  const selectablePlans = plans.filter(
    (plan) => plan.plan_code !== "enterprise"
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Choose your plan</h2>
        <p className="mt-2 text-sm text-gray-600">
          Start with a free trial or subscribe to a paid plan. You can change
          plans anytime from billing settings.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex flex-nowrap gap-4 overflow-x-auto pb-1">
          {selectablePlans.map((plan) => {
            const isSelected = selectedPlanCode === plan.plan_code;
            const { amount, period } = parsePriceDisplay(plan.price_display);
            const isPaid = plan.plan_code !== "free_trial";

            return (
              <button
                key={plan.plan_code}
                type="button"
                onClick={() => onChange(plan.plan_code)}
                className={cn(
                  "relative min-w-[200px] flex-1 basis-0 rounded-xl border p-5 text-left transition-all hover:shadow-md",
                  isSelected
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
                data-testid={`onboarding-plan-${plan.plan_code}`}
              >
                {isSelected && (
                  <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}

                <div className="pr-8">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  {plan.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{amount}</span>
                  {period && <span className="text-gray-600">{period}</span>}
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 3).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isPaid && !plan.is_purchasable && (
                  <p className="mt-3 text-xs text-amber-700">
                    Stripe checkout will be available after billing is configured.
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
