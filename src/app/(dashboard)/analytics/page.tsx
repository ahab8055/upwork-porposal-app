"use client";

import { BarChart3, TrendingUp, PieChart, LineChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8" data-testid="analytics-page">
      <div className="max-w-2xl mx-auto text-center py-16">
        {/* Icon Grid */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
            <PieChart className="w-8 h-8 text-violet-600" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <LineChart className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl font-bold text-slate-900 mb-4">
          Analytics Coming Soon
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Get deep insights into your proposal performance, win rates, and trends over time.
        </p>

        {/* Feature Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-left">
          <h2 className="font-semibold text-slate-900 mb-4">What to expect:</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Win Rate Trends</p>
                <p className="text-sm text-slate-500">Track how your success rate changes over time</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-emerald-600 text-sm font-medium">2</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Platform Performance</p>
                <p className="text-sm text-slate-500">Compare success across different freelance platforms</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-violet-600 text-sm font-medium">3</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Response Time Analysis</p>
                <p className="text-sm text-slate-500">Optimize your proposal timing for better results</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-600 text-sm font-medium">4</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Revenue Insights</p>
                <p className="text-sm text-slate-500">Track earnings and project values from won proposals</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Status Badge */}
        <div className="mt-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            In Development
          </span>
        </div>
      </div>
    </div>
  );
}
