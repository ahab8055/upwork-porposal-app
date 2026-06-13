"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspace, useUpdateWorkspace, useApiKeys, useUpdateApiKeys } from "@/hooks/useSettings";
import { useLogout } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { WorkspaceExperienceForm } from "@/components/workspace/WorkspaceExperienceForm";
import {
  User,
  Building,
  Save,
  Loader2,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";

export default function SettingsPage() {
  const logoutMutation = useLogout();
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceNameEdited, setWorkspaceNameEdited] = useState(false);
  const [workspaceDescriptionEdited, setWorkspaceDescriptionEdited] = useState(false);
  
  // API Keys state
  const { data: apiKeys, isLoading: apiKeysLoading } = useApiKeys();
  const updateApiKeysMutation = useUpdateApiKeys();
  const [claudeApiKey, setClaudeApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [preferredModel, setPreferredModel] = useState<"claude" | "openai">("claude");
  const [claudeApiKeyEdited, setClaudeApiKeyEdited] = useState(false);
  const [openaiApiKeyEdited, setOpenaiApiKeyEdited] = useState(false);
  const [preferredModelEdited, setPreferredModelEdited] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  const displayedWorkspaceName = workspaceNameEdited ? workspaceName : workspace?.name || "";
  const displayedWorkspaceDescription = workspaceDescriptionEdited
    ? workspaceDescription
    : workspace?.description || "";
  const isWorkspaceNameChanged =
    workspaceNameEdited && displayedWorkspaceName.trim() !== (workspace?.name || "").trim();
  const isWorkspaceDescriptionChanged =
    workspaceDescriptionEdited &&
    displayedWorkspaceDescription.trim() !== (workspace?.description || "").trim();
  const isWorkspaceDetailsDirty = isWorkspaceNameChanged || isWorkspaceDescriptionChanged;

  const displayedPreferredModel = preferredModelEdited
    ? preferredModel
    : apiKeys?.preferred_model || "claude";
  const displayedClaudeApiKey = claudeApiKeyEdited
    ? claudeApiKey
    : apiKeys?.claude_api_key || "";
  const displayedOpenaiApiKey = openaiApiKeyEdited
    ? openaiApiKey
    : apiKeys?.openai_api_key || "";

  const handleSaveWorkspaceDetails = () => {
    updateWorkspaceMutation.mutate(
      {
        name: displayedWorkspaceName.trim(),
        description: displayedWorkspaceDescription.trim(),
      },
      {
        onSuccess: (updatedWorkspace) => {
          setWorkspaceName(updatedWorkspace.name || "");
          setWorkspaceDescription(updatedWorkspace.description || "");
          setWorkspaceNameEdited(false);
          setWorkspaceDescriptionEdited(false);
        },
      }
    );
  };

  const handleSaveApiKeys = () => {
    const payload: {
      preferred_model: "claude" | "openai";
      claude_api_key?: string;
      openai_api_key?: string;
    } = {
      preferred_model: displayedPreferredModel
    };
    
    // Only update claude key if it's not the masked version
    if (claudeApiKeyEdited && displayedClaudeApiKey && !displayedClaudeApiKey.startsWith("•")) {
      payload.claude_api_key = displayedClaudeApiKey;
    }
    
    // Only update openai key if it's not the masked version
    if (openaiApiKeyEdited && displayedOpenaiApiKey && !displayedOpenaiApiKey.startsWith("•")) {
      payload.openai_api_key = displayedOpenaiApiKey;
    }

    updateApiKeysMutation.mutate(payload, {
      onSuccess: () => {
        setPreferredModelEdited(false);
        setClaudeApiKeyEdited(false);
        setOpenaiApiKeyEdited(false);
      },
    });
  };

  return (
    <div className="p-8 max-w-4xl" data-testid="settings-page">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account and workspace settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="workspace" data-testid="tab-workspace">
              <Building className="w-4 h-4 mr-2" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="api-keys" data-testid="tab-api-keys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-6">Profile Information</h3>
              <ProfileForm />
            </div>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-6">Workspace Details</h3>

              {workspaceLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Workspace Name</Label>
                    <Input
                      value={displayedWorkspaceName}
                      onChange={(e) => {
                        setWorkspaceName(e.target.value);
                        setWorkspaceNameEdited(true);
                      }}
                      placeholder="My Agency"
                      className="mt-1.5"
                      data-testid="workspace-name-input"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={displayedWorkspaceDescription}
                      onChange={(e) => {
                        setWorkspaceDescription(e.target.value);
                        setWorkspaceDescriptionEdited(true);
                      }}
                      placeholder="A brief description of your workspace"
                      className="mt-1.5"
                      data-testid="workspace-description-input"
                    />
                  </div>
                  <div>
                    <Label>Workspace ID</Label>
                    <Input
                      value={workspace?.workspace_id || ""}
                      disabled
                      className="mt-1.5 bg-slate-50 font-mono text-sm"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={handleSaveWorkspaceDetails}
                      disabled={updateWorkspaceMutation.isPending || !isWorkspaceDetailsDirty}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="save-workspace-btn"
                    >
                      {updateWorkspaceMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Details
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-6">
                Skills & Company Info
              </h3>
              <WorkspaceExperienceForm />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-heading text-lg font-semibold text-slate-900 mb-4">Usage & Limits</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">Free</p>
                  <p className="text-sm text-slate-500">Current Plan</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">5</p>
                  <p className="text-sm text-slate-500">Proposals/Month</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-900">10</p>
                  <p className="text-sm text-slate-500">Document Uploads</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Button variant="outline">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900">AI Model Configuration</h3>
                  <p className="text-sm text-slate-500">Add your own API keys for better AI responses</p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Optional:</strong> By default, ProposalIQ uses our built-in AI service. 
                  Add your own API keys to use your preferred AI model with your own rate limits.
                </p>
              </div>

              {apiKeysLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Preferred Model Selection */}
                  <div>
                    <Label>Preferred AI Model</Label>
                    <Select value={displayedPreferredModel} onValueChange={(value: "claude" | "openai") => {
                      setPreferredModel(value);
                      setPreferredModelEdited(true);
                    }}>
                      <SelectTrigger className="mt-1.5 w-64" data-testid="preferred-model-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Claude (Anthropic)
                          </div>
                        </SelectItem>
                        <SelectItem value="openai">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            GPT-4o (OpenAI)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-sm text-slate-500">
                      Select which model to use for proposal generation
                    </p>
                  </div>

                  {/* Claude API Key */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        <Label className="text-base font-medium">Claude API Key</Label>
                      </div>
                      {apiKeys?.has_claude_key && (
                        <span className="flex items-center gap-1 text-emerald-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Configured
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type={showClaudeKey ? "text" : "password"}
                        value={displayedClaudeApiKey}
                        onChange={(e) => {
                          setClaudeApiKey(e.target.value);
                          setClaudeApiKeyEdited(true);
                        }}
                        placeholder="sk-ant-api03-..."
                        className="pr-10 font-mono text-sm"
                        data-testid="claude-api-key-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowClaudeKey(!showClaudeKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Get your API key from{" "}
                      <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        console.anthropic.com
                      </a>
                    </p>
                  </div>

                  {/* OpenAI API Key */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <Label className="text-base font-medium">OpenAI API Key</Label>
                      </div>
                      {apiKeys?.has_openai_key && (
                        <span className="flex items-center gap-1 text-emerald-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Configured
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type={showOpenaiKey ? "text" : "password"}
                        value={displayedOpenaiApiKey}
                        onChange={(e) => {
                          setOpenaiApiKey(e.target.value);
                          setOpenaiApiKeyEdited(true);
                        }}
                        placeholder="sk-proj-..."
                        className="pr-10 font-mono text-sm"
                        data-testid="openai-api-key-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Get your API key from{" "}
                      <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        platform.openai.com
                      </a>
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      onClick={handleSaveApiKeys}
                      disabled={updateApiKeysMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="save-api-keys-btn"
                    >
                      {updateApiKeysMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save API Keys
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Security Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Your API keys are encrypted and stored securely. They are only used to make API calls on your behalf 
                    and are never shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
