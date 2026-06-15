import { SubscriptionStatus } from "@/types/billing";

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  trialing: "Free Trial",
  active: "Active",
  past_due: "Past Due",
  canceled: "Canceled",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
  incomplete_expired: "Expired",
  paused: "Paused",
};

const STATUS_STYLES: Record<SubscriptionStatus, string> = {
  trialing: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  past_due: "bg-amber-100 text-amber-800",
  canceled: "bg-slate-100 text-slate-600",
  unpaid: "bg-red-100 text-red-700",
  incomplete: "bg-amber-100 text-amber-800",
  incomplete_expired: "bg-red-100 text-red-700",
  paused: "bg-slate-100 text-slate-600",
};

export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function getSubscriptionStatusStyle(status: SubscriptionStatus): string {
  return STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
}

export function formatBillingDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatUsageLabel(used: number, limit: number | null, unlimited: boolean): string {
  if (unlimited || limit === null) {
    return `${used} used`;
  }
  return `${used} / ${limit}`;
}

export function getUsagePercent(used: number, limit: number | null, unlimited: boolean): number {
  if (unlimited || limit === null || limit <= 0) {
    return 0;
  }
  return Math.min(Math.round((used / limit) * 100), 100);
}
