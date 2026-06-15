"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { PricingPageContent } from "@/components/billing/PricingPageContent";
import { Button } from "@/components/ui/button";

function PricingPageInner() {
  return (
    <div className="min-h-screen bg-slate-50" data-testid="pricing-page">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading text-xl font-semibold text-slate-900">
              ProposalIQ
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-16 md:py-24">
        <PricingPageContent variant="public" />
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </footer>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <PricingPageInner />
    </Suspense>
  );
}
