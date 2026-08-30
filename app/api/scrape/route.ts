import { NextRequest, NextResponse } from 'next/server';
import { scrapeDomain } from '@/lib/scraper';
import { scoreLead } from '@/lib/scoring';
import { addOrUpdateLead, getCachedLead } from '@/lib/dataStore';
import { globalScrapeRateLimiter } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Guard (Token Bucket)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = globalScrapeRateLimiter.tryConsume(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please slow down your scraping requests.',
          retryAfterMs: rateCheck.retryAfterMs
        },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) }
        }
      );
    }

    // 2. Request Parsing & Validation
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL or domain string is required.' }, { status: 400 });
    }

    const cleanDomain = url.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    // 3. Fast Cache Lookup (Sub-50ms)
    const cached = getCachedLead(cleanDomain);
    if (cached) {
      return NextResponse.json({
        success: true,
        cached: true,
        lead: cached,
        message: `Retrieved ${cached.name} from sub-50ms accelerated cache.`
      });
    }

    // 4. Live Scrape Execution
    const lead = await scrapeDomain(url);

    // 5. Multi-Vector ICP Scoring
    const scoringResult = scoreLead(lead);
    lead.score = scoringResult.score;
    lead.scoreBreakdown = scoringResult.breakdown;
    lead.aiInsights = scoringResult.aiInsights;

    // 6. Persistence
    addOrUpdateLead(lead);

    return NextResponse.json({
      success: true,
      cached: false,
      lead,
      message: `Successfully extracted, fingerprinted (${lead.techStack.length} techs), and scored ${lead.name}.`
    });
  } catch (error: any) {
    const errorMsg = error?.message || 'Internal server error during scraping.';
    console.error('[API /api/scrape Error]:', errorMsg);

    const isSecurityError =
      errorMsg.includes('forbidden') ||
      errorMsg.includes('SSRF') ||
      errorMsg.includes('blocked') ||
      errorMsg.includes('private') ||
      errorMsg.includes('Forbidden protocol');

    const statusCode = isSecurityError ? 403 : 500;

    return NextResponse.json(
      {
        error: isSecurityError ? 'Security policy violation' : 'Failed to process website scraping.',
        message: errorMsg
      },
      { status: statusCode }
    );
  }
}
