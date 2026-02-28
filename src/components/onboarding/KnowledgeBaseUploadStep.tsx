'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Briefcase, Award, File, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KnowledgeBaseFile {
  file: File;
  category: string;
}

interface KnowledgeBaseUploadStepProps {
  files: KnowledgeBaseFile[];
  onChange: (files: KnowledgeBaseFile[]) => void;
}

const FILE_CATEGORIES = [
  {
    id: 'project-documents',
    icon: FileText,
    label: 'Project Documents',
    description: 'Case studies, proposals, project summaries',
    color: 'blue',
  },
  {
    id: 'team-resumes',
    icon: Briefcase,
    label: 'Team Resumes',
    description: 'CVs, portfolios, skill matrices',
    color: 'red',
  },
  {
    id: 'portfolio-items',
    icon: Award,
    label: 'Portfolio Items',
    description: 'Past work examples, testimonials',
    color: 'orange',
  },
  {
    id: 'other-documents',
    icon: File,
    label: 'Other Documents',
    description: 'Any other relevant company materials',
    color: 'orange',
  },
];

export function KnowledgeBaseUploadStep({
  files,
  onChange,
}: KnowledgeBaseUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return ['pdf', 'docx', 'txt', 'md'].includes(extension || '');
      });

      const newFiles: KnowledgeBaseFile[] = validFiles.map((file) => ({
        file,
        category: 'other-documents',
      }));

      onChange([...files, ...newFiles]);
    },
    [files, onChange]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = selectedFiles.filter((file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return ['pdf', 'docx', 'txt', 'md'].includes(extension || '');
      });

      const newFiles: KnowledgeBaseFile[] = validFiles.map((file) => ({
        file,
        category: 'other-documents',
      }));

      onChange([...files, ...newFiles]);
      e.target.value = '';
    },
    [files, onChange]
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Upload your knowledge base
        </h2>
        <p className="text-sm text-gray-600">
          Add past projects, portfolios, and team resumes to help AI generate better proposals.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Upload className="h-6 w-6 text-blue-600" />
        </div>
        <p className="mb-2 text-sm font-medium text-gray-900">
          Drop files here or click to upload
        </p>
        <p className="mb-4 text-xs text-gray-500">
          Support for PDF, DOCX, TXT, and MD files up to 10MB
        </p>
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileInput}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Browse Files
        </Button>
      </div>

      {/* File Categories */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FILE_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const categoryFiles = files.filter((f) => f.category === category.id);

          return (
            <div
              key={category.id}
              className={`rounded-lg border p-4 ${
                category.color === 'blue'
                  ? 'border-blue-200 bg-blue-50'
                  : category.color === 'red'
                  ? 'border-red-200 bg-red-50'
                  : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon
                  className={`h-4 w-4 ${
                    category.color === 'blue'
                      ? 'text-blue-600'
                      : category.color === 'red'
                      ? 'text-red-600'
                      : 'text-orange-600'
                  }`}
                />
                <span className="font-medium text-gray-900">
                  {category.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">{category.description}</p>
              {categoryFiles.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {categoryFiles.length} file(s) added
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="flex gap-3 rounded-lg bg-gray-100 p-4">
        <Info className="h-5 w-5 shrink-0 text-gray-600" />
        <p className="text-sm text-gray-600">
          <span className="font-medium">Don&apos;t have documents to upload?</span> You
          can skip and upload them later from the Knowledge Base section.
        </p>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-gray-900">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{item.file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = files.filter((_, i) => i !== index);
                    onChange(newFiles);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
