export interface SiteSettings {
  name: string;
  tagline: string;
  email: string;
  linkedin: string;
  location: string;
  phone: string;
  metaTitle: string;
  metaDescription: string;
  social: {
    linkedin: string;
    email: string;
  };
}

export interface HomeHighlight {
  label: string;
  value: string;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  positioning: string;
  highlights: HomeHighlight[];
  currentFocus: string[];
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
}

export interface ExternalLinkItem {
  title: string;
  url: string;
  source: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
}

export interface ContentBase {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  featured: boolean;
  tags: string[];
  coverImage?: string;
  body: string;
}

export interface BlogPost extends ContentBase {
  readingTime: string;
}

export interface Project extends ContentBase {
  timeline?: string;
  role?: string;
  tools: string[];
  impact: string[];
  externalLinks: Array<{ label: string; url: string }>;
}

export interface ResearchPost extends ContentBase {
  type?: string;
  status?: string;
  methods: string[];
  timeline?: string;
  impact: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  details?: string;
}

export interface HonorItem {
  title: string;
  year?: string;
  organization?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  description: string;
  order?: number;
}
