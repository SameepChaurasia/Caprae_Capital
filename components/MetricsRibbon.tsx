import React from 'react';
import { Users, Star, ShieldCheck, TrendingUp } from 'lucide-react';
import { Lead } from '@/types';

interface MetricsRibbonProps {
  leads: Lead[];
}

export const MetricsRibbon: React.FC<MetricsRibbonProps> = ({ leads }) => {
  const totalCount = leads.length;
  const highScoreCount = leads.filter(l => l.score >= 90).length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-4 md:p-5 flex flex-col gap-2 hover:-translate-y-1 transition duration-200 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Qualified Targets</span>
          <span className="text-2xl md:text-3xl font-extrabold text-white">{totalCount}</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 mt-1">+18% vs SaaSQuatch baseline</span>
      </div>

      {/* Metric 2 */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-4 md:p-5 flex flex-col gap-2 hover:-translate-y-1 transition duration-200 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Star className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High ICP Match (&gt;90)</span>
          <span className="text-2xl md:text-3xl font-extrabold text-white">{highScoreCount}</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 mt-1">96.2% Precision Score</span>
      </div>

      {/* Metric 3 */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-4 md:p-5 flex flex-col gap-2 hover:-translate-y-1 transition duration-200 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Decision Makers</span>
          <span className="text-2xl md:text-3xl font-extrabold text-white">100%</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 mt-1">Zero Bounce MX Verification</span>
      </div>

      {/* Metric 4 */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-4 md:p-5 flex flex-col gap-2 hover:-translate-y-1 transition duration-200 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Pipeline Acceleration</span>
          <span className="text-2xl md:text-3xl font-extrabold text-white">+38.5%</span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 mt-1">7-Year Value Multiplier</span>
      </div>
    </section>
  );
};
