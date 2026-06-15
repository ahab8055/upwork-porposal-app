"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  FileText,
  Lock,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { getExpiredReasonLabel } from "@/lib/subscription-access";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const RESTRICTED_FEATURES = [
  {
    icon: FileText,
    label: "AI proposal generation",
  },
  {
    icon: BarChart3,
    label: "Job analysis and analytics",
  },
  {
    icon: Upload,
    label: "Knowledge base uploads",
  },
];

interface SubscriptionExpiredExperienceProps {
  className?: string;
  showReturnLink?: boolean;
  blockedPath?: string | null;
}

export function SubscriptionExpiredExperience({
  className,
  showReturnLink = true,
  blockedPath,
}: SubscriptionExpiredExperienceProps) {
  const searchParams = useSearchParams();
  const fromPath = blockedPath ?? searchParams.get("from");
  const { trial } = useSubscriptionAccess();
  const isOwner = useAuthStore((state) => state.getCurrentWorkspace())?.role === "owner";

  const reason = trial ? getExpiredReasonLabel(trial) : "Your subscription has expired";

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center",
        className
      )}
      data-testid="subscription-expired-page"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
        <Lock className="h-8 w-8 text-red-600" />
      </div>

      <h1 className="font-heading text-3xl font-bold text-slate-900">
        {reason}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
        {isOwner
          ? "Upgrade your workspace to restore premium features and continue generating proposals with AI."
          : "Premium features are unavailable for this workspace. Ask your workspace owner to renew or upgrade the subscription."}
      </p>

      <div className="mt-8 w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 text-left">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Restricted until you upgrade
        </div>
        <ul className="space-y-2">
          {RESTRICTED_FEATURES.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <Icon className="h-4 w-4 text-slate-400" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        {isOwner ? (
          <>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="expired-upgrade-btn"
            >
              <Link href="/subscription?tab=plans&plan=pro">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="expired-view-plans-btn"
            >
              <Link href="/subscription?tab=plans">View all plans</Link>
            </Button>
          </>
        ) : (
          <Button asChild size="lg" variant="outline" data-testid="expired-view-subscription-btn">
            <Link href="/subscription">View subscription</Link>
          </Button>
        )}
      </div>

      {isOwner && (
        <Button
          asChild
          variant="link"
          className="mt-4 text-slate-600"
          data-testid="expired-manage-billing-link"
        >
          <Link href="/subscription">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage billing and invoices
          </Link>
        </Button>
      )}

      {showReturnLink && fromPath && fromPath !== "/subscription/expired" && (
        <p className="mt-6 text-sm text-slate-500">
          You were redirected from{" "}
          <span className="font-medium text-slate-700">{fromPath}</span>
        </p>
      )}
    </div>
  );
}
