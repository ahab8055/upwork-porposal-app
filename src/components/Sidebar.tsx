"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useAuth";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import {
  LayoutDashboard,
  FolderOpen,
  History,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen = true, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/knowledge-base", label: "Knowledge Base", icon: <FolderOpen className="w-5 h-5" /> },
    { path: "/proposals", label: "Proposals", icon: <History className="w-5 h-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const bottomNavItems = [
    { path: "/subscription", label: "Subscription", icon: <CreditCard className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isActive = (path: string) => pathname === path;

  const handleNavClick = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 pb-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-lg font-semibold text-slate-900">
              ProposalIQ
            </span>
          </Link>
        </div>

        {/* Workspace Switcher */}
        <div className="px-3 pb-3">
          <WorkspaceSwitcher />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              onClick={handleNavClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-200">
          {/* Bottom Navigation */}
          <nav className="px-3 py-2 space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                onClick={handleNavClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="px-3 pb-4 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              data-testid="sidebar-logout-btn"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
