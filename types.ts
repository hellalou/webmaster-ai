
export interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired';
  expiryDate: string;
  autoRenew: boolean;
}

export interface HostingDeployment {
  id: string;
  environment: 'production' | 'staging';
  status: 'success' | 'building' | 'failed';
  timestamp: string;
  commit: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'scheduled' | 'draft';
  scheduledDate?: string;
  author: string;
}

export interface SitePage {
  id: string;
  path: string;
  priority: number;
  lastModified: string;
  metaDescription?: string;
  titleTag?: string;
}

export interface SiteTemplate {
  id: string;
  name: string;
  category: 'Portfolio' | 'Business' | 'Blog' | 'E-commerce';
  description: string;
  image: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}

export interface SearchMetric {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface TopQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: string | number;
  position: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume: string;
  difficulty: 'Low' | 'Medium' | 'High';
  intent: 'Informational' | 'Transactional' | 'Navigational' | 'Commercial';
  strategy: string;
}

export interface ContentBrief {
  keyword: string;
  audience: string;
  proposedHeadline: string;
  talkingPoints: string[];
  internalLinking: string[];
}

// Block Builder Types
export type BlockType = 'hero' | 'text' | 'features' | 'cta' | 'gallery' | 'spacer';

export interface BuilderBlock {
  id: string;
  type: BlockType;
  content: {
    title?: string;
    body?: string;
    buttonText?: string;
    imageUrl?: string;
    items?: string[];
  };
  styles: {
    padding: 'sm' | 'md' | 'lg';
    theme: 'dark' | 'azure' | 'light' | 'custom';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    fontSizeTitle?: number;
    fontSizeBody?: number;
    fontWeightTitle?: 'normal' | 'bold';
    fontStyleBody?: 'normal' | 'italic';
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
  };
}

export type AppView = 'analysis' | 'builder' | 'content-ai' | 'blog' | 'domains' | 'hosting' | 'seo' | 'templates';
