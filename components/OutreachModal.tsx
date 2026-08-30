'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, Copy, Check, MessageSquare, Clock, X, Sparkles } from 'lucide-react';
import { Lead, OutreachPayload } from '@/types';

interface OutreachModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (leadId: string) => void;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  lead,
  isOpen,
  onClose,
  onDispatch,
}) => {
  const [campaign, setCampaign] = useState('Caprae M&A / Growth Acceleration');
  const [activeTab, setActiveTab] = useState<'cold' | 'linkedin' | 'followup'>('cold');
  const [outreachData, setOutreachData] = useState<OutreachPayload | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      fetchOutreach(campaign);
    }
  }, [lead, isOpen, campaign]);

  const fetchOutreach = async (campaignType: string) => {
    if (!lead) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadData: lead, campaignType }),
      });
      const data = await res.json();
      if (data.success) {
        setOutreachData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen || !lead) return null;

  const linkedinCharCount = outreachData?.outreach.inmailPitch ? outreachData.outreach.inmailPitch.length : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-modal">
      <div className="bg-slate-900/95 border border-indigo-500/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-slate-950/40">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-full mb-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI OUTREACH SYNTHESIZER
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Hyper-Personalized Outreach: {lead.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesized specifically for <strong className="text-white">{lead.decisionMaker?.name}</strong> ({lead.decisionMaker?.title})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5">
          {/* Campaign Selector Chips */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Select Campaign Angle:</label>
            <div className="flex flex-wrap gap-2">
              {[
                'Caprae M&A / Growth Acceleration',
                'B2B SaaS Sales Engine Acceleration',
                'Tech Stack Modernization & MaaS',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCampaign(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                    campaign === c
                      ? 'bg-indigo-600/35 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex border-b border-white/10 gap-3 sm:gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('cold')}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'cold' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Personalized Cold Email</span>
            </button>
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'linkedin' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>LinkedIn InMail</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono font-medium">
                &lt;300 chars
              </span>
            </button>
            <button
              onClick={() => setActiveTab('followup')}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === 'followup' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Day-4 Follow-Up</span>
            </button>
          </div>

          {/* Content Pane */}
          {isGenerating ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Synthesizing hyper-personalized copy for {lead.name}...</span>
            </div>
          ) : outreachData ? (
            <div className="flex flex-col gap-4">
              {activeTab === 'cold' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Subject Line:</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={outreachData.outreach.coldEmail.subject}
                        className="w-full bg-slate-950/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white pr-20 font-medium"
                      />
                      <button
                        onClick={() => handleCopy(outreachData.outreach.coldEmail.subject, 'coldSub')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white/10 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                      >
                        {copiedKey === 'coldSub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'coldSub' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Body:</label>
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={7}
                        value={outreachData.outreach.coldEmail.body}
                        className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopy(outreachData.outreach.coldEmail.body, 'coldBody')}
                        className="absolute right-3 top-3 px-2.5 py-1 bg-white/10 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                      >
                        {copiedKey === 'coldBody' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'coldBody' ? 'Copied' : 'Copy Body'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'linkedin' && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">LinkedIn InMail Message:</label>
                    <span className={`text-[11px] font-mono font-semibold ${linkedinCharCount <= 300 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {linkedinCharCount} / 300 characters
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={5}
                      value={outreachData.outreach.inmailPitch}
                      className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopy(outreachData.outreach.inmailPitch, 'inmail')}
                      className="absolute right-3 top-3 px-2.5 py-1 bg-white/10 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                    >
                      {copiedKey === 'inmail' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'inmail' ? 'Copied' : 'Copy Pitch'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'followup' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Follow-Up Subject:</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={outreachData.outreach.followUp.subject}
                        className="w-full bg-slate-950/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white pr-20 font-medium"
                      />
                      <button
                        onClick={() => handleCopy(outreachData.outreach.followUp.subject, 'folSub')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-white/10 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                      >
                        {copiedKey === 'folSub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'folSub' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Follow-Up Body:</label>
                    <div className="relative">
                      <textarea
                        readOnly
                        rows={6}
                        value={outreachData.outreach.followUp.body}
                        className="w-full bg-slate-950/90 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopy(outreachData.outreach.followUp.body, 'folBody')}
                        className="absolute right-3 top-3 px-2.5 py-1 bg-white/10 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition flex items-center gap-1 active:scale-95"
                      >
                        {copiedKey === 'folBody' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'folBody' ? 'Copied' : 'Copy Body'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onDispatch(lead.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Mark Outreach Dispatched</span>
          </button>
        </div>
      </div>
    </div>
  );
};
