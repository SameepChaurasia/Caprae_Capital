'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Sliders, Database, Download, CheckCircle2, ChevronDown } from 'lucide-react';
import { HealthTelemetry } from '@/types';

interface NavbarProps {
  health: HealthTelemetry | null;
  onOpenWeights: () => void;
  onOpenBatch: () => void;
  onOpenArch: () => void;
  onExport: (format: string) => void;
  onSyncCrm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  onOpenWeights,
  onOpenBatch,
  onOpenArch,
  onExport,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExportOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-5 glass-panel rounded-2xl shadow-xl relative z-30 min-h-fit">
      {/* Left: Brand Identity & Subtitle */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-cyan-500/25 to-indigo-500/35 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0">
          <Layers className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            CAPRAE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">LeadGenius AI</span>
          </h1>
          <p className="text-[11px] md:text-xs text-slate-400 font-medium">Operator Lead Intelligence & 7-Year Value Creation</p>
        </div>
      </div>

      {/* Right Actions: Clean Flex Wrap with Perfect Spacing */}
      <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end w-full md:w-auto">
        <button
          onClick={onOpenWeights}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl transition duration-150 active:scale-95 whitespace-nowrap"
          title="Adjust AI ICP Scoring Weights"
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>ICP Weights</span>
        </button>

        <button
          onClick={onOpenBatch}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl transition duration-150 active:scale-95 whitespace-nowrap"
          title="Bulk Domain Scraping"
        >
          <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>Batch Ingest</span>
        </button>

        <button
          onClick={onOpenArch}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl transition duration-150 active:scale-95 whitespace-nowrap"
          title="View PostgreSQL, Redis & AWS System Design"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Architecture</span>
        </button>

        {/* Multi-Format Export Dropdown */}
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition duration-150 active:scale-95 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Export Leads</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 shrink-0 ${exportOpen ? 'rotate-180' : ''}`} />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-modal">
              <button
                onClick={() => { onExport('standard'); setExportOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/30 hover:text-cyan-300 rounded-lg transition flex items-center justify-between"
              >
                <span>Standard Leads CSV</span>
                <span className="text-[10px] text-slate-500 font-mono">.csv</span>
              </button>
              <button
                onClick={() => { onExport('apollo'); setExportOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/30 hover:text-cyan-300 rounded-lg transition flex items-center justify-between"
              >
                <span>Apollo.io Ready CSV</span>
                <span className="text-[10px] text-slate-500 font-mono">.csv</span>
              </button>
              <button
                onClick={() => { onExport('instantly'); setExportOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/30 hover:text-cyan-300 rounded-lg transition flex items-center justify-between"
              >
                <span>Instantly.ai Campaign CSV</span>
                <span className="text-[10px] text-slate-500 font-mono">.csv</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
