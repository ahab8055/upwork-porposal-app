"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardStats, useRecentProposals } from "@/hooks/useDashboard";
import {
  FileText,
  FolderOpen,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentProposals, isLoading: proposalsLoading } =
    useRecentProposals(5);

  const statCards = [
    {
      title: "Total Proposals",
      value: stats?.total_proposals || 0,
      icon: <FileText className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Win Rate",
      value: `${stats?.win_rate || 0}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "emerald",
    },
    {
      title: "Projects",
      value: stats?.total_projects || 0,
      icon: <FolderOpen className="w-5 h-5" />,
      color: "violet",
    },
    {
      title: "Team Members",
      value: stats?.total_resumes || 0,
      icon: <Users className="w-5 h-5" />,
      color: "amber",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-slate-100 text-slate-700",
      sent: "bg-blue-100 text-blue-700",
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-slate-600 mt-1">
            Here&apos;s what&apos;s happening with your proposals
          </p>
        </div>
        <Link href="/new-proposal">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="new-proposal-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`stat-card-${stat.title.toLowerCase().replace(" ", "-")}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}
              >
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 font-heading">
              {stat.value}
            </p>
            <p className="text-sm text-slate-600 mt-1">{stat.title}</p>
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
            <Link
              href="/proposals"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
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
                <Link
                  key={proposal.proposal_id}
                  href="/proposals"
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  data-testid={`proposal-item-${proposal.proposal_id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {proposal.title}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(proposal.created_at).toLocaleDateString()}
                        {proposal.platform && (
                          <>
                            <span className="text-slate-300">•</span>
                            {proposal.platform}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      proposal.status,
                    )}`}
                  >
                    {proposal.status.replace("_", " ")}
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
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-heading text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/new-proposal"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                data-testid="quick-action-new-proposal"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">New Proposal</p>
                  <p className="text-sm text-slate-500">
                    Analyze a job & generate
                  </p>
                </div>
              </Link>
              <Link
                href="/knowledge-base"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                data-testid="quick-action-add-project"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Add Project</p>
                  <p className="text-sm text-slate-500">
                    Expand your knowledge base
                  </p>
                </div>
              </Link>
              <Link
                href="/team"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                data-testid="quick-action-invite-team"
              >
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Invite Team</p>
                  <p className="text-sm text-slate-500">Add team members</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">Pro Tip</h3>
            <p className="text-blue-100 text-sm">
              Add more projects to your knowledge base to improve match accuracy
              and generate better proposals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
