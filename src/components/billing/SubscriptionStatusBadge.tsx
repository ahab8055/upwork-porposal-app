import { SubscriptionStatus } from "@/types/billing";
import { cn } from "@/lib/utils";
import {
  getSubscriptionStatusLabel,
  getSubscriptionStatusStyle,
} from "@/lib/subscription-utils";

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

export function SubscriptionStatusBadge({
  status,
  className,
}: SubscriptionStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getSubscriptionStatusStyle(status),
        className
      )}
      data-testid="subscription-status-badge"
    >
      {getSubscriptionStatusLabel(status)}
    </span>
  );
}
