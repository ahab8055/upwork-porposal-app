"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
  useProjects,
  useCreateProject,
  useDeleteProject,
  useResumes,
  useCreateResume,
  useDeleteResume,
} from "@/hooks/useKnowledgeBase";
import {
  FileText,
  FolderOpen,
  User,
  Plus,
  Upload,
  Trash2,
  Search,
} from "lucide-react";
import type {
  Document as KBDocument,
  Project,
  Resume,
  CreateProjectRequest,
  CreateResumeRequest,
} from "@/types/knowledge-base";

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Queries
  const { data: documents = [], isLoading: documentsLoading } = useDocuments();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: resumes = [], isLoading: resumesLoading } = useResumes();

  // Mutations
  const uploadDocumentMutation = useUploadDocument();
  const deleteDocumentMutation = useDeleteDocument();
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();
  const createResumeMutation = useCreateResume();
  const deleteResumeMutation = useDeleteResume();

  const loading = documentsLoading || projectsLoading || resumesLoading;

  // Form states
  const [projectForm, setProjectForm] = useState<{
    name: string;
    description: string;
    client_name: string;
    industry: string;
    technologies: string;
    team_size: string;
    duration_months: string;
    budget_range: string;
    outcome: string;
  }>({
    name: "",
    description: "",
    client_name: "",
    industry: "",
    technologies: "",
    team_size: "",
    duration_months: "",
    budget_range: "",
    outcome: "",
  });

  const [resumeForm, setResumeForm] = useState<{
    name: string;
    title: string;
    email: string;
    summary: string;
    skills: string;
    experience_years: string;
  }>({
    name: "",
    title: "",
    email: "",
    summary: "",
    skills: "",
    experience_years: "",
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      for (const file of acceptedFiles) {
        uploadDocumentMutation.mutate({
          file,
          documentType: "other",
        });
      }
    },
    [uploadDocumentMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateProjectRequest = {
      name: projectForm.name,
      description: projectForm.description,
      client_name: projectForm.client_name || undefined,
      industry: projectForm.industry || undefined,
      technologies: projectForm.technologies
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
      team_size: projectForm.team_size ? parseInt(projectForm.team_size) : null,
      duration_months: projectForm.duration_months
        ? parseFloat(projectForm.duration_months)
        : null,
      budget_range: projectForm.budget_range || undefined,
      outcome: projectForm.outcome || undefined,
    };

    createProjectMutation.mutate(payload, {
      onSuccess: () => {
        setProjectModalOpen(false);
        setProjectForm({
          name: "",
          description: "",
          client_name: "",
          industry: "",
          technologies: "",
          team_size: "",
          duration_months: "",
          budget_range: "",
          outcome: "",
        });
      },
    });
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateResumeRequest = {
      name: resumeForm.name,
      title: resumeForm.title,
      email: resumeForm.email || undefined,
      summary: resumeForm.summary || undefined,
      skills: resumeForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      experience_years: resumeForm.experience_years
        ? parseFloat(resumeForm.experience_years)
        : null,
    };

    createResumeMutation.mutate(payload, {
      onSuccess: () => {
        setResumeModalOpen(false);
        setResumeForm({
          name: "",
          title: "",
          email: "",
          summary: "",
          skills: "",
          experience_years: "",
        });
      },
    });
  };

  const filterDocuments = (items: KBDocument[]): KBDocument[] => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterProjects = (items: Project[]): Project[] => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterResumes = (items: Resume[]): Resume[] => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="p-8" data-testid="knowledge-base-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">
            Knowledge Base
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your projects, documents, and team profiles
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
            data-testid="knowledge-base-search"
          />
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="documents" data-testid="tab-documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="projects" data-testid="tab-projects">
            <FolderOpen className="w-4 h-4 mr-2" />
            Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">
            <User className="w-4 h-4 mr-2" />
            Team ({resumes.length})
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-slate-400"
            }`}
            data-testid="document-upload-dropzone"
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-slate-600" />
            </div>
            {uploadDocumentMutation.isPending ? (
              <p className="text-slate-600">Uploading...</p>
            ) : isDragActive ? (
              <p className="text-blue-600">Drop files here</p>
            ) : (
              <>
                <p className="text-slate-900 font-medium mb-1">
                  Drag & drop files or click to browse
                </p>
                <p className="text-sm text-slate-500">
                  Supports PDF, DOCX, TXT, and MD files
                </p>
              </>
            )}
          </div>

          {/* Documents List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filterDocuments(documents).length > 0 ? (
            <div className="space-y-3">
              {filterDocuments(documents).map((doc) => (
                <div
                  key={doc.document_id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  data-testid={`document-${doc.document_id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.title}</p>
                      <p className="text-sm text-slate-500">
                        {doc.document_type} • {doc.file_name || "No file"} •{" "}
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.extracted_skills && doc.extracted_skills.length > 0 && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        {doc.extracted_skills.length} skills
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        deleteDocumentMutation.mutate(doc.document_id)
                      }
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      data-testid={`delete-document-${doc.document_id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                No documents yet. Upload some to get started.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="add-project-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleCreateProject}
                  className="space-y-4 mt-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Project Name *</Label>
                      <Input
                        required
                        value={projectForm.name}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, name: e.target.value })
                        }
                        placeholder="e.g., E-commerce Platform"
                        data-testid="project-name-input"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Description *</Label>
                      <Textarea
                        required
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the project..."
                        rows={3}
                        data-testid="project-description-input"
                      />
                    </div>
                    <div>
                      <Label>Client Name</Label>
                      <Input
                        value={projectForm.client_name}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            client_name: e.target.value,
                          })
                        }
                        placeholder="e.g., Acme Corp"
                      />
                    </div>
                    <div>
                      <Label>Industry</Label>
                      <Input
                        value={projectForm.industry}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            industry: e.target.value,
                          })
                        }
                        placeholder="e.g., Healthcare, Finance"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Technologies (comma-separated)</Label>
                      <Input
                        value={projectForm.technologies}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            technologies: e.target.value,
                          })
                        }
                        placeholder="e.g., React, Node.js, PostgreSQL"
                        data-testid="project-technologies-input"
                      />
                    </div>
                    <div>
                      <Label>Team Size</Label>
                      <Input
                        type="number"
                        value={projectForm.team_size}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            team_size: e.target.value,
                          })
                        }
                        placeholder="e.g., 5"
                      />
                    </div>
                    <div>
                      <Label>Duration (months)</Label>
                      <Input
                        type="number"
                        step="0.5"
                        value={projectForm.duration_months}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            duration_months: e.target.value,
                          })
                        }
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <Label>Budget Range</Label>
                      <Input
                        value={projectForm.budget_range}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            budget_range: e.target.value,
                          })
                        }
                        placeholder="e.g., $20,000 - $30,000"
                      />
                    </div>
                    <div>
                      <Label>Outcome/Result</Label>
                      <Input
                        value={projectForm.outcome}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            outcome: e.target.value,
                          })
                        }
                        placeholder="e.g., 50% increase in sales"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setProjectModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="save-project-btn"
                    >
                      Save Project
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filterProjects(projects).length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filterProjects(projects).map((project) => (
                <div
                  key={project.project_id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors"
                  data-testid={`project-${project.project_id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        deleteProjectMutation.mutate(project.project_id)
                      }
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                No projects yet. Add your first project.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="add-team-member-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateResume} className="space-y-4 mt-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      required
                      value={resumeForm.name}
                      onChange={(e) =>
                        setResumeForm({ ...resumeForm, name: e.target.value })
                      }
                      placeholder="e.g., John Doe"
                      data-testid="team-member-name-input"
                    />
                  </div>
                  <div>
                    <Label>Job Title *</Label>
                    <Input
                      required
                      value={resumeForm.title}
                      onChange={(e) =>
                        setResumeForm({ ...resumeForm, title: e.target.value })
                      }
                      placeholder="e.g., Senior Developer"
                      data-testid="team-member-title-input"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={resumeForm.email}
                      onChange={(e) =>
                        setResumeForm({ ...resumeForm, email: e.target.value })
                      }
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <Label>Skills (comma-separated)</Label>
                    <Input
                      value={resumeForm.skills}
                      onChange={(e) =>
                        setResumeForm({ ...resumeForm, skills: e.target.value })
                      }
                      placeholder="e.g., JavaScript, React, Python"
                      data-testid="team-member-skills-input"
                    />
                  </div>
                  <div>
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={resumeForm.experience_years}
                      onChange={(e) =>
                        setResumeForm({
                          ...resumeForm,
                          experience_years: e.target.value,
                        })
                      }
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label>Summary</Label>
                    <Textarea
                      value={resumeForm.summary}
                      onChange={(e) =>
                        setResumeForm({
                          ...resumeForm,
                          summary: e.target.value,
                        })
                      }
                      placeholder="Brief professional summary..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setResumeModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      data-testid="save-team-member-btn"
                    >
                      Save Member
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filterResumes(resumes).length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {filterResumes(resumes).map((resume) => (
                <div
                  key={resume.resume_id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors"
                  data-testid={`team-member-${resume.resume_id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-violet-600" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        deleteResumeMutation.mutate(resume.resume_id)
                      }
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900">
                    {resume.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">{resume.title}</p>
                  {resume.experience_years && (
                    <p className="text-xs text-slate-400">
                      {resume.experience_years} years experience
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                No team members yet. Add your team&apos;s profiles.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
