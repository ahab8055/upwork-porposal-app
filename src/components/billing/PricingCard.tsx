"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  Crown,
  Loader2,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isCurrentPlan,
  parsePriceDisplay,
  POPULAR_PLAN_CODE,
} from "@/lib/billing-utils";
import { buildLoginCheckoutPath } from "@/lib/checkout-urls";
import { BillingPlanItem } from "@/types/billing";
import { cn } from "@/lib/utils";

const PLAN_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  free_trial: Zap,
  pro: Star,
  agency: Users,
  enterprise: Building2,
};

const PLAN_ICON_STYLES: Record<string, string> = {
  free_trial: "bg-slate-100 text-slate-600",
  pro: "bg-blue-100 text-blue-600",
  agency: "bg-violet-100 text-violet-600",
  enterprise: "bg-amber-100 text-amber-700",
};

interface PricingCardProps {
  plan: BillingPlanItem;
  currentPlanCode?: string | null;
  subscriptionStatus?: string | null;
  isAuthenticated?: boolean;
  isOwner?: boolean;
  onSelectPlan?: (plan: BillingPlanItem) => void;
  isCheckoutLoading?: boolean;
  checkoutPlanCode?: string | null;
}

function getCtaLabel(
  plan: BillingPlanItem,
  options: {
    isAuthenticated: boolean;
    isOwner: boolean;
    isCurrent: boolean;
  }
): string {
  const { isAuthenticated, isOwner, isCurrent } = options;

  if (isCurrent) {
    return "Current Plan";
  }

  if (plan.plan_code === "enterprise") {
    return "Contact Sales";
  }

  if (plan.plan_code === "free_trial") {
    return isAuthenticated ? "Included with signup" : "Start Free Trial";
  }

  if (!isAuthenticated) {
    return plan.plan_code === "free_trial" ? "Start Free Trial" : "Subscribe";
  }

  if (!isOwner) {
    return "Ask workspace owner";
  }

  if (plan.is_purchasable) {
    return `Upgrade to ${plan.name}`;
  }

  return "Coming Soon";
}

export function PricingCard({
  plan,
  currentPlanCode,
  subscriptionStatus,
  isAuthenticated = false,
  isOwner = false,
  onSelectPlan,
  isCheckoutLoading = false,
  checkoutPlanCode,
}: PricingCardProps) {
  const isPopular = plan.plan_code === POPULAR_PLAN_CODE;
  const isCurrent = isCurrentPlan(
    plan.plan_code,
    currentPlanCode,
    subscriptionStatus
  );
  const { amount, period } = parsePriceDisplay(plan.price_display);
  const Icon = PLAN_ICONS[plan.plan_code] ?? Crown;
  const iconStyle =
    PLAN_ICON_STYLES[plan.plan_code] ?? "bg-slate-100 text-slate-600";

  const ctaLabel = getCtaLabel(plan, {
    isAuthenticated,
    isOwner,
    isCurrent,
  });

  const isEnterprise = plan.plan_code === "enterprise";
  const isLoadingThisPlan =
    isCheckoutLoading && checkoutPlanCode === plan.plan_code;

  const canCheckout =
    isAuthenticated &&
    isOwner &&
    plan.is_purchasable &&
    !isCurrent &&
    onSelectPlan;

  const isDisabled =
    isCurrent ||
    isLoadingThisPlan ||
    (isAuthenticated &&
      !isOwner &&
      plan.plan_code !== "enterprise" &&
      plan.plan_code !== "free_trial") ||
    (isAuthenticated &&
      isOwner &&
      !plan.is_purchasable &&
      plan.plan_code !== "enterprise" &&
      plan.plan_code !== "free_trial");

  const handleClick = () => {
    if (canCheckout) {
      onSelectPlan(plan);
    }
  };

  const buttonContent = (
    <Button
      className={cn(
        "w-full",
        isPopular && !isCurrent && "bg-blue-600 hover:bg-blue-700",
        !isPopular && !isCurrent && !isEnterprise && "bg-slate-900 hover:bg-slate-800"
      )}
      variant={isCurrent ? "outline" : isEnterprise ? "outline" : "default"}
      disabled={isDisabled && !isEnterprise}
      onClick={handleClick}
      data-testid={`pricing-${plan.plan_code}-btn`}
    >
      {isLoadingThisPlan ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        ctaLabel
      )}
    </Button>
  );

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border bg-white p-6 transition-shadow hover:shadow-md",
        isPopular
          ? "border-blue-600 ring-2 ring-blue-600"
          : "border-slate-200",
        isCurrent && "ring-2 ring-emerald-500 border-emerald-500"
      )}
      data-testid={`pricing-card-${plan.plan_code}`}
    >
      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
          Most Popular
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
          Your Plan
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            iconStyle
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900">
            {plan.name}
          </h3>
          {plan.description && (
            <p className="line-clamp-2 text-sm text-slate-500">
              {plan.description}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <span className="font-heading text-4xl font-bold text-slate-900">
          {amount}
        </span>
        {period && <span className="text-slate-600">{period}</span>}
      </div>

      <ul className="mb-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-slate-600"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {isEnterprise ? (
          <a href="mailto:sales@proposaliq.com?subject=Enterprise%20Plan%20Inquiry">
            {buttonContent}
          </a>
        ) : !isAuthenticated && plan.plan_code === "free_trial" ? (
          <Link href="/signup">{buttonContent}</Link>
        ) : !isAuthenticated ? (
          <Link href={buildLoginCheckoutPath(plan.plan_code)}>
            {buttonContent}
          </Link>
        ) : (
          buttonContent
        )}
      </div>
    </article>
  );
}
