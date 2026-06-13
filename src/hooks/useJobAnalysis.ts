import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { jobAnalysisService } from "@/services/jobAnalysisService";
import type {
  JobAnalysisListParams,
  JobAnalysisProcessingStatus,
  SubmitJobAnalysisRequest,
} from "@/types/job-analysis";

type ValidationDetail = {
  loc?: (string | number)[];
  msg?: string;
};

export function getJobAnalysisValidationErrors(
  error: AxiosError<{ detail?: string | ValidationDetail[] }>
): Record<string, string> {
  const detail = error.response?.data?.detail;
  if (!Array.isArray(detail)) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};
  for (const item of detail) {
    const field = item.loc?.[item.loc.length - 1];
    if (typeof field === "string" && item.msg) {
      fieldErrors[field] = item.msg;
    }
  }
  return fieldErrors;
}

const POLLING_STATUSES: JobAnalysisProcessingStatus[] = ["pending", "processing"];

export const useJobAnalysisList = (params: JobAnalysisListParams) => {
  return useQuery({
    queryKey: ["job-analyses", params],
    queryFn: () => jobAnalysisService.listAnalyses(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useJobAnalysisDetail = (analysisId: string | null) => {
  return useQuery({
    queryKey: ["job-analysis", analysisId],
    queryFn: () => jobAnalysisService.getAnalysis(analysisId!),
    enabled: Boolean(analysisId),
    refetchInterval: (query) => {
      const status = query.state.data?.processing_status;
      if (status && POLLING_STATUSES.includes(status)) {
        return 3000;
      }
      return false;
    },
  });
};

export const useSubmitJobAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitJobAnalysisRequest) =>
      jobAnalysisService.submitAnalysis(data),
    onSuccess: (response) => {
      toast.success("Job submitted for analysis");
      queryClient.invalidateQueries({ queryKey: ["job-analyses"] });
      return response;
    },
    onError: (error: AxiosError<{ detail?: string | ValidationDetail[] }>) => {
      const fieldErrors = getJobAnalysisValidationErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        return;
      }

      const detail = error.response?.data?.detail;
      toast.error(
        typeof detail === "string"
          ? detail
          : "Failed to submit job for analysis"
      );
    },
  });
};
