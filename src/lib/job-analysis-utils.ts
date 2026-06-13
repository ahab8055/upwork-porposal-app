import type { JobAnalysisRecord } from "@/types/job-analysis";

export function normalizeRecommendation(
  decision?: string | null
): "strong_apply" | "consider" | "skip" {
  const value = (decision || "").toLowerCase().replace(/\s+/g, "_");
  if (value.includes("strong")) return "strong_apply";
  if (value.includes("skip") || value.includes("pass") || value.includes("avoid")) {
    return "skip";
  }
  return "consider";
}

export function getRecommendationStyle(decision?: string | null) {
  const normalized = normalizeRecommendation(decision);
  const styles = {
    strong_apply: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-800",
      label: "Strong Apply",
    },
    consider: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-800",
      label: "Consider",
    },
    skip: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      badge: "bg-red-100 text-red-800",
      label: "Skip",
    },
  };
  return styles[normalized];
}

export function getFitScoreColor(score: number | null | undefined): string {
  if (score == null) return "text-slate-500";
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

export function getConfidenceLevel(analysis: JobAnalysisRecord): {
  label: string;
  description: string;
  percent: number | null;
} {
  const winChance = analysis.analysis_results?.proposal_winning_chance as
    | { chance_level?: string; score?: number; reason?: string }
    | undefined;

  if (winChance?.chance_level) {
    const score = typeof winChance.score === "number" ? winChance.score * 10 : null;
    return {
      label: winChance.chance_level,
      description: winChance.reason || "Based on win probability analysis",
      percent: score,
    };
  }

  const fitScore = analysis.fit_score ?? analysis.match_score;
  if (fitScore != null) {
    if (fitScore >= 75) {
      return {
        label: "High",
        description: "Strong alignment with your company profile",
        percent: fitScore,
      };
    }
    if (fitScore >= 50) {
      return {
        label: "Medium",
        description: "Moderate fit with some gaps to address",
        percent: fitScore,
      };
    }
    return {
      label: "Low",
      description: "Limited alignment with current capabilities",
      percent: fitScore,
    };
  }

  return {
    label: "Unknown",
    description: "Confidence will appear when analysis completes",
    percent: null,
  };
}

export function getRecommendationReasoning(
  analysis: JobAnalysisRecord
): string {
  return (
    analysis.recommendations?.reasoning ||
    analysis.recommendations?.reason ||
    ""
  );
}
