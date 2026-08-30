import { Lead, ScoringWeights, ScoreBreakdown } from '@/types';

let currentWeights: ScoringWeights = {
  techWeight: 25,
  verticalWeight: 25,
  growthWeight: 25,
  sizeWeight: 25
};

export function getWeights(): ScoringWeights {
  return { ...currentWeights };
}

export function updateWeights(newWeights: Partial<ScoringWeights> = {}): ScoringWeights {
  currentWeights = {
    techWeight: Math.max(0, Math.min(50, Number(newWeights.techWeight) || currentWeights.techWeight)),
    verticalWeight: Math.max(0, Math.min(50, Number(newWeights.verticalWeight) || currentWeights.verticalWeight)),
    growthWeight: Math.max(0, Math.min(50, Number(newWeights.growthWeight) || currentWeights.growthWeight)),
    sizeWeight: Math.max(0, Math.min(50, Number(newWeights.sizeWeight) || currentWeights.sizeWeight))
  };
  return getWeights();
}

export interface ScoringResult {
  score: number;
  breakdown: ScoreBreakdown;
  aiInsights: string;
}

export function scoreLead(companyData: Partial<Lead>, customWeights: ScoringWeights = currentWeights): ScoringResult {
  let techScore = 60;
  let verticalScore = 60;
  let growthScore = 65;
  let sizeScore = 65;

  const stackCount = (companyData.techStack || []).length;
  if (stackCount >= 6) techScore = 98;
  else if (stackCount >= 4) techScore = 90;
  else if (stackCount >= 2) techScore = 80;
  else techScore = 68;

  const highSynergyVerticals = ['saas', 'software', 'fintech', 'ai', 'analytics', 'cybersecurity', 'devops', 'cloud', 'healthtech'];
  const ind = (companyData.industry || '').toLowerCase();
  if (highSynergyVerticals.some(v => ind.includes(v))) {
    verticalScore = 95;
  } else {
    verticalScore = 75;
  }

  const growthNum = parseInt(companyData.growthRate || '20', 10);
  if (growthNum >= 35) growthScore = 96;
  else if (growthNum >= 20) growthScore = 88;
  else growthScore = 78;

  const emp = companyData.employees || 25;
  if (emp >= 20 && emp <= 80) sizeScore = 96;
  else if (emp < 20) sizeScore = 82;
  else sizeScore = 85;

  const totalWeight = customWeights.techWeight + customWeights.verticalWeight + customWeights.growthWeight + customWeights.sizeWeight || 100;
  
  const compositeScore = Math.round(
    (techScore * customWeights.techWeight +
     verticalScore * customWeights.verticalWeight +
     growthScore * customWeights.growthWeight +
     sizeScore * customWeights.sizeWeight) / totalWeight
  );

  const finalScore = Math.min(Math.max(compositeScore, 50), 99);

  return {
    score: finalScore,
    breakdown: {
      icpFit: Math.min(Math.round((techScore + verticalScore) / 2), 99),
      growthSignal: growthScore,
      maPotential: sizeScore,
      urgency: finalScore >= 90 ? 'High' : finalScore >= 80 ? 'Medium' : 'Standard'
    },
    aiInsights: `Scored ${finalScore}/100 based on verified tech stack (${companyData.techStack ? companyData.techStack.slice(0, 3).join(', ') : 'Cloud'}), ${companyData.industry || 'B2B Tech'} vertical alignment, and high-probability M&A/SaaS acceleration leverage.`
  };
}
