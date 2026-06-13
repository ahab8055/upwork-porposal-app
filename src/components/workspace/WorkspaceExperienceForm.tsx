"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillsSelector } from "@/components/skills/SkillsSelector";
import { useWorkspace, useUpdateWorkspace } from "@/hooks/useSettings";
import { apiClient } from "@/lib/axios";
import { COMPANY_SIZES, INDUSTRIES } from "@/types/onboarding";
import {
  workspaceExperienceSchema,
  validateWorkspaceLogo,
} from "@/lib/validations/workspace";
import { Building, Save, Loader2 } from "lucide-react";

function normalizeSkills(skills: unknown): string[] {
  if (Array.isArray(skills)) {
    return Array.from(
      new Set(
        skills
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
      )
    );
  }

  if (typeof skills === "string") {
    return Array.from(
      new Set(
        skills
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );
  }

  return [];
}

function normalizeCompanySize(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function getIndustryLabel(industryId: string): string {
  return INDUSTRIES.find((item) => item.id === industryId)?.label || industryId;
}

export function WorkspaceExperienceForm() {
  const { data: workspace, isLoading } = useWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const logoBlobUrlRef = useRef<string | null>(null);

  const [industry, setIndustry] = useState("");
  const [industryEdited, setIndustryEdited] = useState(false);
  const [companySize, setCompanySize] = useState("");
  const [companySizeEdited, setCompanySizeEdited] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsEdited, setSkillsEdited] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoDisplayUrl, setLogoDisplayUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    industry?: string;
    company_size?: string;
    skills?: string;
  }>({});

  const displayedIndustry = industryEdited ? industry : workspace?.industry || "";
  const displayedCompanySize = companySizeEdited
    ? companySize
    : normalizeCompanySize(workspace?.company_size);
  const existingSkills = normalizeSkills(workspace?.skills);
  const displayedSkills = skillsEdited ? skills : existingSkills;

  const industryOptions =
    displayedIndustry && !INDUSTRIES.some((item) => item.id === displayedIndustry)
      ? [{ id: displayedIndustry, label: getIndustryLabel(displayedIndustry) }, ...INDUSTRIES]
      : INDUSTRIES;

  const companySizeOptions =
    displayedCompanySize && !COMPANY_SIZES.includes(displayedCompanySize)
      ? [displayedCompanySize, ...COMPANY_SIZES]
      : COMPANY_SIZES;

  const isIndustryChanged =
    industryEdited && displayedIndustry.trim() !== (workspace?.industry || "").trim();
  const isCompanySizeChanged =
    companySizeEdited &&
    displayedCompanySize !== normalizeCompanySize(workspace?.company_size);
  const isSkillsChanged =
    skillsEdited &&
    JSON.stringify(displayedSkills) !== JSON.stringify(existingSkills);
  const isLogoChanged = !!logoFile;
  const isDirty = isIndustryChanged || isCompanySizeChanged || isSkillsChanged || isLogoChanged;

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  useEffect(() => {
    let cancelled = false;

    async function loadLogoFromApi() {
      const response = await apiClient.get("/workspace/logo", {
        responseType: "blob",
      });
      if (cancelled) {
        return;
      }
      const url = URL.createObjectURL(response.data);
      logoBlobUrlRef.current = url;
      setLogoDisplayUrl(url);
    }

    async function loadLogo() {
      if (logoBlobUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(logoBlobUrlRef.current);
        logoBlobUrlRef.current = null;
      }

      if (logoPreview) {
        setLogoDisplayUrl(logoPreview);
        return;
      }

      if (!workspace?.logo && !workspace?.logo_url) {
        setLogoDisplayUrl(null);
        return;
      }

      if (workspace.logo_url) {
        setLogoDisplayUrl(workspace.logo_url);
        return;
      }

      try {
        await loadLogoFromApi();
      } catch {
        if (!cancelled) {
          setLogoDisplayUrl(null);
        }
      }
    }

    void loadLogo();

    return () => {
      cancelled = true;
      if (logoBlobUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(logoBlobUrlRef.current);
        logoBlobUrlRef.current = null;
      }
    };
  }, [workspace?.logo, workspace?.logo_url, logoPreview]);

  const handleLogoImageError = () => {
    if (!workspace?.logo || logoPreview) {
      setLogoDisplayUrl(null);
      return;
    }

    void (async () => {
      try {
        const response = await apiClient.get("/workspace/logo", {
          responseType: "blob",
        });
        if (logoBlobUrlRef.current?.startsWith("blob:")) {
          URL.revokeObjectURL(logoBlobUrlRef.current);
        }
        const url = URL.createObjectURL(response.data);
        logoBlobUrlRef.current = url;
        setLogoDisplayUrl(url);
      } catch {
        setLogoDisplayUrl(null);
      }
    })();
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const logoError = validateWorkspaceLogo(file);
    if (logoError) {
      toast.error(logoError);
      event.target.value = "";
      return;
    }

    if (logoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const parsedSkills = normalizeSkills(displayedSkills);
    const validation = workspaceExperienceSchema.safeParse({
      industry: displayedIndustry,
      company_size: displayedCompanySize,
      skills: parsedSkills,
    });

    if (!validation.success) {
      const fieldErrors: {
        industry?: string;
        company_size?: string;
        skills?: string;
      } = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "industry" || field === "company_size" || field === "skills") {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    updateWorkspaceMutation.mutate(
      {
        industry: validation.data.industry,
        company_size: validation.data.company_size,
        skills: validation.data.skills,
        logo: logoFile || undefined,
      },
      {
        onSuccess: (updatedWorkspace) => {
          if (logoPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(logoPreview);
          }
          setIndustry(updatedWorkspace.industry || "");
          setCompanySize(normalizeCompanySize(updatedWorkspace.company_size));
          setSkills(normalizeSkills(updatedWorkspace.skills));
          setIndustryEdited(false);
          setCompanySizeEdited(false);
          setSkillsEdited(false);
          setLogoFile(null);
          setLogoPreview(null);
          if (updatedWorkspace.logo_url) {
            setLogoDisplayUrl(updatedWorkspace.logo_url);
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center" data-testid="workspace-experience-loading">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="workspace-experience-form">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="relative w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden group"
          aria-label="Change company logo"
        >
          {logoDisplayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoDisplayUrl}
              alt={workspace?.name || "Company logo"}
              className="w-full h-full object-cover"
              onError={handleLogoImageError}
            />
          ) : (
            <Building className="w-8 h-8 text-slate-400" />
          )}
          <span className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors" />
        </button>
        <div>
          <p className="text-sm font-medium text-slate-700">Company logo</p>
          <p className="text-xs text-slate-500 mt-1">Click to upload PNG, JPG, or WEBP (max 5MB)</p>
          {logoFile && (
            <p className="text-xs text-slate-500 mt-1">Selected: {logoFile.name}</p>
          )}
        </div>
        <Input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleLogoChange}
          className="hidden"
          data-testid="workspace-logo-input"
        />
      </div>

      <div>
        <Label htmlFor="workspace-industry">Company Industry</Label>
        <Select
          value={displayedIndustry}
          onValueChange={(value) => {
            setIndustry(value);
            setIndustryEdited(true);
            setErrors((prev) => ({ ...prev, industry: undefined }));
          }}
        >
          <SelectTrigger
            id="workspace-industry"
            className="mt-1.5"
            data-testid="workspace-industry-select"
          >
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {industryOptions.map(({ id, label }) => (
              <SelectItem key={id} value={id}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industry && (
          <p className="mt-1 text-xs text-red-600">{errors.industry}</p>
        )}
      </div>

      <div>
        <Label htmlFor="workspace-company-size">Company Size</Label>
        <Select
          value={displayedCompanySize}
          onValueChange={(value) => {
            setCompanySize(value);
            setCompanySizeEdited(true);
            setErrors((prev) => ({ ...prev, company_size: undefined }));
          }}
        >
          <SelectTrigger
            id="workspace-company-size"
            className="mt-1.5"
            data-testid="workspace-company-size-select"
          >
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            {companySizeOptions.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.company_size && (
          <p className="mt-1 text-xs text-red-600">{errors.company_size}</p>
        )}
      </div>

      <div>
        <Label>Skills</Label>
        <div className="mt-1.5">
          <SkillsSelector
            skills={displayedSkills}
            onChange={(nextSkills) => {
              setSkills(nextSkills);
              setSkillsEdited(true);
              setErrors((prev) => ({ ...prev, skills: undefined }));
            }}
            inputLabel="Search & Add Skills"
            placeholder="Search skills for your workspace..."
          />
        </div>
        {errors.skills && (
          <p className="mt-1 text-xs text-red-600">{errors.skills}</p>
        )}
      </div>

      <div className="pt-2">
        <Button
          onClick={handleSave}
          disabled={updateWorkspaceMutation.isPending || !isDirty}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="save-workspace-experience-btn"
        >
          {updateWorkspaceMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Experience
        </Button>
      </div>
    </div>
  );
}
