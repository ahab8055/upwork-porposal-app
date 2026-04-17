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

export interface Industry {
  id: string;
  label: string;
}

export const COMPANY_SIZES = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
];

export const INDUSTRIES: Industry[] = [
  { id: "it_and_services", label: "Information Technology And Services" },
  { id: "computer_software", label: "Computer Software" },
  { id: "internet", label: "Internet" },
  { id: "computer_and_network_security", label: "Computer And Network Security" },
  { id: "computer_networking", label: "Computer Networking" },
  { id: "computer_hardware", label: "Computer Hardware" },
  { id: "computer_games", label: "Computer Games" },
  { id: "semiconductors", label: "Semiconductors" },
  { id: "telecommunications", label: "Telecommunications" },
  { id: "wireless", label: "Wireless" },
  { id: "information_services", label: "Information Services" },
  { id: "design", label: "Design" },
  { id: "graphic_design", label: "Graphic Design" },
  { id: "animation", label: "Animation" },
  { id: "media_production", label: "Media Production" },
  { id: "photography", label: "Photography" },
  { id: "motion_pictures_and_film", label: "Motion Pictures And Film" },
  { id: "music", label: "Music" },
  { id: "marketing_and_advertising", label: "Marketing And Advertising" },
  { id: "market_research", label: "Market Research" },
  { id: "online_publishing", label: "Online Publishing" },
  { id: "writing_and_editing", label: "Writing And Editing" },
  { id: "public_relations", label: "Public Relations" },
  { id: "elearning", label: "E-Learning" },
  { id: "education_management", label: "Education Management" },
  { id: "higher_education", label: "Higher Education" },
  { id: "professional_training", label: "Professional Training" },
  { id: "accounting", label: "Accounting" },
  { id: "financial_services", label: "Financial Services" },
  { id: "management_consulting", label: "Management Consulting" },
  { id: "outsourcing_offshoring", label: "Outsourcing/Offshoring" },
  { id: "staffing_and_recruiting", label: "Staffing And Recruiting" },
  { id: "research", label: "Research" },
  { id: "translation_and_localization", label: "Translation And Localization" },
]


