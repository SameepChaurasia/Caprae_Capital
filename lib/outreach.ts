import { Lead, OutreachPayload } from '@/types';

export function generateOutreach(targetLead: Lead, campaignType: string = 'Caprae M&A / Growth Acceleration'): OutreachPayload {
  if (!targetLead) {
    throw new Error('Target lead is required to generate outreach.');
  }

  const execName = targetLead.decisionMaker ? targetLead.decisionMaker.name.split(' ')[0] : 'there';
  const company = targetLead.name || targetLead.domain;
  const industry = targetLead.industry || 'B2B Tech';
  const topTech = (targetLead.techStack && targetLead.techStack.length > 0) 
    ? targetLead.techStack.slice(0, 2).join(' & ') 
    : 'modern cloud infrastructure';
  const growth = targetLead.growthRate || '+25% YoY';
  const arr = targetLead.arrRange || '$3M - $5M ARR';

  let coldEmail = { subject: '', body: '' };
  let inmailPitch = '';
  let followUp = { subject: '', body: '' };

  if (campaignType.includes('M&A') || campaignType.includes('Growth')) {
    coldEmail = {
      subject: `Strategic Scaling & 7-Year Growth Journey // ${company}`,
      body: `Hi ${execName},\n\nI’ve been tracking ${company}’s momentum in ${industry}—impressive trajectory at ${growth}.\n\nAt Caprae Capital, we take a different approach than traditional private equity. We don’t rely on financial engineering or short-term flips; we partner with founders on a 7-year operational value creation journey. We pair wartime operator horsepower with proprietary AI systems (SaaS and MaaS) to accelerate outbound revenue and scale infrastructure like your ${topTech} stack.\n\nAre you open to a brief 10-minute introductory conversation this Thursday or Friday to explore strategic growth alignment?\n\nBest regards,\nGrowth & Acquisition Team\nCaprae Capital Partners`
    };

    inmailPitch = `Hi ${execName} — Impressed by ${company}’s growth in ${industry}. We partner with high-horsepower founders to scale operational systems and AI pipeline engines post-acquisition. Would love to connect and share a few observations on scaling your ${topTech} workflows.`;

    followUp = {
      subject: `Quick bump: ${company} scaling initiatives`,
      body: `Hi ${execName},\n\nFollowing up on my note regarding ${company}. We recently deployed an automated AI outbound engine for a similar ${industry} company that increased pipeline velocity by 3.8x in under 90 days.\n\nWould 10 minutes next Tuesday work for a brief intro?\n\nBest,\nCaprae Capital`
    };
  } else if (campaignType.includes('MaaS') || campaignType.includes('Tech')) {
    coldEmail = {
      subject: `Optimizing ${topTech} architecture & outbound velocity for ${company}`,
      body: `Hi ${execName},\n\nSaw ${company} is running on ${topTech}. Scaling enterprise ${industry} products often hits a throughput bottleneck between legacy tooling and outbound sales velocity.\n\nOur MaaS (M&A as a Service) toolkits modernize infrastructure and automate high-ticket pipeline generation for companies in the ${arr} range.\n\nWould you be open to an interactive teardown of how AI pipelines could drive direct expansion for ${company}?\n\nCheers,\nOperational Tech Team`
    };

    inmailPitch = `Hi ${execName} — Love the architecture ${company} is building with ${topTech}. We build automated MaaS acceleration tooling for fast-growing ${industry} teams. Let’s connect!`;

    followUp = {
      subject: `Re: Architecture teardown for ${company}`,
      body: `Hi ${execName},\n\nWanted to ensure this didn’t get buried. Happy to share our technical teardown showing how automated leadgen workflows can reduce CAC by 40% for ${company}.\n\nBest,\nEngineering Operations`
    };
  } else {
    coldEmail = {
      subject: `Accelerating outbound pipeline for ${company}`,
      body: `Hi ${execName},\n\nSaw ${company}’s recent expansion in ${industry}. Building modern products on ${topTech} is tough without a predictable outbound pipeline.\n\nWe built an automated Lead Intelligence & Enrichment engine that qualifies high-intent accounts and generates hyper-personalized messaging at scale.\n\nWould you be open to seeing a 2-minute interactive teardown of accounts currently searching for solutions like ${company}?\n\nCheers,\nGrowth Operations Team`
    };

    inmailPitch = `Hi ${execName} — Impressed by what you’re building at ${company}. We built an AI outbound engine tailored for teams running ${topTech}. Let's connect!`;

    followUp = {
      subject: `Re: Pipeline velocity at ${company}`,
      body: `Hi ${execName},\n\nChecking back on this. Happy to send over our interactive lead intelligence report for ${company} if helpful.\n\nBest,\nOutbound Operations`
    };
  }

  return {
    leadId: targetLead.id,
    company: targetLead.name,
    campaignType,
    outreach: {
      coldEmail,
      inmailPitch,
      followUp
    }
  };
}
