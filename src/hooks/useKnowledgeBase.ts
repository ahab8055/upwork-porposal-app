import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { knowledgeBaseService } from "@/services/knowledgeBaseService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type {
  CreateProjectRequest,
  CreateResumeRequest,
} from "@/types/knowledge-base";

// Documents
export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: () => knowledgeBaseService.getDocuments(),
    refetchInterval: (query) => {
      const documents = query.state.data;
      if (!documents?.length) return false;
      const isProcessing = documents.some(
        (doc) =>
          doc.processing_status === "pending" ||
          doc.processing_status === "processing"
      );
      return isProcessing ? 3000 : false;
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, documentType }: { file: File; documentType?: string }) =>
      knowledgeBaseService.uploadDocument(file, documentType),
    onSuccess: (_, variables) => {
      toast.success(`${variables.file.name} uploaded successfully`);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: AxiosError<{ detail?: string }>, variables) => {
      toast.error(
        error.response?.data?.detail ||
          `Failed to upload ${variables.file.name}`
      );
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => knowledgeBaseService.deleteDocument(id),
    onSuccess: () => {
      toast.success("Document deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => {
      toast.error("Failed to delete document");
    },
  });
};

// Projects
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => knowledgeBaseService.getProjects(),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      knowledgeBaseService.createProject(data),
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => knowledgeBaseService.deleteProject(id),
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
};

// Resumes
export const useResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: () => knowledgeBaseService.getResumes(),
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResumeRequest) =>
      knowledgeBaseService.createResume(data),
    onSuccess: () => {
      toast.success("Team member added successfully");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: () => {
      toast.error("Failed to add team member");
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => knowledgeBaseService.deleteResume(id),
    onSuccess: () => {
      toast.success("Team member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: () => {
      toast.error("Failed to delete team member");
    },
  });
};
