"use client";

import { CreditCard, Zap, Crown, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="p-8" data-testid="subscription-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-4">
            Subscription Plans Coming Soon
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Unlock premium features to supercharge your proposal workflow and win more clients.
          </p>
        </div>

        {/* Plans Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Free</h3>
                <p className="text-sm text-slate-500">For getting started</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                5 proposals per month
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Basic job analysis
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                1 knowledge base file
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl border-2 border-blue-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                Most Popular
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Pro</h3>
                <p className="text-sm text-slate-500">For professionals</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-slate-900">$19</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Unlimited proposals
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Advanced AI analysis
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                10 knowledge base files
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Priority support
              </li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
              Coming Soon
            </Button>
          </div>

          {/* Team Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Team</h3>
                <p className="text-sm text-slate-500">For agencies</p>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-slate-900">$49</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Everything in Pro
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Up to 10 team members
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Team analytics
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-emerald-500" />
                Custom branding
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Launching Soon
          </span>
        </div>
      </div>
    </div>
  );
}
