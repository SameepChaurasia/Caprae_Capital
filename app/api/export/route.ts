import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/dataStore';
import { generateStandardCsv, generateApolloCsv, generateInstantlyCsv } from '@/lib/export';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'standard';
  const leads = getAllLeads();

  if (!leads.length) {
    return new NextResponse('No leads to export.', { status: 400 });
  }

  let csvContent = '';
  let filename = 'caprae_leadgenius_export.csv';

  if (format === 'apollo') {
    csvContent = generateApolloCsv(leads);
    filename = 'caprae_apollo_ready_export.csv';
  } else if (format === 'instantly') {
    csvContent = generateInstantlyCsv(leads);
    filename = 'caprae_instantly_campaign_export.csv';
  } else {
    csvContent = generateStandardCsv(leads);
    filename = 'caprae_standard_leads_export.csv';
  }

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
