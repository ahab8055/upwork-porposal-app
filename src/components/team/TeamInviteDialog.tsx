"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeamInviteForm } from "@/components/team/TeamInviteForm";
import { useInviteMember } from "@/hooks/useTeam";
import { validateTeamInvite } from "@/lib/validations/team";
import { toast } from "sonner";
import type { InviteResponseItem } from "@/types/team";

interface TeamInviteDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function TeamInviteDialog({
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: TeamInviteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sentInvite, setSentInvite] = useState<InviteResponseItem | null>(null);

  const inviteMemberMutation = useInviteMember();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep("form");
      setName("");
      setEmail("");
      setSentInvite(null);
    }
    if (isControlled) {
      onOpenChange?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTeamInvite(name, email);
    if (!validation.success) {
      toast.error(validation.error);
      return;
    }

    inviteMemberMutation.mutate(
      {
        members: [
          {
            name: validation.data.name,
            email: validation.data.email,
          },
        ],
      },
      {
        onSuccess: (data) => {
          if (!data.invites.length) {
            toast.error(
              "This member is already in the workspace or has a pending invite"
            );
            return;
          }

          setSentInvite(data.invites[0]);
          setStep("success");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="invite-member-btn"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </DialogTrigger>
      )}
      <DialogContent data-testid="invite-member-dialog">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <TeamInviteForm
                name={name}
                email={email}
                onNameChange={setName}
                onEmailChange={setEmail}
                disabled={inviteMemberMutation.isPending}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inviteMemberMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="send-invite-btn"
                >
                  {inviteMemberMutation.isPending ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div data-testid="invite-success-state">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                Invitation sent!
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <p className="text-slate-600">
                <span className="font-medium text-slate-900">{name}</span> (
                {sentInvite?.email}) will receive an email invitation to join{" "}
                <span className="font-medium text-slate-900">
                  {sentInvite?.workspace_name}
                </span>
                .
              </p>
              <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-800">
                They can accept the invite from their inbox and start
                collaborating on proposals in your workspace.
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="invite-success-done-btn"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
