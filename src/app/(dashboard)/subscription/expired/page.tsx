"use client";

import { Suspense } from "react";
import { SubscriptionExpiredExperience } from "@/components/billing/SubscriptionExpiredExperience";

function SubscriptionExpiredPageInner() {
  return (
    <div className="p-6 md:p-8" data-testid="subscription-expired-route">
      <SubscriptionExpiredExperience showReturnLink />
    </div>
  );
}

export default function SubscriptionExpiredPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] p-8" />}>
      <SubscriptionExpiredPageInner />
    </Suspense>
  );
}
