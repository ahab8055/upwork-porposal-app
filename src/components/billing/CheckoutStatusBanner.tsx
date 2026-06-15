"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CheckoutStatus } from "@/lib/checkout-urls";
import { cn } from "@/lib/utils";

interface CheckoutStatusBannerProps {
  status: CheckoutStatus;
  onDismiss?: () => void;
  className?: string;
}

export function CheckoutStatusBanner({
  status,
  onDismiss,
  className,
}: CheckoutStatusBannerProps) {
  const isSuccess = status === "success";

  return (
    <div
      className={cn(
        "relative mx-auto mt-4 flex max-w-2xl items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-800",
        className
      )}
      data-testid={isSuccess ? "checkout-success-banner" : "checkout-canceled-banner"}
      role="status"
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      )}
      <div className="flex-1 pr-8">
        <p className="font-medium">
          {isSuccess ? "Subscription activated" : "Checkout canceled"}
        </p>
        <p className="mt-1 text-sm opacity-90">
          {isSuccess
            ? "Your payment was successful. Premium features are unlocking for this workspace."
            : "No charges were made. You can choose a plan and try again whenever you are ready."}
        </p>
      </div>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-current hover:bg-black/5"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
