"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardStats, useRecentProposals } from "@/hooks/useDashboard";
import {
  FileText,
  Plus,
  Clock,
  Target,
  TrendingUp,
  Timer,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentProposals, isLoading: proposalsLoading } =
    useRecentProposals(5);

  const statCards = [
    {
      title: "Proposals This Week",
      value: stats?.total_proposals || 12,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      change: "+3 from last week",
      changeColor: "text-green-600",
    },
    {
      title: "Win Rate",
      value: `${stats?.win_rate || 14.2}%`,
      icon: <Target className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      change: "+2.1% improvement",
      changeColor: "text-green-600",
    },
    {
      title: "Avg. Time Saved",
      value: "35 min",
      subtitle: "per proposal",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      change: "",
      changeColor: "text-green-600",
    },
    {
      title: "Total Saved",
      value: "7.2 hrs",
      subtitle: "this week",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      change: "",
      changeColor: "text-green-600",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-slate-100 text-slate-700",
      sent: "bg-green-100 text-green-700",
      won: "bg-emerald-100 text-emerald-700",
      lost: "bg-red-100 text-red-700",
      no_response: "bg-amber-100 text-amber-700",
      interviewing: "bg-violet-100 text-violet-700",
    };
    return colors[status] || colors.draft;
  };

  const loading = statsLoading || proposalsLoading;
  return (
    <div className="p-8" data-testid="dashboard-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-slate-900 mb-1">
          Welcome back!
        </h1>
        <p className="text-slate-600">
          Here&apos;s what&apos;s happening with your proposals today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 p-6"
            data-testid={`stat-card-${stat.title.toLowerCase().replace(" ", "-")}`}
          >
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-slate-900 font-heading mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600 mb-2">
              {stat.title}
              {stat.subtitle && (
                <span className="block text-green-600">{stat.subtitle}</span>
              )}
            </div>
            {stat.change && (
              <div className={`text-sm font-medium ${stat.changeColor}`}>
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-lg font-semibold text-slate-900">
              Recent Proposals
            </h2>
            <Link href="/new-proposal">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="new-proposal-btn"
              >
                New Proposal
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : recentProposals && recentProposals.length > 0 ? (
            <div className="space-y-3">
              {recentProposals.map((proposal) => (
                <div
                  key={proposal.proposal_id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                  data-testid={`proposal-item-${proposal.proposal_id}`}
                >
                  <div>
                    <p className="font-medium text-slate-900 mb-1">
                      {proposal.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {proposal.platform || "Upwork"} • {new Date(proposal.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                      proposal.status,
                    )}`}
                  >
                    {proposal.status === 'sent' ? 'Sent' : proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-900 mb-2">
                No proposals yet
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Create your first proposal to get started
              </p>
              <Link href="/new-proposal">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="create-first-proposal-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 mb-6">
            Quick Actions
          </h2>
          <Link href="/new-proposal">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-auto py-4 mb-4"
              data-testid="quick-action-new-proposal"
            >
              <div className="text-left w-full">
                <div className="font-semibold mb-1">Create New Proposal</div>
                <div className="text-sm text-blue-100">Paste job posting</div>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
