import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads } from '@/lib/dataStore';
import { Lead } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const industry = searchParams.get('industry') || 'All';
    const minScore = parseInt(searchParams.get('minScore') || '0', 10);
    const status = searchParams.get('status') || 'All';
    const sortBy = searchParams.get('sortBy') || 'date';

    let results: Lead[] = [...getAllLeads()];

    if (search) {
      results = results.filter(lead => 
        (lead.name && lead.name.toLowerCase().includes(search)) ||
        (lead.domain && lead.domain.toLowerCase().includes(search)) ||
        (lead.industry && lead.industry.toLowerCase().includes(search)) ||
        (lead.techStack && lead.techStack.some(t => t.toLowerCase().includes(search))) ||
        (lead.decisionMaker && lead.decisionMaker.name.toLowerCase().includes(search))
      );
    }

    if (industry && industry !== 'All') {
      results = results.filter(lead => 
        lead.industry && lead.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    if (minScore > 0) {
      results = results.filter(lead => lead.score >= minScore);
    }

    if (status && status !== 'All') {
      results = results.filter(lead => lead.status === status);
    }

    if (sortBy === 'score_desc') {
      results.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'score_asc') {
      results.sort((a, b) => a.score - b.score);
    } else if (sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      results.sort((a, b) => (b.createdDate || '').localeCompare(a.createdDate || ''));
    }

    return NextResponse.json({
      success: true,
      total: getAllLeads().length,
      matched: results.length,
      leads: results
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve leads', message: err.message }, { status: 500 });
  }
}
