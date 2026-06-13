"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  useTeamMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/useTeam";
import { TeamMemberList } from "@/components/team/TeamMemberList";
import { TeamInviteDialog } from "@/components/team/TeamInviteDialog";
import { Crown, Shield, Eye } from "lucide-react";
import type { WorkspaceRole } from "@/types/team";

export default function TeamPage() {
  const getCurrentWorkspace = useAuthStore((state) => state.getCurrentWorkspace);
  const currentWorkspace = getCurrentWorkspace();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { data: members = [], isLoading: loading, isError } = useTeamMembers();
  const removeMemberMutation = useRemoveMember();
  const updateRoleMutation = useUpdateMemberRole();
  const canManageMembers =
    currentWorkspace?.role === "admin" || currentWorkspace?.role === "owner";

  const handleRemoveMember = async (memberId: string) => {
    removeMemberMutation.mutate(memberId);
  };

  const handleUpdateRole = (memberId: string, role: WorkspaceRole) => {
    updateRoleMutation.mutate({ memberId, role });
  };

  return (
    <div className="p-8" data-testid="team-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-600 mt-1">Manage your workspace members</p>
        </div>
        {canManageMembers && (
          <TeamInviteDialog
            open={inviteModalOpen}
            onOpenChange={setInviteModalOpen}
          />
        )}
      </div>

      <TeamMemberList
        members={members}
        isLoading={loading}
        isError={isError}
        canManageMembers={canManageMembers}
        updatingMemberId={
          updateRoleMutation.isPending
            ? updateRoleMutation.variables?.memberId ?? null
            : null
        }
        removingMemberId={
          removeMemberMutation.isPending
            ? removeMemberMutation.variables ?? null
            : null
        }
        onInvite={canManageMembers ? () => setInviteModalOpen(true) : undefined}
        onRemoveMember={handleRemoveMember}
        onUpdateRole={canManageMembers ? handleUpdateRole : undefined}
      />

      {!loading && !isError && members.length > 0 && (
        <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <Crown className="w-6 h-6 text-amber-500" />,
            title: "Admin",
            description:
              "Full access to all features including team management, billing, and workspace settings.",
          },
          {
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            title: "Business Developer",
            description:
              "Can create proposals, manage knowledge base, and track proposal outcomes.",
          },
          {
            icon: <Eye className="w-6 h-6 text-slate-400" />,
            title: "Viewer",
            description:
              "Can view proposals and knowledge base but cannot make changes.",
          },
        ].map((role, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
              {role.icon}
            </div>
            <h3 className="font-heading font-semibold text-slate-900 mb-2">
              {role.title}
            </h3>
            <p className="text-sm text-slate-600">{role.description}</p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
