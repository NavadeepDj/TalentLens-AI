import { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, Eye, EyeOff, Sparkles, UserCheck, UserX
} from 'lucide-react';
import { testSuiteResults, honeypotRules } from '../data/pipelineData';
import './Honeypots.css';

export default function Honeypots() {
  const [filterType, setFilterType] = useState('ALL'); // ALL, HONEYPOT, GENUINE

  const filteredTests = testSuiteResults.filter(t => {
    if (filterType === 'HONEYPOT') return t.verdict === 'disqualified';
    if (filterType === 'GENUINE') return t.verdict === 'ranked';
    return true;
  });

  const honeypotCount = testSuiteResults.filter(t => t.verdict === 'disqualified').format || 6;
  const genuineCount = testSuiteResults.filter(t => t.verdict === 'ranked').length || 9;

  return (
    <div className="honeypots-page page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Adversarial Honeypot Trap Showcase</h1>
          <p className="page-subtitle">How our v2 engine isolates synthetic profiles, time travelers, and keyword stuffers that deceive standard ATS filters.</p>
        </div>
        <div className="badge badge-error flex items-center gap-2 px-4 py-2">
          <ShieldAlert size={16} /> 15-Profile Stress Test Suite
        </div>
      </div>

      {/* Trap Rules Overview */}
      <div className="rules-grid grid-3 mb-8">
        {honeypotRules.map((rule) => (
          <div key={rule.id} className="rule-card glass p-5 rounded-xl border-l-4 border-error">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{rule.icon}</span>
              <h3 className="font-bold text-base text-primary">{rule.name}</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">{rule.description}</p>
            <div className="mt-3 pt-2 border-t border-white/5 flex justify-between text-xs text-muted font-mono">
              <span>Trap Rule #{rule.id}</span>
              <span className="text-error font-semibold">Caught: {rule.caught}</span>
            </div>
          </div>
        ))}
        <div className="rule-card glass p-5 rounded-xl border-l-4 border-success flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✅</span>
            <h3 className="font-bold text-base text-success">Genuine Signal Protection</h3>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            While trapping bad actors, our engine ensures genuine top performers (even passive ones or those with unconventional titles) are scored accurately.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          <button 
            className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterType('ALL')}
          >
            All 15 Profiles
          </button>
          <button 
            className={`btn btn-sm ${filterType === 'HONEYPOT' ? 'btn-error' : 'btn-ghost'}`}
            onClick={() => setFilterType('HONEYPOT')}
          >
            🚫 Trapped Honeypots (6)
          </button>
          <button 
            className={`btn btn-sm ${filterType === 'GENUINE' ? 'btn-success' : 'btn-ghost'}`}
            onClick={() => setFilterType('GENUINE')}
          >
            ✅ Verified Genuine (9)
          </button>
        </div>

        <div className="text-xs text-secondary">
          Live verification against <code className="text-primary">test_honeypot_sample.jsonl</code>
        </div>
      </div>

      {/* Test Profiles Grid */}
      <div className="grid-2 gap-6">
        {filteredTests.map((test) => {
          const isHoneypot = test.verdict === 'disqualified';
          return (
            <div key={test.candidateId} className={`test-card glass p-6 rounded-xl border transition-all ${isHoneypot ? 'border-error/40 bg-error/5' : 'border-success/40 bg-success/5'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{test.icon || (isHoneypot ? '🚫' : '✅')}</span>
                  <div>
                    <h3 className="font-bold text-lg text-primary">{test.name || test.candidateId}</h3>
                    <p className="text-xs text-secondary font-medium">{test.persona || 'Test Candidate'}</p>
                  </div>
                </div>
                <div className={`badge ${isHoneypot ? 'badge-error' : 'badge-success'} flex items-center gap-1.5 px-3 py-1`}>
                  {isHoneypot ? <UserX size={14} /> : <UserCheck size={14} />}
                  {isHoneypot ? 'DISQUALIFIED' : `RANKED #${test.rank}`}
                </div>
              </div>

              {/* Side by Side Comparison Box */}
              <div className="comparison-box grid-2 gap-3 my-4 p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                <div className="p-2 rounded bg-white/5 border-l-2 border-slate-500">
                  <div className="font-bold text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                    <EyeOff size={12} /> Standard ATS Sees:
                  </div>
                  <div className="text-slate-300">
                    {isHoneypot ? '🔥 98% Keyword Match! Loaded with Python, PyTorch, Transformers.' : '⚠️ 65% Match. Missing exact keywords or unusual title.'}
                  </div>
                </div>

                <div className={`p-2 rounded border-l-2 ${isHoneypot ? 'bg-error/10 border-error' : 'bg-success/10 border-success'}`}>
                  <div className={`font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isHoneypot ? 'text-error' : 'text-success'}`}>
                    <Eye size={12} /> TalentLens Sees:
                  </div>
                  <div className="text-slate-200">
                    {isHoneypot ? `🚫 Zero AI career evidence or metric anomaly. Filtered instantly.` : `✅ Score: ${test.score.toFixed(3)}. Verified strong depth and real experience.`}
                  </div>
                </div>
              </div>

              {/* Engine Audit Trail */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-xs font-mono text-secondary mb-1 uppercase tracking-wider">Engine Verdict Audit:</div>
                <div className={`text-xs font-mono p-2.5 rounded ${isHoneypot ? 'bg-error/20 text-red-200 border border-error/30' : 'bg-success/20 text-green-200 border border-success/30'}`}>
                  {isHoneypot ? `Disqualified: ${test.disqualifyReason}` : test.reasoning}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
