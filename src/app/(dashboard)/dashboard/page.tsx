"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  getProposalStatusColor,
  getProposalStatusLabel,
} from "@/types/dashboard";
import { useDashboardOverview } from "@/hooks/useDashboard";

function formatProposalPreview(preview: string, proposalId: string): string {
  const trimmed = preview.trim();
  if (trimmed) {
    return trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed;
  }
  return proposalId;
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-slate-100 mb-4" />
      <div className="h-8 w-16 bg-slate-100 rounded mb-2" />
      <div className="h-4 w-28 bg-slate-100 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardOverview(5);
  const stats = data?.stats;
  const recentProposals = data?.recent_proposals ?? [];

  const statCards = stats
    ? [
        {
          title: "Proposals This Week",
          value: stats.proposals_this_week,
          subtitle: `${stats.total_proposals} total`,
          icon: <FileText className="w-6 h-6 text-blue-600" />,
          bgColor: "bg-blue-50",
        },
        {
          title: "Win Rate",
          value:
            stats.sent_count > 0 ? `${stats.win_rate}%` : "—",
          subtitle:
            stats.sent_count > 0
              ? `${stats.hired_count} hired of ${stats.sent_count} sent`
              : "Track outcomes in proposal feedback",
          icon: <Target className="w-6 h-6 text-blue-600" />,
          bgColor: "bg-blue-50",
        },
        {
          title: "Job Analyses",
          value: stats.job_analyses,
          subtitle: `${stats.job_analyses_this_week} this week`,
          icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
          bgColor: "bg-blue-50",
        },
        {
          title: "Ready Proposals",
          value: stats.completed_proposals,
          subtitle:
            stats.average_fit_score != null
              ? `Avg fit score ${Math.round(stats.average_fit_score)}%`
              : `${stats.in_progress_proposals} in progress`,
          icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
          bgColor: "bg-blue-50",
        },
      ]
    : [];

  return (
    <div className="p-4 sm:p-8" data-testid="dashboard-page">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-1">
            Welcome back!
          </h1>
          <p className="text-slate-600">
            Here&apos;s what&apos;s happening in your workspace.
          </p>
        </div>

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Unable to load dashboard stats. Please refresh the page.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? [1, 2, 3, 4].map((item) => <StatCardSkeleton key={item} />)
            : statCards.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl border border-slate-200 p-6"
                  data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 font-heading mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 mb-1">{stat.title}</div>
                  <div className="text-sm text-slate-500">{stat.subtitle}</div>
                </div>
              ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold text-slate-900">
                Recent Proposals
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/proposals">View all</Link>
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  data-testid="new-proposal-btn"
                >
                  <Link href="/analytics">
                    <Sparkles className="w-4 h-4 mr-2" />
                    New Proposal
                  </Link>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-16 bg-slate-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : recentProposals.length > 0 ? (
              <div className="space-y-3">
                {recentProposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.proposal_id}/edit`}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                    data-testid={`proposal-item-${proposal.proposal_id}`}
                  >
                    <div className="min-w-0 pr-4">
                      <p className="font-medium text-slate-900 mb-1 truncate">
                        {formatProposalPreview(
                          proposal.content_preview,
                          proposal.proposal_id
                        )}
                      </p>
                      <p className="text-sm text-slate-500">
                        v{proposal.version_number} ·{" "}
                        {new Date(proposal.created_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-md text-sm font-medium shrink-0 ${getProposalStatusColor(
                        proposal.processing_status
                      )}`}
                    >
                      {getProposalStatusLabel(proposal.processing_status)}
                    </span>
                  </Link>
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
                  Analyze a job and generate your first proposal
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                  data-testid="create-first-proposal-btn"
                >
                  <Link href="/analytics">
                    <Plus className="w-4 h-4 mr-2" />
                    Go to Analytics
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-auto py-4"
              asChild
              data-testid="quick-action-new-proposal"
            >
              <Link href="/analytics">
                <div className="text-left w-full">
                  <div className="font-semibold mb-1">Analyze a Job</div>
                  <div className="text-sm text-blue-100">
                    Score fit and generate a proposal
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-auto py-4" asChild>
              <Link href="/proposals">
                <div className="text-left w-full">
                  <div className="font-semibold mb-1 text-slate-900">
                    Proposal History
                  </div>
                  <div className="text-sm text-slate-500">
                    Reuse and compare past drafts
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-auto py-4" asChild>
              <Link href="/knowledge-base">
                <div className="text-left w-full">
                  <div className="font-semibold mb-1 text-slate-900">
                    Knowledge Base
                  </div>
                  <div className="text-sm text-slate-500">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <>
                        {stats?.total_documents ?? 0} docs ·{" "}
                        {stats?.total_projects ?? 0} projects ·{" "}
                        {stats?.total_resumes ?? 0} resumes
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
