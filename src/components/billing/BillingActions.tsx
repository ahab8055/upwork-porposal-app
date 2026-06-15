"use client";

import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ManageBillingButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
}

export function ManageBillingButton({
  onClick,
  isLoading = false,
  disabled = false,
  className,
  size = "default",
  variant = "default",
}: ManageBillingButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size={size}
      variant={variant}
      className={cn(
        variant === "default" && "bg-blue-600 hover:bg-blue-700",
        className
      )}
      data-testid="manage-billing-btn"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening portal...
        </>
      ) : (
        <>
          Manage billing
          <ExternalLink className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

interface BillingPortalErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function BillingPortalError({
  message,
  onRetry,
  onDismiss,
}: BillingPortalErrorProps) {
  return (
    <div
      className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
      data-testid="billing-portal-error"
      role="alert"
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-200 bg-white text-red-800 hover:bg-red-100"
            onClick={onRetry}
            data-testid="billing-portal-retry-btn"
          >
            Try again
          </Button>
        )}
        {onDismiss && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-red-800 hover:bg-red-100"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}

interface BillingActionsProps {
  isOwner: boolean;
  onManageBilling: () => void;
  onViewPlans: () => void;
  isPortalLoading?: boolean;
  portalError?: string | null;
  onRetryPortal?: () => void;
  onDismissPortalError?: () => void;
}

export function BillingActions({
  isOwner,
  onManageBilling,
  onViewPlans,
  isPortalLoading = false,
  portalError = null,
  onRetryPortal,
  onDismissPortalError,
}: BillingActionsProps) {
  return (
    <div className="space-y-4" data-testid="billing-actions">
      {portalError && (
        <BillingPortalError
          message={portalError}
          onRetry={onRetryPortal}
          onDismiss={onDismissPortalError}
        />
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900">
            Billing actions
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {isOwner
              ? "Update payment methods, view invoices, and manage your subscription in Stripe."
              : "Ask your workspace owner to manage billing and payment details."}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onViewPlans} data-testid="view-plans-btn">
            View plans
          </Button>
          {isOwner && (
            <ManageBillingButton
              onClick={onManageBilling}
              isLoading={isPortalLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
