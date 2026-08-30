import { NextRequest, NextResponse } from 'next/server';
import { findLeadById, addOrUpdateLead } from '@/lib/dataStore';
import { generateOutreach } from '@/lib/outreach';

export async function POST(req: NextRequest) {
  try {
    const { leadId, leadData, campaignType = 'Caprae M&A / Growth Acceleration' } = await req.json();
    
    let target = leadData;
    if (!target && leadId) {
      target = findLeadById(leadId);
    }

    if (!target) {
      return NextResponse.json({ error: 'Target lead data or valid ID is required.' }, { status: 404 });
    }

    const payload = generateOutreach(target, campaignType);

    target.status = 'Outreach Generated';
    addOrUpdateLead(target);

    return NextResponse.json({
      success: true,
      ...payload
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate outreach', message: err.message }, { status: 500 });
  }
}
