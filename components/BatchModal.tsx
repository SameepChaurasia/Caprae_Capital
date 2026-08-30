'use client';

import React, { useState } from 'react';
import { X, Database } from 'lucide-react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchScrape: (urls: string[]) => Promise<void>;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  onBatchScrape,
}) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = text
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    setIsProcessing(true);
    try {
      await onBatchScrape(urls);
      setText('');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-full mb-1">
              BATCH SCRAPING PIPELINE
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Bulk Domain Ingestion & Enrichment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste target domains (one per line or comma-separated) to scrape concurrently.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Target Domain List:</label>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="figma.com&#10;retool.com&#10;loom.com&#10;notion.so&#10;vercel.com"
              required
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            <span className="text-[11px] text-slate-500">
              Concurrency throttled to max 10 domains per batch with Token Bucket rate limiting.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 rounded-xl shadow-glow transition disabled:opacity-50"
            >
              {isProcessing ? 'Processing Batch...' : 'Start Batch Extraction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
