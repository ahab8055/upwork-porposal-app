'use client';

import { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TeamMember } from '@/types/onboarding';

interface TeamInviteStepProps {
  teamMembers: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export function TeamInviteStep({ teamMembers, onChange }: TeamInviteStepProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddMember = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      alert('Please fill in both name and email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check for duplicate email
    if (teamMembers.some((member) => member.email === trimmedEmail)) {
      alert('This email is already added');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      fullName: trimmedName,
      email: trimmedEmail,
    };

    onChange([...teamMembers, newMember]);
    setFullName('');
    setEmail('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Invite your team</h2>
        <p className="mt-2 text-sm text-gray-600">
          Add team members who will use ProposalIQ. You can always add more later.
        </p>
      </div>

      <div className="space-y-6">
        {/* Info Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            Team members will receive an email invitation to join your workspace.
          </AlertDescription>
        </Alert>

        {/* Add Team Member Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Add Team Member</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-11 flex-1"
            />
            <Input
              type="email"
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-11 flex-1"
            />
            <Input
              placeholder="Role (optional)"
              className="h-11 flex-1 sm:max-w-52"
              disabled
            />
          </div>

          <Button
            onClick={handleAddMember}
            className="h-11 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Team Members List */}
        {teamMembers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Added Members ({teamMembers.length})
            </h3>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{member.fullName}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onChange(teamMembers.filter((m) => m.id !== member.id))
                    }
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
