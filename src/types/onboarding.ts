export interface OnboardingData {
  companyInfo: CompanyInfo;
  skills: string[];
  teamMembers: TeamMember[];
  knowledgeBaseFiles: KnowledgeBaseFile[];
}

export interface CompanyInfo {
  name: string;
  logo?: File | null;
  logoUrl?: string;
  industry?: string;
  companySize?: string;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
}

export interface KnowledgeBaseFile {
  file: File;
  category: string;
}

export const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

export const QUICK_ADD_SKILLS = [
  'React',
  'React Native',
  'Node.js',
  'JavaScript',
  'Mobile Development',
  'Web Development',
  'UI/UX Design',
  'DevOps',
  'Azure',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
];
