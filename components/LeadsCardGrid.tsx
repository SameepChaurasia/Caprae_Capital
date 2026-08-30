'use client';

import React from 'react';
import { Star, Sparkles, Eye, ExternalLink } from 'lucide-react';
import { Lead } from '@/types';

interface LeadsCardGridProps {
  leads: Lead[];
  onOpenOutreach: (lead: Lead) => void;
  onDeepView: (lead: Lead) => void;
}

export const LeadsCardGrid: React.FC<LeadsCardGridProps> = ({
  leads,
  onOpenOutreach,
  onDeepView,
}) => {
  if (leads.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-card border border-border rounded-2xl">
        No matching target leads found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {leads.map((lead) => {
        const scoreColor =
          lead.score >= 90
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            : lead.score >= 80
            ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
            : 'bg-amber-500/15 text-amber-400 border-amber-500/30';

        return (
          <div
            key={lead.id}
            className="bg-card backdrop-blur-xl border border-border rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-1 hover:border-indigo-500/40 transition duration-200 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center font-bold text-cyan-400">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{lead.name}</h3>
                  <a
                    href={lead.website || `https://${lead.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-cyan-400 font-mono flex items-center gap-1"
                  >
                    {lead.domain} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${scoreColor}`}>
                <Star className="w-3 h-3 fill-current" />
                {lead.score}/100
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2 text-xs text-slate-300 border-y border-white/5 py-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Industry:</span>
                <span className="font-semibold text-white">{lead.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ARR & Team:</span>
                <span>{lead.arrRange || '$2M - $5M'} ({lead.employees || 25} emp)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-medium text-cyan-300">{lead.decisionMaker?.name}</span>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5 block">
                Detected Stack:
              </span>
              <div className="flex flex-wrap gap-1">
                {lead.techStack.slice(0, 4).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-white/5">
              <button
                onClick={() => onDeepView(lead)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>

              <button
                onClick={() => onOpenOutreach(lead)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-glow transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Outreach</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
