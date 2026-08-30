export interface DecisionMaker {
  name: string;
  title: string;
  email: string;
  emailStatus: string;
  linkedin?: string;
}

export interface ScoreBreakdown {
  icpFit: number;
  growthSignal: number;
  maPotential: number;
  urgency: 'High' | 'Medium' | 'Standard';
}

export type LeadStatus = 'New' | 'Enriched' | 'Outreach Generated' | 'Contacted' | 'Converted' | 'Synthetic Fallback';

export interface Lead {
  id: string;
  name: string;
  domain: string;
  website?: string;
  industry: string;
  location?: string;
  arrRange?: string;
  employees?: number;
  growthRate?: string;
  techStack: string[];
  decisionMaker: DecisionMaker;
  score: number;
  scoreBreakdown?: ScoreBreakdown;
  aiInsights?: string;
  metaDescription?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string | null;
  };
  status: LeadStatus;
  createdDate?: string;
  isSynthetic?: boolean;
  scrapeConfidence?: 'VERIFIED_DOM' | 'HIGH_CONFIDENCE' | 'SYNTHETIC_FALLBACK';
  dnsMxValid?: boolean;
  lastScrapedAt?: string;
}

export interface ScoringWeights {
  techWeight: number;
  verticalWeight: number;
  growthWeight: number;
  sizeWeight: number;
}

export interface OutreachContent {
  coldEmail: {
    subject: string;
    body: string;
  };
  inmailPitch: string;
  followUp: {
    subject: string;
    body: string;
  };
}

export interface OutreachPayload {
  leadId: string;
  company: string;
  campaignType: string;
  outreach: OutreachContent;
}

export interface HealthTelemetry {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  leadsCount: number;
  cacheEntries: number;
  memoryUsageMB: string;
  version: string;
}
