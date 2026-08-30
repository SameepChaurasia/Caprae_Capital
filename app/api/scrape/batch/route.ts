import { NextRequest, NextResponse } from 'next/server';
import { scrapeDomain } from '@/lib/scraper';
import { scoreLead } from '@/lib/scoring';
import { addOrUpdateLead, getCachedLead } from '@/lib/dataStore';
import { globalBatchRateLimiter } from '@/lib/rateLimiter';
import { Lead } from '@/types';

/**
 * Enterprise Bounded Concurrent Batch Scraper
 * Uses Promise.allSettled to process multiple domains concurrently within
 * serverless execution budget (under 5 seconds total).
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Rate Limiting Guard
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateCheck = globalBatchRateLimiter.tryConsume(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Batch rate limit exceeded. Please wait before launching another batch.',
          retryAfterMs: rateCheck.retryAfterMs
        },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) }
        }
      );
    }

    // 2. Parse & Deduplicate URLs
    const body = await req.json();
    const { urls } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Array of URLs is required for batch scraping.' }, { status: 400 });
    }

    // Deduplicate and cap to 8 concurrent targets per batch to stay well within timeout limits
    const sanitizedUrls = Array.from(
      new Set(
        urls
          .filter((u) => typeof u === 'string' && u.trim().length > 0)
          .map((u) => u.trim())
      )
    ).slice(0, 8);

    if (sanitizedUrls.length === 0) {
      return NextResponse.json({ error: 'No valid URLs provided in batch list.' }, { status: 400 });
    }

    // 3. Concurrent Execution with Promise.allSettled
    const settlementResults = await Promise.allSettled(
      sanitizedUrls.map(async (rawUrl): Promise<Lead> => {
        const cleanDomain = rawUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

        // Cache hit
        const cached = getCachedLead(cleanDomain);
        if (cached) {
          return cached;
        }

        // Live scrape
        const lead = await scrapeDomain(rawUrl);
        const scoring = scoreLead(lead);
        lead.score = scoring.score;
        lead.scoreBreakdown = scoring.breakdown;
        lead.aiInsights = scoring.aiInsights;

        addOrUpdateLead(lead);
        return lead;
      })
    );

    const successfulLeads: Lead[] = [];
    const failedUrls: { url: string; reason: string }[] = [];

    settlementResults.forEach((result, idx) => {
      const url = sanitizedUrls[idx];
      if (result.status === 'fulfilled') {
        successfulLeads.push(result.value);
      } else {
        failedUrls.push({
          url,
          reason: result.reason?.message || 'Scrape execution failed'
        });
      }
    });

    const elapsedMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      processedCount: successfulLeads.length,
      failedCount: failedUrls.length,
      elapsedMs,
      leads: successfulLeads,
      failedDetails: failedUrls,
      message: `Batch completed: ${successfulLeads.length} succeeded, ${failedUrls.length} failed in ${elapsedMs}ms.`
    });
  } catch (err: any) {
    console.error('[Batch Scraper Error]:', err);
    return NextResponse.json(
      { error: 'Batch scrape pipeline encountered an unexpected failure.', message: err.message },
      { status: 500 }
    );
  }
}
