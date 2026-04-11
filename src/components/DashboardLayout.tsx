"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useCurrentUser } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { Menu, Zap } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentWorkspaceId = useAuthStore((state) => state.currentWorkspaceId);
  const setUser = useAuthStore((state) => state.setUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch fresh user data from /api/v1/auth/me to check onboarding status
  const { data: meData, isSuccess, isError, error } = useCurrentUser();

  useEffect(() => {
    if (isSuccess && meData) {
      // Update store with fresh user data
      setUser(meData);

      const hasWorkspace =
        Boolean(meData.default_workspace_id) ||
        Boolean(meData.workspaces?.length);

      if (!meData.onboarding_completed || !hasWorkspace) {
        router.push("/onboarding");
      }
    }
  }, [isSuccess, meData, currentWorkspaceId, setUser, router]);

  // If not authenticated and /auth/me fails with 401, redirect to login
  useEffect(() => {
    if (isError && (error as { response?: { status?: number } })?.response?.status === 401) {
      useAuthStore.getState().logout();
      router.push("/login");
    }
  }, [isError, error, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100"
              data-testid="mobile-menu-btn"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-lg font-semibold text-slate-900">
                ProposalIQ
              </span>
            </Link>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
