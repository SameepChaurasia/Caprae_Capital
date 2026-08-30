import { NextResponse } from 'next/server';
import { getAllLeads, lruCacheStore, getCacheStats } from '@/lib/dataStore';
import { getWeights } from '@/lib/scoring';

export async function GET() {
  const leads = getAllLeads();
  const stats = getCacheStats();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    leadsCount: leads.length,
    cacheEntries: lruCacheStore.size,
    memoryUsageMB: stats.heapUsedMB,
    scoringWeights: getWeights(),
    framework: 'Next.js 14 (App Router) + TypeScript',
    version: '3.1.0-caprae-production'
  });
}
