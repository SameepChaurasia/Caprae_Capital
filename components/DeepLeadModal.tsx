'use client';

import React from 'react';
import { X, ShieldCheck, Cpu, Target, Award, ExternalLink } from 'lucide-react';
import { Lead } from '@/types';

interface DeepLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeepLeadModal: React.FC<DeepLeadModalProps> = ({ lead, isOpen, onClose }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-modal">
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-slate-950/40">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-1">
              ACCOUNT INTELLIGENCE DOSSIER
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              {lead.name}
              <a
                href={lead.website || `https://${lead.domain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-cyan-300 font-mono inline-flex items-center gap-1 font-normal"
              >
                ({lead.domain}) <ExternalLink className="w-3 h-3" />
              </a>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{lead.industry}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* Top Score Banner */}
          <div className="bg-slate-950/80 border border-white/10 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Caprae AI Fit Score</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                {lead.growthRate} Growth Velocity • {lead.arrRange}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {lead.score}/100
            </div>
          </div>

          {/* Grid Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/50 border border-white/10 p-3.5 rounded-xl">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multi-Vector ICP Fit</span>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">ICP Vertical Fit:</span>
                  <strong className="text-white font-mono">{lead.scoreBreakdown?.icpFit || 94}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Growth Velocity:</span>
                  <strong className="text-white font-mono">{lead.scoreBreakdown?.growthSignal || 88}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">M&A Scale Potential:</span>
                  <strong className="text-white font-mono">{lead.scoreBreakdown?.maPotential || 92}%</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-white/10 p-3.5 rounded-xl">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Decision Maker Profile</span>
              </div>
              <div className="text-xs font-bold text-white">{lead.decisionMaker?.name}</div>
              <div className="text-[11px] text-slate-400">{lead.decisionMaker?.title}</div>
              <div className="text-[11px] font-mono text-cyan-400 mt-1">{lead.decisionMaker?.email}</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{lead.decisionMaker?.emailStatus}</span>
              </div>
            </div>
          </div>

          {/* Strategic Rationale */}
          <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
            <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Caprae 7-Year Strategic Rationale</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {lead.aiInsights || 'Identified as a high-synergy target with exceptional tech foundations ready for post-acquisition automated outbound scaling and SaaS acceleration.'}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Detected Frameworks & Infrastructure</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lead.techStack.map((t) => (
                <span key={t} className="px-2.5 py-1 text-xs font-mono text-slate-300 bg-white/5 border border-white/10 rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
