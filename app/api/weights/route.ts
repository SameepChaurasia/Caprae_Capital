import { NextRequest, NextResponse } from 'next/server';
import { getWeights, updateWeights, scoreLead } from '@/lib/scoring';
import { getAllLeads, addOrUpdateLead } from '@/lib/dataStore';

export async function GET() {
  return NextResponse.json(getWeights());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateWeights(body);

    const leads = getAllLeads();
    leads.forEach(l => {
      const sc = scoreLead(l, updated);
      l.score = sc.score;
      l.scoreBreakdown = sc.breakdown;
      l.aiInsights = sc.aiInsights;
      addOrUpdateLead(l);
    });

    return NextResponse.json({
      success: true,
      weights: updated,
      message: 'Scoring weights updated and all lead scores recomputed live.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update weights', message: err.message }, { status: 500 });
  }
}
