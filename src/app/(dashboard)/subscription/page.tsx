"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckoutStatusBanner } from "@/components/billing/CheckoutStatusBanner";
import { PricingPageContent } from "@/components/billing/PricingPageContent";
import { SubscriptionManagement } from "@/components/billing/SubscriptionManagement";
import { useCheckoutReturn } from "@/hooks/useCheckoutReturn";
import { useBillingPortalReturnRefresh } from "@/hooks/useBillingPortalReturnRefresh";

function SubscriptionPageInner() {
  const searchParams = useSearchParams();
  const plansRef = useRef<HTMLDivElement>(null);
  const { checkoutStatus, dismissBanner } = useCheckoutReturn();
  useBillingPortalReturnRefresh();

  const initialTab = searchParams.get("tab") === "plans" ? "plans" : "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams.get("tab") === "plans") {
      setActiveTab("plans");
    }
  }, [searchParams]);

  const scrollToPlans = () => {
    setActiveTab("plans");
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="p-6 md:p-8" data-testid="subscription-page">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Subscription
          </h1>
          <p className="mt-2 text-slate-600">
            View your plan, monitor usage, and manage billing for this workspace.
          </p>
          {checkoutStatus && (
            <CheckoutStatusBanner
              status={checkoutStatus}
              onDismiss={dismissBanner}
              className="mt-4"
            />
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="overview" data-testid="subscription-tab-overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="plans" data-testid="subscription-tab-plans">
              Plans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SubscriptionManagement onViewPlans={scrollToPlans} />
          </TabsContent>

          <TabsContent value="plans">
            <div ref={plansRef} className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold text-slate-900">
                  Available plans
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Compare tiers and upgrade your workspace subscription.
                </p>
              </div>
              <PricingPageContent
                variant="dashboard"
                className="pt-2"
                showCheckoutBanner={false}
                showPageHeader={false}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="p-8" data-testid="subscription-page" />}>
      <SubscriptionPageInner />
    </Suspense>
  );
}
