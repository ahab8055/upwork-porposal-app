import { apiClient } from "@/lib/axios";
import type {
  Document,
  Project,
  Resume,
  CreateProjectRequest,
  CreateResumeRequest,
} from "@/types/knowledge-base";

export const knowledgeBaseService = {
  // Documents
  getDocuments: async (): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>("/documents");
    return response.data;
  },

  uploadDocument: async (file: File, documentType: string = "other"): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", documentType);

    const response = await apiClient.post<Document>("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    return response.data;
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>("/projects", data);
    return response.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Resumes
  getResumes: async (): Promise<Resume[]> => {
    const response = await apiClient.get<Resume[]>("/resumes");
    return response.data;
  },

  createResume: async (data: CreateResumeRequest): Promise<Resume> => {
    const response = await apiClient.post<Resume>("/resumes", data);
    return response.data;
  },

  deleteResume: async (id: number): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },
};
