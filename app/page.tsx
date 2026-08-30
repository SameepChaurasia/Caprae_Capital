'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { Lead, HealthTelemetry, ScoringWeights } from '@/types';
import { Navbar } from '@/components/Navbar';
import { MetricsRibbon } from '@/components/MetricsRibbon';
import { ScraperConsole } from '@/components/ScraperConsole';
import { LeadsTable } from '@/components/LeadsTable';
import { LeadsCardGrid } from '@/components/LeadsCardGrid';
import { OutreachModal } from '@/components/OutreachModal';
import { DeepLeadModal } from '@/components/DeepLeadModal';
import { ArchitectureModal } from '@/components/ArchitectureModal';
import { WeightsModal } from '@/components/WeightsModal';
import { BatchModal } from '@/components/BatchModal';
import { Toast } from '@/components/Toast';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [health, setHealth] = useState<HealthTelemetry | null>(null);
  const [weights, setWeights] = useState<ScoringWeights>({
    techWeight: 25,
    verticalWeight: 25,
    growthWeight: 25,
    sizeWeight: 25,
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Loading States
  const [isScraping, setIsScraping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Modal States
  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);
  const [deepLead, setDeepLead] = useState<Lead | null>(null);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isWeightsOpen, setIsWeightsOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Trigger Toast Notification
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial leads and health
  const fetchData = async () => {
    try {
      const [leadsRes, healthRes, weightsRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/health'),
        fetch('/api/weights'),
      ]);

      const leadsJson = await leadsRes.json();
      const healthJson = await healthRes.json();
      const weightsJson = await weightsRes.json();

      if (leadsJson.leads) setLeads(leadsJson.leads);
      if (healthJson.status) setHealth(healthJson);
      if (weightsJson.techWeight) setWeights(weightsJson);
    } catch (e) {
      console.error('Error fetching initial data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSearch =
        !s ||
        (lead.name && lead.name.toLowerCase().includes(s)) ||
        (lead.domain && lead.domain.toLowerCase().includes(s)) ||
        (lead.industry && lead.industry.toLowerCase().includes(s)) ||
        (lead.techStack && lead.techStack.some((t) => t.toLowerCase().includes(s))) ||
        (lead.decisionMaker && lead.decisionMaker.name.toLowerCase().includes(s));

      const matchesIndustry =
        industryFilter === 'All' ||
        (lead.industry && lead.industry.toLowerCase().includes(industryFilter.toLowerCase()));

      const matchesScore = scoreFilter === 0 || lead.score >= scoreFilter;

      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

      return matchesSearch && matchesIndustry && matchesScore && matchesStatus;
    });
  }, [leads, searchTerm, industryFilter, scoreFilter, statusFilter]);

  // Handler: Single Domain Scrape
  const handleScrape = async (url: string) => {
    setIsScraping(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (res.ok && data.lead) {
        showToast(data.message || `Scraped & enriched ${data.lead.name}`);
        fetchData();
      } else {
        throw new Error(data.error || 'Scraping failed');
      }
    } catch (err: any) {
      showToast(err.message || 'Scrape failed', 'error');
    } finally {
      setIsScraping(false);
    }
  };

  // Handler: Batch Scrape
  const handleBatchScrape = async (urls: string[]) => {
    try {
      const res = await fetch('/api/scrape/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `Batch processed ${data.processedCount} domains`);
        fetchData();
      } else {
        throw new Error(data.error || 'Batch scrape failed');
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // Handler: Lead Enrichment
  const handleEnrich = async (leadId: string) => {
    try {
      const res = await fetch(`/api/enrich/${leadId}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Lead verified with DNS & deep stack enrichment');
        fetchData();
      }
    } catch {
      showToast('Enrichment request failed', 'error');
    }
  };

  // Handler: Update Scoring Weights
  const handleSaveWeights = async (newWeights: ScoringWeights) => {
    try {
      const res = await fetch('/api/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWeights),
      });
      const data = await res.json();
      if (res.ok) {
        setWeights(data.weights);
        showToast('Scoring weights updated! Recomputed all lead scores.');
        fetchData();
      }
    } catch {
      showToast('Failed to update weights', 'error');
    }
  };

  // Handler: Export CSV
  const handleExport = (format: string) => {
    window.location.href = `/api/export?format=${format}`;
    showToast(`Streaming ${format.toUpperCase()} dataset export...`);
  };

  // Handler: CRM Sync
  const handleSyncCrm = async () => {
    try {
      const res = await fetch('/api/sync/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crmPlatform: 'HubSpot & Salesforce' }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
      }
    } catch {
      showToast('CRM Sync failed', 'error');
    }
  };

  // Handler: Outreach Dispatched
  const handleDispatchOutreach = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Outreach Generated' } : l))
    );
    showToast('Outreach sequence generated and dispatched to queue');
  };

  return (
    <main className="relative z-10 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* 1. Header Navigation Bar */}
      <Navbar
        health={health}
        onOpenWeights={() => setIsWeightsOpen(true)}
        onOpenBatch={() => setIsBatchOpen(true)}
        onOpenArch={() => setIsArchOpen(true)}
        onExport={handleExport}
        onSyncCrm={handleSyncCrm}
      />

      {/* 2. Key Metrics Ribbon */}
      <MetricsRibbon leads={leads} />

      {/* 3. Live Scraper Console */}
      <ScraperConsole onScrape={handleScrape} isLoading={isScraping} />

      {/* 4. Controls & Filters Ribbon */}
      <div className="w-full glass-panel rounded-2xl p-3 sm:p-4 border border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-lg">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies, tech stack, founder..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-white/10 focus:border-cyan-400 rounded-xl text-xs text-white focus:outline-none placeholder:text-slate-500 transition"
            />
          </div>

          {/* Industry Filter */}
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-slate-950/80 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer hover:border-white/20 transition"
          >
            <option value="All">All Industries</option>
            <option value="SaaS">B2B SaaS / DevOps</option>
            <option value="FinTech">FinTech & Payments</option>
            <option value="AI">AI & Analytics</option>
            <option value="Health">HealthTech / Clinical</option>
            <option value="Security">Cybersecurity</option>
            <option value="Logistics">Supply Chain</option>
          </select>

          {/* Score Filter */}
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(Number(e.target.value))}
            className="bg-slate-950/80 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer hover:border-white/20 transition"
          >
            <option value={0}>All AI Scores</option>
            <option value={90}>High Match (90+)</option>
            <option value={80}>Strong Match (80+)</option>
            <option value={70}>Moderate Match (70+)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer hover:border-white/20 transition"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Enriched">Enriched</option>
            <option value="Outreach Generated">Outreach Generated</option>
            <option value="Contacted">Contacted</option>
          </select>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
          <button
            onClick={handleSyncCrm}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition active:scale-95 whitespace-nowrap"
          >
            CRM Sync
          </button>

          <div className="flex items-center bg-slate-950/80 border border-white/10 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
            {filteredLeads.length} Lead{filteredLeads.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* 5. Lead Presentation View */}
      {viewMode === 'table' ? (
        <LeadsTable
          leads={filteredLeads}
          onOpenOutreach={(lead) => setOutreachLead(lead)}
          onEnrich={handleEnrich}
          onDeepView={(lead) => setDeepLead(lead)}
        />
      ) : (
        <LeadsCardGrid
          leads={filteredLeads}
          onOpenOutreach={(lead) => setOutreachLead(lead)}
          onDeepView={(lead) => setDeepLead(lead)}
        />
      )}

      {/* 6. Modals */}
      <OutreachModal
        lead={outreachLead}
        isOpen={!!outreachLead}
        onClose={() => setOutreachLead(null)}
        onDispatch={handleDispatchOutreach}
      />

      <DeepLeadModal
        lead={deepLead}
        isOpen={!!deepLead}
        onClose={() => setDeepLead(null)}
      />

      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      <WeightsModal
        isOpen={isWeightsOpen}
        onClose={() => setIsWeightsOpen(false)}
        onSave={handleSaveWeights}
        currentWeights={weights}
      />

      <BatchModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        onBatchScrape={handleBatchScrape}
      />

      {/* 7. Toast Alerts */}
      <Toast message={toastMessage} type={toastType} />

      {/* 8. Footer */}
      <footer className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>Caprae Capital Partners • Engineering & AI Readiness Pre-Work Challenge</div>
        <div>Caprae_LeadGenius_AI_By_Sameep_Chaurasia • Built with Next.js 14, TypeScript, TailwindCSS, Cheerio & Prisma</div>
      </footer>
    </main>
  );
}
