import { Lead } from '@/types';

export function generateStandardCsv(leads: Lead[]): string {
  const headers = [
    'ID', 'Company Name', 'Domain', 'Industry', 'ARR Range', 'Employees', 
    'ICP Score', 'Decision Maker Name', 'Decision Maker Title', 'Decision Maker Email', 
    'Email Deliverability Status', 'Tech Stack', 'Status'
  ];

  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${l.domain}"`,
    `"${l.industry}"`,
    `"${l.arrRange || 'N/A'}"`,
    `"${l.employees || 'N/A'}"`,
    `"${l.score}"`,
    `"${l.decisionMaker ? (l.decisionMaker.name || '').replace(/"/g, '""') : 'N/A'}"`,
    `"${l.decisionMaker ? (l.decisionMaker.title || '').replace(/"/g, '""') : 'N/A'}"`,
    `"${l.decisionMaker ? l.decisionMaker.email : 'N/A'}"`,
    `"${l.decisionMaker ? l.decisionMaker.emailStatus : 'N/A'}"`,
    `"${(l.techStack || []).join('; ')}"`,
    `"${l.status}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function generateApolloCsv(leads: Lead[]): string {
  const headers = [
    'First Name', 'Last Name', 'Title', 'Company', 'Company Domain', 
    'Email', 'Email Status', 'Industry', 'Employees', 'Keywords', 'Technologies'
  ];

  const rows = leads.map(l => {
    const names = (l.decisionMaker ? l.decisionMaker.name : 'Founder').split(' ');
    const first = names[0] || '';
    const last = names.slice(1).join(' ') || '';

    return [
      `"${first}"`,
      `"${last}"`,
      `"${l.decisionMaker ? l.decisionMaker.title : 'Executive'}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.domain}"`,
      `"${l.decisionMaker ? l.decisionMaker.email : ''}"`,
      `"${l.decisionMaker ? l.decisionMaker.emailStatus : 'Verified'}"`,
      `"${l.industry}"`,
      `"${l.employees || 25}"`,
      `"Caprae AI Qualified; Score: ${l.score}"`,
      `"${(l.techStack || []).join('; ')}"`
    ];
  });

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function generateInstantlyCsv(leads: Lead[]): string {
  const headers = [
    'email', 'first_name', 'last_name', 'company_name', 'website', 
    'custom_tech_stack', 'custom_icp_score', 'custom_industry'
  ];

  const rows = leads.map(l => {
    const names = (l.decisionMaker ? l.decisionMaker.name : 'Leader').split(' ');
    const first = names[0] || '';
    const last = names.slice(1).join(' ') || '';

    return [
      `"${l.decisionMaker ? l.decisionMaker.email : ''}"`,
      `"${first}"`,
      `"${last}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.website || 'https://' + l.domain}"`,
      `"${(l.techStack || []).slice(0, 3).join(', ')}"`,
      `"${l.score}"`,
      `"${l.industry}"`
    ];
  });

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
