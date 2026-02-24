"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  useAnalyzeJob,
  useGenerateProposal,
  useCreateProposal,
  useUpdateProposal,
} from "@/hooks/useProposals";
import {
  Send,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Sparkles,
  Loader2,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { JobAnalysis } from "@/types/proposal";

export default function NewProposalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [proposal, setProposal] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "formal">("professional");

  const analyzeJobMutation = useAnalyzeJob();
  const generateProposalMutation = useGenerateProposal();
  const createProposalMutation = useCreateProposal();
  const updateProposalMutation = useUpdateProposal();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    analyzeJobMutation.mutate(
      {
        job_description: jobDescription,
        platform: platform || null,
      },
      {
        onSuccess: (data) => {
          setAnalysis(data);
          setStep(2);
        },
      }
    );
  };

  const handleGenerate = async () => {
    if (!analysis) return;

    generateProposalMutation.mutate(
      {
        job_description: jobDescription,
        job_analysis: analysis,
        selected_projects: analysis.similar_projects?.map((p) => p.project_id) || [],
        tone,
        length: "medium",
      },
      {
        onSuccess: (data) => {
          setProposal(data.content);
          setStep(3);
        },
      }
    );
  };

  const handleSaveProposal = async () => {
    if (!analysis) return;

    // First create proposal
    createProposalMutation.mutate(
      {
        job_description: jobDescription,
        job_analysis: analysis,
        title: proposalTitle || "Untitled Proposal",
        platform,
      },
      {
        onSuccess: (createdProposal) => {
          // Then update with content
          updateProposalMutation.mutate(
            {
              id: createdProposal.proposal_id,
              data: {
                content: proposal,
                title: proposalTitle || "Untitled Proposal",
              },
            },
            {
              onSuccess: () => {
                toast.success("Proposal saved!");
                router.push("/proposals");
              },
            }
          );
        },
      }
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proposal);
    toast.success("Copied to clipboard!");
  };

  const getRecommendationStyle = (rec: JobAnalysis["recommendation"]) => {
    const styles = {
      strong_apply: {
        bg: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-700",
        label: "Strong Apply",
      },
      consider: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        label: "Consider",
      },
      skip: {
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
        label: "Skip",
      },
    };
    return styles[rec] || styles.consider;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto" data-testid="new-proposal-page">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { num: 1, label: "Paste Job" },
          { num: 2, label: "Analyze" },
          { num: 3, label: "Generate" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center gap-2 ${
                step >= s.num ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step >= s.num
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span className="font-medium hidden sm:inline">{s.label}</span>
            </div>
            {i < 2 && (
              <ChevronRight
                className={`w-5 h-5 mx-2 ${
                  step > s.num ? "text-blue-600" : "text-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Paste Job */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 animate-fade-in">
          <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">
            New Proposal
          </h1>
          <p className="text-slate-600 mb-6">
            Paste a job description to analyze and generate a winning proposal
          </p>

          <div className="space-y-4">
            <div>
              <Label>Platform (optional)</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="mt-1.5" data-testid="platform-select">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upwork">Upwork</SelectItem>
                  <SelectItem value="fiverr">Fiverr</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="toptal">Toptal</SelectItem>
                  <SelectItem value="freelancer">Freelancer.com</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Job Description *</Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="mt-1.5 min-h-75 font-mono text-sm"
                data-testid="job-description-input"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={analyzeJobMutation.isPending || !jobDescription.trim()}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="analyze-job-btn"
            >
              {analyzeJobMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Analyze Job
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Analysis Results */}
      {step === 2 && analysis && (
        <div className="space-y-6 animate-fade-in">
          {/* Recommendation Banner */}
          <div
            className={`rounded-xl border p-6 ${
              getRecommendationStyle(analysis.recommendation).bg
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Recommendation
                </p>
                <p
                  className={`text-2xl font-bold ${
                    getRecommendationStyle(analysis.recommendation).text
                  }`}
                >
                  {getRecommendationStyle(analysis.recommendation).label}
                </p>
              </div>
              <div
                className={`text-4xl font-bold ${
                  getRecommendationStyle(analysis.recommendation).text
                }`}
              >
                {analysis.win_probability}%
                <span className="text-sm font-normal block text-right">
                  Win Probability
                </span>
              </div>
            </div>
            {analysis.recommendation_reasons &&
              analysis.recommendation_reasons.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {analysis.recommendation_reasons.map((reason, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-600 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* Scores Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Skill Match", value: analysis.skill_match_score },
              {
                label: "Experience Relevance",
                value: analysis.experience_relevance_score,
              },
              {
                label: "Project Similarity",
                value: analysis.project_similarity_score,
              },
            ].map((score, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 text-center"
              >
                <p className="text-sm text-slate-600 mb-2">{score.label}</p>
                <p
                  className={`text-3xl font-bold ${
                    score.value >= 70
                      ? "text-emerald-600"
                      : score.value >= 40
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {score.value}%
                </p>
              </div>
            ))}
          </div>

          {/* Skills Match */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-heading text-lg font-semibold text-slate-900 mb-4">
              Skill Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Required Skills
                </p>
                <div className="space-y-2">
                  {analysis.skill_matches?.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                    >
                      <span className="text-sm text-slate-700">
                        {skill.skill}
                      </span>
                      {skill.matched ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Matched
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-sm">
                          <XCircle className="w-4 h-4" />
                          Missing
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Similar Projects
                </p>
                {analysis.similar_projects &&
                analysis.similar_projects.length > 0 ? (
                  <div className="space-y-2">
                    {analysis.similar_projects.map((proj, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50">
                        <p className="font-medium text-slate-900 text-sm">
                          {proj.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {proj.similarity}% match
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No similar projects found
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Red Flags */}
          {analysis.red_flags && analysis.red_flags.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="font-heading text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Red Flags
              </h3>
              <ul className="space-y-2">
                {analysis.red_flags.map((flag, i) => (
                  <li
                    key={i}
                    className="text-sm text-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={generateProposalMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="generate-proposal-btn"
            >
              {generateProposalMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Proposal
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generated Proposal */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-slate-900">
                Your Proposal
              </h2>
              <div className="flex items-center gap-2">
                <Select
                  value={tone}
                  onValueChange={(value) =>
                    setTone(value as typeof tone)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generateProposalMutation.isPending}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-1 ${
                      generateProposalMutation.isPending ? "animate-spin" : ""
                    }`}
                  />
                  Regenerate
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <Label>Proposal Title</Label>
              <Input
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="e.g., React Native Medical App Proposal"
                className="mt-1.5"
                data-testid="proposal-title-input"
              />
            </div>

            <Textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="min-h-100 font-body"
              data-testid="proposal-content-textarea"
            />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                {proposal.split(/\s+/).length} words
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  data-testid="copy-proposal-btn"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleSaveProposal}
                  disabled={
                    createProposalMutation.isPending ||
                    updateProposalMutation.isPending
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="save-proposal-btn"
                >
                  {createProposalMutation.isPending ||
                  updateProposalMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Save Proposal
                </Button>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setStep(2)}
            className="w-full"
          >
            Back to Analysis
          </Button>
        </div>
      )}
    </div>
  );
}
