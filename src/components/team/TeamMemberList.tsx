"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Crown,
  Shield,
  Eye,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import type { TeamMember, WorkspaceRole } from "@/types/team";

const EDITABLE_ROLES: WorkspaceRole[] = ["admin", "member", "viewer"];

interface TeamMemberListProps {
  members: TeamMember[];
  isLoading: boolean;
  isError?: boolean;
  canManageMembers?: boolean;
  updatingMemberId?: string | null;
  removingMemberId?: string | null;
  onInvite?: () => void;
  onRemoveMember?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, role: WorkspaceRole) => void;
}

function getRoleIcon(role: WorkspaceRole) {
  const icons = {
    owner: <Crown className="w-4 h-4 text-purple-500" />,
    admin: <Crown className="w-4 h-4 text-amber-500" />,
    member: <Shield className="w-4 h-4 text-blue-500" />,
    viewer: <Eye className="w-4 h-4 text-slate-400" />,
  };
  return icons[role] || icons.viewer;
}

function getRoleBadge(role: WorkspaceRole) {
  const badges = {
    owner: "bg-purple-100 text-purple-700",
    admin: "bg-amber-100 text-amber-700",
    member: "bg-blue-100 text-blue-700",
    viewer: "bg-slate-100 text-slate-600",
  };
  return badges[role] || badges.viewer;
}

function getRoleLabel(role: WorkspaceRole) {
  const labels = {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
    viewer: "Viewer",
  };
  return labels[role] || role;
}

function RoleBadge({ role }: { role: WorkspaceRole }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(
        role
      )}`}
    >
      {getRoleIcon(role)}
      {getRoleLabel(role)}
    </span>
  );
}

export function TeamMemberList({
  members,
  isLoading,
  isError = false,
  canManageMembers = false,
  updatingMemberId = null,
  removingMemberId = null,
  onInvite,
  onRemoveMember,
  onUpdateRole,
}: TeamMemberListProps) {
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const handleConfirmRemove = () => {
    if (!memberToRemove || !onRemoveMember) return;
    onRemoveMember(memberToRemove.member_id);
    setMemberToRemove(null);
  };
  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="team-loading">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="text-center py-16 bg-white rounded-xl border border-slate-200"
        data-testid="team-error"
      >
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
          Unable to load team
        </h3>
        <p className="text-slate-500">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div
        className="text-center py-16 bg-white rounded-xl border border-slate-200"
        data-testid="team-empty"
      >
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">
          No team members yet
        </h3>
        <p className="text-slate-500 mb-6">
          Invite colleagues to collaborate on proposals in this workspace.
        </p>
        {onInvite && (
          <Button
            onClick={onInvite}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="team-empty-invite-btn"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
    <div
      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      data-testid="team-member-list"
    >
      <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
        <div className={canManageMembers ? "col-span-4" : "col-span-5"}>Name</div>
        <div className={canManageMembers ? "col-span-3" : "col-span-4"}>Email</div>
        <div className={canManageMembers ? "col-span-2" : "col-span-3"}>Role</div>
        {canManageMembers && <div className="col-span-3 text-right">Actions</div>}
      </div>
      {members.map((member) => (
        <div
          key={member.member_id}
          className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
          data-testid={`team-member-${member.member_id}`}
        >
          <div
            className={`${canManageMembers ? "col-span-4" : "col-span-5"} flex items-center gap-3`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {member.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p
                className="font-medium text-slate-900"
                data-testid={`team-member-name-${member.member_id}`}
              >
                {member.name}
              </p>
              {member.status === "pending" && (
                <p className="text-xs text-amber-600 mt-0.5">Pending invite</p>
              )}
            </div>
          </div>
          <div
            className={`${canManageMembers ? "col-span-3" : "col-span-4"} text-sm text-slate-600 truncate`}
            data-testid={`team-member-email-${member.member_id}`}
          >
            {member.email}
          </div>
          <div className={canManageMembers ? "col-span-2" : "col-span-3"}>
            {canManageMembers &&
            !member.is_owner &&
            member.role !== "owner" &&
            onUpdateRole ? (
              <Select
                value={member.role}
                onValueChange={(value) =>
                  onUpdateRole(member.member_id, value as WorkspaceRole)
                }
                disabled={updatingMemberId === member.member_id}
              >
                <SelectTrigger
                  className="h-9 w-full max-w-[140px]"
                  data-testid={`team-member-role-select-${member.member_id}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EDITABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      <span className="flex items-center gap-2">
                        {getRoleIcon(role)}
                        {getRoleLabel(role)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span data-testid={`team-member-role-${member.member_id}`}>
                <RoleBadge role={member.role} />
              </span>
            )}
          </div>
          {canManageMembers && (
            <div className="col-span-3 flex justify-end">
              {!member.is_owner && onRemoveMember && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMemberToRemove(member)}
                  disabled={removingMemberId === member.member_id}
                  className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                  data-testid={`remove-member-${member.member_id}`}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Remove
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>

    <AlertDialog
      open={!!memberToRemove}
      onOpenChange={(open) => !open && setMemberToRemove(null)}
    >
      <AlertDialogContent data-testid="remove-member-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove team member?</AlertDialogTitle>
          <AlertDialogDescription>
            {memberToRemove && (
              <>
                <span className="font-medium text-slate-900">
                  {memberToRemove.name}
                </span>{" "}
                ({memberToRemove.email}) will lose access to this workspace.
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="remove-member-cancel">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmRemove}
            disabled={removingMemberId === memberToRemove?.member_id}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            data-testid="remove-member-confirm"
          >
            {removingMemberId === memberToRemove?.member_id
              ? "Removing..."
              : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
