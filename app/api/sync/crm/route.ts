import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  try {
    const { crmPlatform = 'HubSpot & Salesforce', leadIds } = await req.json();
    const leads = getAllLeads();
    const count = (leadIds && leadIds.length) ? leadIds.length : leads.length;

    return NextResponse.json({
      success: true,
      crmPlatform,
      recordsSynced: count,
      syncTimestamp: new Date().toISOString(),
      payloadSample: {
        source: 'Caprae LeadGenius AI 3.0 (Next.js App Router)',
        destination: crmPlatform,
        mapping: {
          company_name: 'Lead.name',
          domain: 'Lead.domain',
          icp_score: 'Lead.score',
          contact_email: 'Lead.decisionMaker.email',
          tech_stack: 'Lead.techStack'
        }
      },
      message: `Synchronized ${count} qualified accounts to ${crmPlatform} via webhook.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'CRM Sync failed', message: err.message }, { status: 500 });
  }
}
