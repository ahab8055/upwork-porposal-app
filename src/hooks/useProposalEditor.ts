import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { editorHtmlToPlainText } from "@/lib/proposal-editor-utils";
import { proposalService } from "@/services/proposalService";
import type { UpdateProposalVersionRequest } from "@/types/proposal";

export type ProposalSaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export const useProposalVersion = (versionId: string | null) => {
  return useQuery({
    queryKey: ["proposal-version", versionId],
    queryFn: () => proposalService.getProposalVersion(versionId!),
    enabled: Boolean(versionId),
    refetchInterval: (query) => {
      const status = query.state.data?.processing_status;
      if (
        status === "pending" ||
        status === "processing"
      ) {
        return 3000;
      }
      return false;
    },
  });
};

export const useSaveProposalVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      versionId,
      data,
    }: {
      versionId: string;
      data: UpdateProposalVersionRequest;
    }) => proposalService.saveProposalVersion(versionId, data),
    onSuccess: (record) => {
      queryClient.setQueryData(["proposal-version", record.id], record);
      queryClient.setQueryData(["proposal-detail", record.proposal_id], record);
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Failed to save proposal");
    },
  });
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

interface UseProposalAutoSaveOptions {
  versionId: string;
  htmlContent: string;
  enabled?: boolean;
  debounceMs?: number;
}

export const useProposalAutoSave = ({
  versionId,
  htmlContent,
  enabled = true,
  debounceMs = 2000,
}: UseProposalAutoSaveOptions) => {
  const { mutate, mutateAsync, isPending } = useSaveProposalVersion();
  const debouncedHtml = useDebouncedValue(htmlContent, debounceMs);
  const lastSavedRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const [saveStatus, setSaveStatus] = useState<ProposalSaveStatus>("idle");

  const resetSavedBaseline = useCallback((content: string) => {
    lastSavedRef.current = content;
    initializedRef.current = true;
    setSaveStatus("idle");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const plainText = editorHtmlToPlainText(debouncedHtml);
    if (!plainText) return;

    if (!initializedRef.current) {
      lastSavedRef.current = plainText;
      initializedRef.current = true;
      return;
    }

    if (plainText === lastSavedRef.current) {
      return;
    }

    setSaveStatus("saving");
    mutate(
      {
        versionId,
        data: {
          content: plainText,
          change_summary: "Auto-saved edit",
        },
      },
      {
        onSuccess: () => {
          lastSavedRef.current = plainText;
          setSaveStatus("saved");
        },
        onError: () => {
          setSaveStatus("error");
        },
      }
    );
  }, [debouncedHtml, enabled, mutate, versionId]);

  const markDirty = useCallback(() => {
    const plainText = editorHtmlToPlainText(htmlContent);
    if (plainText !== lastSavedRef.current) {
      setSaveStatus("dirty");
    }
  }, [htmlContent]);

  const saveNow = useCallback(
    async (changeSummary = "Manual save") => {
      const plainText = editorHtmlToPlainText(htmlContent);
      if (!plainText) {
        toast.error("Proposal content cannot be empty");
        return;
      }

      setSaveStatus("saving");
      try {
        await mutateAsync({
          versionId,
          data: { content: plainText, change_summary: changeSummary },
        });
        lastSavedRef.current = plainText;
        setSaveStatus("saved");
        toast.success("Proposal saved");
      } catch {
        setSaveStatus("error");
      }
    },
    [htmlContent, mutateAsync, versionId]
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!initializedRef.current) return false;
    if (saveStatus === "dirty" || saveStatus === "error") return true;
    return editorHtmlToPlainText(htmlContent) !== lastSavedRef.current;
  }, [htmlContent, saveStatus]);

  return {
    saveStatus,
    markDirty,
    saveNow,
    resetSavedBaseline,
    isSaving: isPending,
    hasUnsavedChanges,
  };
};
