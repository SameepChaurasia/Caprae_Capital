'use client';

import React, { useState, useEffect } from 'react';
import { X, Sliders, RefreshCw, Check } from 'lucide-react';
import { ScoringWeights } from '@/types';

interface WeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weights: ScoringWeights) => Promise<void>;
  currentWeights: ScoringWeights;
}

export const WeightsModal: React.FC<WeightsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentWeights,
}) => {
  const [techWeight, setTechWeight] = useState(25);
  const [verticalWeight, setVerticalWeight] = useState(25);
  const [growthWeight, setGrowthWeight] = useState(25);
  const [sizeWeight, setSizeWeight] = useState(25);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentWeights) {
      setTechWeight(currentWeights.techWeight);
      setVerticalWeight(currentWeights.verticalWeight);
      setGrowthWeight(currentWeights.growthWeight);
      setSizeWeight(currentWeights.sizeWeight);
    }
  }, [currentWeights]);

  if (!isOpen) return null;

  const totalSum = techWeight + verticalWeight + growthWeight + sizeWeight;

  const handleReset = () => {
    setTechWeight(25);
    setVerticalWeight(25);
    setGrowthWeight(25);
    setSizeWeight(25);
  };

  const handleApply = async () => {
    setIsSaving(true);
    try {
      await onSave({ techWeight, verticalWeight, growthWeight, sizeWeight });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-modal">
      <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-slate-950/40">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-1">
              DYNAMIC ICP ENGINE
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Customize AI Lead Scoring Criteria
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust weights. Lead scores will recompute live across all accounts.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="bg-slate-950/70 border border-white/10 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-white">
              <span>1. Tech Stack Sophistication (4+ Frameworks)</span>
              <span className="font-mono text-cyan-400 font-bold">{techWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={techWeight}
              onChange={(e) => setTechWeight(Number(e.target.value))}
            />
          </div>

          <div className="bg-slate-950/70 border border-white/10 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-white">
              <span>2. Vertical Alignment (B2B SaaS / FinTech / AI)</span>
              <span className="font-mono text-cyan-400 font-bold">{verticalWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={verticalWeight}
              onChange={(e) => setVerticalWeight(Number(e.target.value))}
            />
          </div>

          <div className="bg-slate-950/70 border border-white/10 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-white">
              <span>3. Growth Velocity Signal (&gt;25% YoY)</span>
              <span className="font-mono text-cyan-400 font-bold">{growthWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={growthWeight}
              onChange={(e) => setGrowthWeight(Number(e.target.value))}
            />
          </div>

          <div className="bg-slate-950/70 border border-white/10 p-3.5 rounded-xl flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold text-white">
              <span>4. Team Size Sweet Spot (20–80 Employees)</span>
              <span className="font-mono text-cyan-400 font-bold">{sizeWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={sizeWeight}
              onChange={(e) => setSizeWeight(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono px-1 text-slate-400">
            <span>Composite Weight Sum:</span>
            <span className={`font-bold ${totalSum === 100 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {totalSum}% (Normalized)
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex justify-end gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleApply}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Recomputing...' : 'Apply & Recompute Scores'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
