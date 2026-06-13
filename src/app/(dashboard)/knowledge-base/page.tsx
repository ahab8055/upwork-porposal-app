"use client";

import { useState } from "react";
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
import { DocumentUploadZone } from "@/components/knowledge-base/DocumentUploadZone";
import { DocumentListItem } from "@/components/knowledge-base/DocumentListItem";
import { useDocumentProcessingNotifications } from "@/hooks/useDocumentProcessingNotifications";
import {
  useDocuments,
  useDeleteDocument,
  useProjects,
  useCreateProject,
  useDeleteProject
} from "@/hooks/useKnowledgeBase";
import {
  FileText,
  FolderOpen,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import type {
  Document as KBDocument,
  Project,
  CreateProjectRequest,
} from "@/types/knowledge-base";

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  // Queries
  const { data: documents = [], isLoading: documentsLoading } = useDocuments();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  useDocumentProcessingNotifications(documents);

  // Mutations
  const deleteDocumentMutation = useDeleteDocument();
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();

  const loading = documentsLoading || projectsLoading;

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

  const filterDocuments = (items: KBDocument[]): KBDocument[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.file_name?.toLowerCase().includes(query) ?? false)
    );
  };

  const filterProjects = (items: Project[]): Project[] => {
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
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentUploadZone />

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
                <DocumentListItem
                  key={doc.document_id}
                  document={doc}
                  onDelete={(id) => deleteDocumentMutation.mutate(id)}
                  isDeleting={deleteDocumentMutation.isPending}
                />
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
                  <DialogTitle className="text-xl font-bold text-slate-900">Add New Project</DialogTitle>
                  <p className="text-sm text-slate-500 mt-1">Fill in the project details below</p>
                </DialogHeader>
                <form
                  onSubmit={handleCreateProject}
                  className="space-y-6 mt-6"
                >
                  <div className="space-y-5">
                    {/* Project Name */}
                    <div>
                      <Label className="text-slate-700 font-medium mb-2 block">
                        Project Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        required
                        value={projectForm.name}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, name: e.target.value })
                        }
                        placeholder="e.g., E-commerce Platform"
                        className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        data-testid="project-name-input"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-slate-700 font-medium mb-2 block">
                        Description <span className="text-red-500">*</span>
                      </Label>
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
                        rows={4}
                        className="bg-white border-slate-300 focus:border-blue-500 resize-none"
                        data-testid="project-description-input"
                      />
                    </div>

                    {/* Client and Industry */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 font-medium mb-2 block">
                          Client Name
                        </Label>
                        <Input
                          value={projectForm.client_name}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              client_name: e.target.value,
                            })
                          }
                          placeholder="e.g., Acme Corp"
                          className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 font-medium mb-2 block">
                          Industry
                        </Label>
                        <Input
                          value={projectForm.industry}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              industry: e.target.value,
                            })
                          }
                          placeholder="e.g., Healthcare, Finance"
                          className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        />
                      </div>
                    </div>

                    {/* Technologies */}
                    <div>
                      <Label className="text-slate-700 font-medium mb-2 block">
                        Technologies <span className="text-slate-500 text-xs font-normal">(comma-separated)</span>
                      </Label>
                      <Input
                        value={projectForm.technologies}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            technologies: e.target.value,
                          })
                        }
                        placeholder="e.g., React, Node.js, PostgreSQL"
                        className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        data-testid="project-technologies-input"
                      />
                    </div>

                    {/* Team Size and Duration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 font-medium mb-2 block">
                          Team Size
                        </Label>
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
                          className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 font-medium mb-2 block">
                          Duration <span className="text-slate-500 text-xs font-normal">(months)</span>
                        </Label>
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
                          className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        />
                      </div>
                    </div>

                    {/* Budget Range and Outcome */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 font-medium mb-2 block">
                          Budget Range
                        </Label>
                        <Input
                          value={projectForm.budget_range}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              budget_range: e.target.value,
                            })
                          }
                          placeholder="e.g., $20,000 - $30,000"
                          className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700 font-medium mb-2 block">
                          Outcome/Result
                        </Label>
                        <Input
                          value={projectForm.outcome}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              outcome: e.target.value,
                            })
                          }
                          placeholder="e.g., 50% increase in sales"
                          className="bg-white border-slate-300 focus:border-blue-500 h-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setProjectModalOpen(false)}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      disabled={createProjectMutation.isPending}
                      data-testid="save-project-btn"
                    >
                      {createProjectMutation.isPending ? "Saving..." : "Save Project"}
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
      </Tabs>
    </div>
  );
}
