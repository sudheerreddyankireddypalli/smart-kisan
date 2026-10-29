export type ProjectCategory = 'All' | 'Python & EDA' | 'SQL & Database' | 'Power BI & Dashboards' | 'Agri-Tech Concept';

export interface ProjectFinding {
  metric: string;
  label: string;
  description: string;
}

export interface ProjectRecommendation {
  title: string;
  impact: string;
  action: string;
}

export interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  tags: string[];
  featured: boolean;
  statusBadge: string;
  businessProblem: string;
  datasetSource: {
    name: string;
    description: string;
    rowCount?: string;
    featuresCount?: string;
    verified: boolean;
  };
  analyticalQuestions: string[];
  toolsUsed: {
    tool: string;
    purpose: string;
  }[];
  dataCleaningSteps: string[];
  methodology: string[];
  findings: ProjectFinding[];
  recommendations: ProjectRecommendation[];
  chartsSummary: {
    name: string;
    chartType: string;
    insight: string;
  }[];
  sqlSnippets?: {
    title: string;
    query: string;
    explanation: string;
  }[];
  pythonSnippets?: {
    title: string;
    code: string;
    explanation: string;
  }[];
  githubUrl: string;
  liveDemoUrl?: string;
  image?: string;
  galleryImages?: string[];
  isConcept?: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  businessValue: string;
  deliverables: string[];
  icon: string;
  suggestedPackage: string;
  basePrice: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  priceRange: string;
  duration: string;
  tagline: string;
  bestFor: string;
  features: string[];
  highlighted?: boolean;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: {
    name: string;
    levelDescription: string;
    tags: string[];
    useCase: string;
  }[];
}

export interface ProcessStep {
  step: number;
  title: string;
  duration: string;
  description: string;
  deliverable: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  companyName?: string;
  serviceRequired: string;
  budgetRange: string;
  desiredDeadline: string;
  datasetStatus: string;
  projectDescription: string;
  preferredContact: string;
}
