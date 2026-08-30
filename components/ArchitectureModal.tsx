'use client';

import React from 'react';
import { X, Server, Database, Layers, ShieldCheck } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-full mb-1">
              SYSTEM ARCHITECTURE & CLOUD SPECS
            </span>
            <h3 className="text-xl font-bold text-white">Full Stack Next.js + PostgreSQL + AWS Architecture</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production blueprint engineered for high-concurrency scraping, sub-50ms caching, and scalable AI inference.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid Body */}
        <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-950/60 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <Database className="w-4 h-4" />
              <h4>1. Data Storage & Schema (PostgreSQL 16)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Database:</strong> PostgreSQL 16 with Prisma ORM (Aurora Serverless / Supabase).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Entities:</strong> <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">Company</code>, <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">DecisionMaker</code>, and <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">OutreachCampaign</code>.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Indexing:</strong> B-Tree unique on <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">domain</code>, descending on <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">icpScore</code>, and GIN index on <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">techStack</code> for rapid tag lookups.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950/60 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-bold">
              <Layers className="w-4 h-4" />
              <h4>2. Caching & Throughput (Redis)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Caching:</strong> Redis (AWS ElastiCache) with 7-day TTL and LRU eviction for sub-50ms repeat scraping lookups.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Concurrency Queue:</strong> BullMQ async job processing with exponential backoff on HTTP 429/503 status codes.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Anti-Bot Evasion:</strong> Dynamic User-Agent header rotation, TLS fingerprint randomization, and proxy rotation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950/60 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <Server className="w-4 h-4" />
              <h4>3. Cloud Hosting & Deployment</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Edge / Frontend:</strong> Vercel Edge Network / AWS CloudFront delivering cached SSR assets globally with TLS 1.3.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Serverless & Containers:</strong> Next.js Serverless Route Handlers + Docker microservices on AWS ECS with Fargate auto-scaling.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>CI/CD:</strong> GitHub Actions running TypeScript typechecks, linting, and zero-downtime deployment.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-950/60 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <h4>4. Compliance & Rate Limiting</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Ethical Scraping:</strong> Token Bucket sliding-window rate limiter enforcing max 5 req/sec/domain, strictly honoring <code className="text-slate-200 font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded">robots.txt</code>.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Deliverability:</strong> DNS MX record lookup + RFC 5322 email syntax validation to prevent honeypots.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Security:</strong> HMAC-SHA256 signature verification for outgoing CRM webhook payloads.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition">
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
