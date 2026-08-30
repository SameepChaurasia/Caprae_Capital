'use client';

import React from 'react';
import { Star, Mail, Zap, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Lead } from '@/types';

interface LeadsTableProps {
  leads: Lead[];
  onOpenOutreach: (lead: Lead) => void;
  onEnrich: (leadId: string) => void;
  onDeepView: (lead: Lead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onOpenOutreach,
  onEnrich,
  onDeepView,
}) => {
  if (leads.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 glass-panel rounded-2xl border border-white/10 text-sm">
        No matching target leads found. Try a different search term or extract a new domain above.
      </div>
    );
  }

  return (
    <div className="w-full glass-panel rounded-2xl shadow-xl overflow-hidden border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-950/80 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Target Company</th>
              <th className="py-3.5 px-4">AI ICP Score</th>
              <th className="py-3.5 px-4">Industry & ARR</th>
              <th className="py-3.5 px-4">Detected Tech Stack</th>
              <th className="py-3.5 px-4">Verified Contact</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {leads.map((lead) => {
              const scoreColor =
                lead.score >= 90
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : lead.score >= 80
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30';

              const statusColor =
                lead.status === 'Enriched'
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  : lead.status === 'Outreach Generated'
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  : lead.status === 'Contacted'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';

              return (
                <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors duration-150 group">
                  {/* Company */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/25 to-cyan-500/25 border border-white/10 flex items-center justify-center font-bold text-cyan-400 shadow-sm shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {lead.name}
                        </div>
                        <a
                          href={lead.website || `https://${lead.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-slate-400 hover:text-cyan-400 font-mono flex items-center gap-1 transition-colors"
                        >
                          {lead.domain} <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${scoreColor}`}>
                      <Star className="w-3 h-3 fill-current" />
                      {lead.score}/100
                    </span>
                  </td>

                  {/* Industry & ARR */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-xs text-slate-200">{lead.industry}</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {lead.arrRange || '$2M - $5M'} • {lead.employees || 25} emp
                    </div>
                  </td>

                  {/* Tech Stack */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                      {lead.techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded">
                          {tech}
                        </span>
                      ))}
                      {lead.techStack.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 rounded">
                          +{lead.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Decision Maker */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-xs text-white">{lead.decisionMaker?.name || 'Key Contact'}</div>
                    <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-cyan-500" />
                      <span className="truncate max-w-[170px]">{lead.decisionMaker?.email}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColor}`}>
                      {lead.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenOutreach(lead)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-sm transition active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Outreach</span>
                      </button>

                      <button
                        onClick={() => onEnrich(lead.id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 border border-white/10 rounded-lg transition active:scale-95"
                        title="Enrich DNS & Deep Tech Stack"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeepView(lead)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 rounded-lg transition active:scale-95"
                        title="View Full Account Intelligence"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
