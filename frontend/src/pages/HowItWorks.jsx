import { useState } from 'react';
import { 
  Brain, Sparkles, Zap, ArrowRight, CheckCircle2, 
  Search, Layers, Code, Cpu, Database
} from 'lucide-react';
import { semanticAliases, scoringWeights } from '../data/pipelineData';
import './HowItWorks.css';

export default function HowItWorks() {
  const [selectedQuery, setSelectedQuery] = useState('similarity search');
  const [customInput, setCustomInput] = useState('');

  const activeAliases = semanticAliases[selectedQuery] || [];

  return (
    <div className="how-it-works page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">The CPU-Native Semantic Ranking Engine</h1>
          <p className="page-subtitle">Deep dive into our 7-dimension scoring architecture and dictionary-augmented vector expansion.</p>
        </div>
        <div className="badge badge-primary flex items-center gap-2 px-4 py-2">
          <Brain size={16} /> Math & Methodology Explainer
        </div>
      </div>

      {/* Section 1: Interactive Semantic Alias Expansion */}
      <div className="glass p-8 rounded-2xl mb-8 border border-primary/30">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="text-primary" /> 1. Semantic Alias Expansion
          </h2>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            In standard ATS keyword matchers, if a Job Description asks for <code className="text-primary">vector indexing</code> and an engineer's resume lists <code className="text-accent">FAISS</code> or <code className="text-pink">approximate nearest neighbor</code>, they receive a 0% match. TalentLens expands concepts dynamically before vector scoring.
          </p>
        </div>

        {/* Interactive Demo Box */}
        <div className="demo-box p-6 rounded-xl bg-black/40 border border-white/10">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <span className="text-sm font-semibold text-slate-300">Select a JD Skill Requirement to Test:</span>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(semanticAliases).slice(0, 4).map((key) => (
                <button 
                  key={key} 
                  className={`btn btn-sm ${selectedQuery === key ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedQuery(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="expansion-visual grid-3 gap-6 items-center mt-6">
            {/* Input Concept */}
            <div className="concept-card p-5 rounded-lg bg-primary/10 border border-primary text-center">
              <div className="text-xs text-primary font-mono uppercase mb-1">JD Required Skill</div>
              <div className="text-xl font-bold text-white">"{selectedQuery}"</div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-xs font-mono text-muted mb-1">SEMANTIC_ALIASES Mapping</div>
              <div className="w-full flex items-center justify-center">
                <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-pink flex-1" />
                <Zap size={24} className="text-accent mx-2 animate-bounce" />
                <div className="h-0.5 bg-gradient-to-r from-pink to-accent flex-1" />
              </div>
            </div>

            {/* Expanded Cluster */}
            <div className="cluster-card p-5 rounded-lg bg-accent/10 border border-accent">
              <div className="text-xs text-accent font-mono uppercase mb-2">Expanded Match Vector</div>
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="tag px-3 py-1 bg-primary text-black font-semibold rounded-full text-xs">
                  {selectedQuery}
                </span>
                {activeAliases.map((alias, idx) => (
                  <span key={idx} className="tag px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs">
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Mathematical Composite Formula */}
      <div className="glass p-8 rounded-2xl mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Cpu className="text-accent" /> 2. The 6-Dimension Composite Formula
        </h2>
        <p className="text-secondary text-sm leading-relaxed mb-6">
          Every candidate passing hard filters is evaluated across 6 normalized dimensions ($S \in [0, 1]$). The weights reflect actual production readiness rather than resume formatting.
        </p>

        {/* Formula Display */}
        <div className="formula-box p-6 rounded-xl bg-black/50 border border-white/10 text-center font-mono my-6 overflow-x-auto">
          <div className="text-lg md:text-xl text-primary font-bold">
            Score = 0.25·<span className="text-primary">S_skill</span> + 0.25·<span className="text-accent">S_depth</span> + 0.20·<span className="text-success">S_exp</span> + 0.15·<span className="text-warning">S_behav</span> + 0.08·<span className="text-pink">S_eng</span> + 0.07·<span className="text-red-400">S_avail</span>
          </div>
        </div>

        {/* Weights Grid Breakdown */}
        <div className="grid-3 gap-6 mt-6">
          {scoringWeights.map((dim, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-base" style={{ color: dim.color }}>{dim.name}</h3>
                <span className="badge font-mono" style={{ background: `${dim.color}20`, color: dim.color }}>
                  {(dim.weight * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">{dim.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Tie-Breaking & Auditability */}
      <div className="grid-2 gap-8">
        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-success">
            <CheckCircle2 size={20} /> Deterministic Tie-Breaking
          </h3>
          <p className="text-xs text-secondary leading-relaxed mb-4">
            When two candidates achieve identical composite scores, standard random sorting introduces bias. Our engine uses strict 3-tier deterministic tie-breaking:
          </p>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 font-mono bg-black/30 p-4 rounded-lg">
            <li><strong>Skill Match Score ($S_{{skill}}$)</strong> — Technical capability takes priority.</li>
            <li><strong>Years of Experience (YOE)</strong> — Proven tenure breaks skill ties.</li>
            <li><strong>Alphanumeric Candidate ID</strong> — Ensures 100% reproducible execution across runs.</li>
          </ol>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-warning">
            <Database size={20} /> CPU-Native Performance
          </h3>
          <p className="text-xs text-secondary leading-relaxed mb-4">
            Large Language Models (LLMs) take hours and thousands of dollars to evaluate 100,000 candidates. Our vector math engine executes locally on CPU:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 font-mono bg-black/30 p-4 rounded-lg">
            <li>⚡ <strong>Throughput:</strong> ~8,300 candidates per second.</li>
            <li>🛡️ <strong>Privacy:</strong> Zero data sent to external OpenAI/Anthropic APIs.</li>
            <li>📊 <strong>Auditability:</strong> Every score generates a plain-text English reasoning string explaining the exact calculation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
