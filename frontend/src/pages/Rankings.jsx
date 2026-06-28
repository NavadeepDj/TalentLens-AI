import { useState, useMemo } from 'react';
import { 
  Trophy, Search, Filter, ChevronDown, ChevronUp, 
  MapPin, Briefcase, Award, CheckCircle2, Sparkles, ExternalLink
} from 'lucide-react';
import { top100Candidates } from '../data/pipelineData';
import './Rankings.css';

export default function Rankings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(top100Candidates[0]?.candidateId || null);

  const filteredCandidates = useMemo(() => {
    return top100Candidates.filter(c => {
      // Search filter
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        c.candidateId.toLowerCase().includes(q) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(q))) ||
        c.reasoning.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Category filter
      if (selectedFilter === 'TOP10') return c.rank <= 10;
      if (selectedFilter === 'SENIOR') return c.yoe >= 5;
      if (selectedFilter === 'STRONG_DEPTH') return c.skillDepth === 'strong';
      return true;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <div className="rankings-page page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Top 100 Ranked AI Engineers</h1>
          <p className="page-subtitle">The final shortlist extracted from 100,000 challenge records, ranked by composite multi-signal scoring.</p>
        </div>
        <div className="badge badge-primary flex items-center gap-2 px-4 py-2">
          <Trophy size={16} /> Stage 5 Output • Certified Clean
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar glass p-4 rounded-xl flex justify-between items-center gap-4 flex-wrap mb-6">
        <div className="search-box flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg flex-1 min-w-[280px] border border-white/10">
          <Search size={18} className="text-secondary" />
          <input 
            type="text" 
            placeholder="Search candidate ID, skills, company, title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-primary w-full text-sm placeholder:text-muted"
          />
        </div>

        <div className="filter-pills flex gap-2 flex-wrap">
          <button 
            className={`btn btn-sm ${selectedFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedFilter('ALL')}
          >
            All 100
          </button>
          <button 
            className={`btn btn-sm ${selectedFilter === 'TOP10' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedFilter('TOP10')}
          >
            Top 10 Podium
          </button>
          <button 
            className={`btn btn-sm ${selectedFilter === 'SENIOR' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedFilter('SENIOR')}
          >
            Senior (5y+ YOE)
          </button>
          <button 
            className={`btn btn-sm ${selectedFilter === 'STRONG_DEPTH' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedFilter('STRONG_DEPTH')}
          >
            Strong Depth Verified
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4 text-sm text-secondary">
        <span>Showing <strong>{filteredCandidates.length}</strong> qualified engineers</span>
        <span>Click any candidate row to view full 6-signal breakdown</span>
      </div>

      {/* Candidates Table / Cards List */}
      <div className="candidates-list flex flex-col gap-3">
        {filteredCandidates.map((cand) => {
          const isExpanded = expandedId === cand.candidateId;
          return (
            <div key={cand.candidateId} className={`cand-card glass transition-all ${isExpanded ? 'expanded border-primary/50' : ''}`}>
              {/* Card Header Row */}
              <div 
                className="cand-row p-4 flex items-center justify-between gap-4 cursor-pointer flex-wrap"
                onClick={() => setExpandedId(isExpanded ? null : cand.candidateId)}
              >
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className={`cand-rank rank-${cand.rank}`}>#{cand.rank}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-primary">{cand.title || 'AI/ML Engineer'}</h3>
                      <span className="text-xs font-mono text-muted">({cand.candidateId})</span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5 flex items-center gap-3">
                      {cand.company && <span className="flex items-center gap-1"><Briefcase size={12} /> {cand.company}</span>}
                      <span>{cand.yoe}y YOE</span>
                      {cand.location && <span className="flex items-center gap-1"><MapPin size={12} /> {cand.location}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  {/* Skill tags */}
                  <div className="flex gap-1.5 flex-wrap max-w-[320px]">
                    {cand.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="tag text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {s}
                      </span>
                    ))}
                    {cand.skills.length > 4 && (
                      <span className="tag text-xs px-2 py-1 rounded-full bg-white/5 text-muted">
                        +{cand.skills.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Score pill */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted uppercase tracking-wider font-semibold">Composite Score</div>
                      <div className="text-lg font-mono font-bold text-primary">{cand.score.toFixed(3)}</div>
                    </div>
                    <div className="expand-btn p-1.5 rounded-lg bg-white/5 text-secondary">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Breakdown Drawer */}
              {isExpanded && (
                <div className="cand-breakdown p-6 border-t border-white/10 bg-black/20 fade-in">
                  <div className="grid-2 gap-6">
                    {/* Left: Full Reasoning Trail */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                        <Sparkles size={16} /> AI Audit & Reasoning Trail
                      </h4>
                      <div className="reasoning-box p-4 rounded-lg bg-white/5 border border-white/10 text-sm leading-relaxed text-slate-300 font-mono">
                        {cand.reasoning}
                      </div>

                      <div className="mt-4 flex gap-4 text-xs text-secondary">
                        {cand.responseRate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={14} className="text-success" /> Response Rate: <strong className="text-primary">{cand.responseRate}</strong>
                          </div>
                        )}
                        {cand.status && (
                          <div className="flex items-center gap-1">
                            <Award size={14} className="text-warning" /> Status: <strong className="text-primary">{cand.status}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Simulated Dimension Weights */}
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
                        6-Signal Vector Alignment
                      </h4>
                      <div className="flex flex-col gap-3">
                        {[
                          { name: 'Skill Match (25%)', score: Math.min(cand.score * 1.1, 1.0), color: '#00D4FF' },
                          { name: 'Career Depth (25%)', score: cand.skillDepth === 'strong' ? 0.95 : 0.82, color: '#7C3AED' },
                          { name: 'Experience Fit (20%)', score: Math.min((cand.yoe / 8) * 0.9 + 0.3, 0.98), color: '#10B981' },
                          { name: 'Behavioral Trust (15%)', score: cand.responseRate ? 0.90 : 0.75, color: '#F59E0B' },
                          { name: 'Engagement & Tests (8%)', score: 0.85, color: '#F472B6' },
                          { name: 'Availability (7%)', score: 0.88, color: '#EF4444' },
                        ].map((dim, idx) => (
                          <div key={idx} className="dim-bar-row">
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span style={{ color: dim.color }}>{dim.name}</span>
                              <span className="font-mono">{(dim.score * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ width: `${dim.score * 100}%`, background: dim.color }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredCandidates.length === 0 && (
          <div className="text-center p-12 glass rounded-xl">
            <Search size={40} className="mx-auto text-muted mb-3" />
            <h3>No candidates match your filters</h3>
            <p className="text-secondary text-sm mt-1">Try clearing your search query or switching to 'All 100' view.</p>
            <button className="btn btn-secondary btn-sm mt-4" onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
