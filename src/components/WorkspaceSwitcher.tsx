"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore, Workspace } from "@/store/auth-store";
import { apiClient } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  Crown,
  Shield,
  User,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleIcons: Record<string, React.ReactNode> = {
  owner: <Crown className="w-3.5 h-3.5 text-amber-500" />,
  admin: <Shield className="w-3.5 h-3.5 text-blue-500" />,
  member: <User className="w-3.5 h-3.5 text-slate-500" />,
  viewer: <Eye className="w-3.5 h-3.5 text-slate-400" />,
};

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (workspace: Workspace) => void;
}

function CreateWorkspaceModal({ isOpen, onClose, onCreated }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post("/workspace/create", { name: name.trim() });
      const newWorkspace: Workspace = {
        id: response.data.workspace_id,
        name: name.trim(),
        role: "owner",
      };
      onCreated(newWorkspace);
      setName("");
      onClose();
      toast.success("Workspace created successfully");
    } catch (error) {
      toast.error("Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Agency"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    workspaces,
    currentWorkspaceId,
    switchWorkspace,
    setWorkspaces,
    getCurrentWorkspace,
  } = useAuthStore();

  const currentWorkspace = getCurrentWorkspace();

  const switchMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      await apiClient.post("/workspace/switch", { workspace_id: workspaceId });
      return workspaceId;
    },
    onSuccess: (workspaceId) => {
      switchWorkspace(workspaceId);
      queryClient.invalidateQueries();
      toast.success("Workspace switched");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to switch workspace");
    },
  });

  const handleWorkspaceCreated = (workspace: Workspace) => {
    setWorkspaces([...workspaces, workspace]);
    switchMutation.mutate(workspace.id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (workspaces.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
          data-testid="workspace-switcher"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            {currentWorkspace && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                {roleIcons[currentWorkspace.role]}
                <span>{roleLabels[currentWorkspace.role]}</span>
              </p>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
            <div className="px-3 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wide">
              Workspaces
            </div>

            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  if (workspace.id !== currentWorkspaceId) {
                    switchMutation.mutate(workspace.id);
                  } else {
                    setIsOpen(false);
                  }
                }}
                disabled={switchMutation.isPending}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {workspace.name}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {roleIcons[workspace.role]}
                    <span>{roleLabels[workspace.role]}</span>
                  </p>
                </div>
                {workspace.id === currentWorkspaceId && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}

            <div className="border-t border-slate-200 mt-1 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCreateModal(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left text-blue-600"
              >
                <div className="w-7 h-7 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium">Create New Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleWorkspaceCreated}
      />
    </>
  );
}
