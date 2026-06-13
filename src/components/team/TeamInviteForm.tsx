"use client";

import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamInviteFormProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  disabled?: boolean;
}

export function TeamInviteForm({
  name,
  email,
  onNameChange,
  onEmailChange,
  disabled = false,
}: TeamInviteFormProps) {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          Team members will receive an email invitation to join your workspace.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="invite-name">Full Name</Label>
          <Input
            id="invite-name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-1.5 h-11"
            disabled={disabled}
            data-testid="invite-name-input"
          />
        </div>
        <div>
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            type="email"
            placeholder="email@company.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="mt-1.5 h-11"
            disabled={disabled}
            data-testid="invite-email-input"
          />
        </div>
      </div>
    </div>
  );
}
