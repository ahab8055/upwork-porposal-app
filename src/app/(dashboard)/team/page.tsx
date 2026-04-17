"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth-store";
import { useTeamMembers, useInviteMember, useRemoveMember } from "@/hooks/useTeam";
import {
  Crown,
  Shield,
  Eye,
  Trash2,
  UserPlus,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import type { WorkspaceRole, InviteDetails } from "@/types/team";

export default function TeamPage() {
  const user = useAuthStore((state) => state.user);
  const getCurrentWorkspace = useAuthStore((state) => state.getCurrentWorkspace);
  const currentWorkspace = getCurrentWorkspace();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteLinkModalOpen, setInviteLinkModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>("member");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: members = [], isLoading: loading } = useTeamMembers();
  const inviteMemberMutation = useInviteMember();
  const removeMemberMutation = useRemoveMember();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    inviteMemberMutation.mutate({
        members: [{ name: '', email: inviteEmail, role: inviteRole }]
      },
      {
        onSuccess: (data) => {
          // Generate the invite link
          const link = `${window.location.origin}/signup?invite=${data.invite_code}`;
          setInviteLink(link);
          setInviteDetails({
            email: data.invite_email,
            workspace_name: data.workspace_name,
            invited_by: user?.name || "Team Admin",
            role: inviteRole,
          });
          setInviteModalOpen(false);
          setInviteLinkModalOpen(true);
          setInviteEmail("");
          setInviteRole("member");
        },
      }
    );
  };

  const handleRemoveMember = async (memberId: string) => {
    removeMemberMutation.mutate(memberId);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = (role: WorkspaceRole) => {
    const icons = {
      owner: <Crown className="w-4 h-4 text-purple-500" />,
      admin: <Crown className="w-4 h-4 text-amber-500" />,
      member: <Shield className="w-4 h-4 text-blue-500" />,
      viewer: <Eye className="w-4 h-4 text-slate-400" />,
    };
    return icons[role] || icons.viewer;
  };

  const getRoleBadge = (role: WorkspaceRole) => {
    const badges = {
      owner: "bg-purple-100 text-purple-700",
      admin: "bg-amber-100 text-amber-700",
      member: "bg-blue-100 text-blue-700",
      viewer: "bg-slate-100 text-slate-600",
    };
    return badges[role] || badges.viewer;
  };

  const getRoleLabel = (role: WorkspaceRole) => {
    const labels = {
      owner: "Owner",
      admin: "Admin",
      member: "Member",
      viewer: "Viewer",
    };
    return labels[role] || role;
  };

  return (
    <div className="p-8" data-testid="team-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-600 mt-1">Manage your workspace members</p>
        </div>
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="invite-member-btn"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 mt-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="mt-1.5"
                  data-testid="invite-email-input"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as WorkspaceRole)}>
                  <SelectTrigger
                    className="mt-1.5"
                    data-testid="invite-role-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500" />
                        Admin - Full access
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        Member - Create proposals
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        Viewer - View only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inviteMemberMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="send-invite-btn"
                >
                  {inviteMemberMutation.isPending ? "Creating..." : "Create Invite"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Invite Link Modal */}
        <Dialog open={inviteLinkModalOpen} onOpenChange={setInviteLinkModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                Invite Created!
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <p className="text-slate-600">
                Share this link with{" "}
                <span className="font-medium text-slate-900">
                  {inviteDetails?.email}
                </span>{" "}
                to invite them to{" "}
                <span className="font-medium text-slate-900">
                  {inviteDetails?.workspace_name}
                </span>
                .
              </p>

              <div className="bg-slate-50 rounded-lg p-4">
                <Label className="text-xs text-slate-500 mb-2 block">
                  Invite Link
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="font-mono text-sm bg-white"
                    data-testid="invite-link-input"
                  />
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="shrink-0"
                    data-testid="copy-invite-link-btn"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <p className="text-blue-800">
                  <strong>Instructions for {inviteDetails?.email}:</strong>
                </p>
                <ol className="list-decimal list-inside mt-2 text-blue-700 space-y-1">
                  <li>Click the invite link above</li>
                  <li>
                    Create an account with email:{" "}
                    <strong>{inviteDetails?.email}</strong>
                  </li>
                  <li>
                    They&apos;ll automatically join your workspace as{" "}
                    {inviteDetails?.role && getRoleLabel(inviteDetails.role)}
                  </li>
                </ol>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setInviteLinkModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={copyInviteLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
            <div className="col-span-5">Member</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {members.map((member) => (
            <div
              key={member.member_id}
              className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              data-testid={`team-member-${member.member_id}`}
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                  {member.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    {member.name}
                    {member.is_owner && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                        Owner
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="col-span-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                    member.role
                  )}`}
                >
                  {getRoleIcon(member.role)}
                  {getRoleLabel(member.role)}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    member.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <div className="col-span-2 text-right">
                {!member.is_owner && (currentWorkspace?.role === "admin" || currentWorkspace?.role === "owner") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.member_id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    data-testid={`remove-member-${member.member_id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Descriptions */}
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
    </div>
  );
}
