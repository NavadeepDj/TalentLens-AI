import { useNavigate } from 'react-router-dom';
import { 
  Users, ShieldAlert, Filter, Brain, Trophy, 
  ArrowRight, Sparkles, Clock, CheckCircle2, AlertTriangle, TrendingUp
} from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { pipelineStats, top100Candidates, pipelineStages } from '../data/pipelineData';
import './PipelineDashboard.css';

export default function PipelineDashboard() {
  const navigate = useNavigate();
  const top3 = top100Candidates.slice(0, 3);

  // Score distribution buckets for mock histogram representing 29,103 candidates
  const scoreBuckets = [
    { range: '0.20 - 0.30', count: 4210, label: 'Low Match' },
    { range: '0.30 - 0.40', count: 8650, label: 'Below Avg' },
    { range: '0.40 - 0.50', count: 9120, label: 'Average' },
    { range: '0.50 - 0.60', count: 4890, label: 'Good Fit' },
    { range: '0.60 - 0.70', count: 1840, label: 'Strong Fit' },
    { range: '0.70 - 0.80', count: 353, label: 'Elite' },
    { range: '0.80+', count: 40, label: 'Top Tier' },
  ];
  const maxBucket = Math.max(...scoreBuckets.map(b => b.count));

  return (
    <div className="pipeline-dashboard page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Pipeline Execution Dashboard</h1>
          <p className="page-subtitle">Live telemetry from the CPU-native semantic ranking engine on 100,000 challenge records.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/honeypots')}>
            <ShieldAlert size={16} /> View Honeypot Traps
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/rankings')}>
            <Trophy size={16} /> Inspect Top 100
          </button>
        </div>
      </div>

      {/* Telemetry KPIs */}
      <div className="grid-4 kpi-grid">
        <div className="kpi-card glass">
          <div className="kpi-icon" style={{ background: 'var(--color-primary-dim)', color: 'var(--color-primary)' }}>
            <Users size={22} />
          </div>
          <div className="kpi-value text-primary">
            <AnimatedCounter value={pipelineStats.totalCandidates} />
          </div>
          <div className="kpi-label">Ingested Profiles</div>
          <div className="kpi-trend positive">100% Redrob Dataset</div>
        </div>

        <div className="kpi-card glass">
          <div className="kpi-icon" style={{ background: 'var(--color-error-dim)', color: 'var(--color-error)' }}>
            <ShieldAlert size={22} />
          </div>
          <div className="kpi-value text-error">
            <AnimatedCounter value={pipelineStats.honepotsFiltered} />
          </div>
          <div className="kpi-label">Honeypots Trapped</div>
          <div className="kpi-trend negative">2.8% Synthetic Noise</div>
        </div>

        <div className="kpi-card glass">
          <div className="kpi-icon" style={{ background: 'var(--color-warning-dim)', color: 'var(--color-warning)' }}>
            <Filter size={22} />
          </div>
          <div className="kpi-value text-warning">
            <AnimatedCounter value={pipelineStats.unfitFiltered} />
          </div>
          <div className="kpi-label">JD Disqualified</div>
          <div className="kpi-trend negative">68.1% Non-AI/Academic</div>
        </div>

        <div className="kpi-card glass">
          <div className="kpi-icon" style={{ background: 'var(--color-success-dim)', color: 'var(--color-success)' }}>
            <Clock size={22} />
          </div>
          <div className="kpi-value text-success">
            {pipelineStats.runtimeSeconds}s
          </div>
          <div className="kpi-label">Execution Latency</div>
          <div className="kpi-trend positive">CPU-Native Vectors</div>
        </div>
      </div>

      {/* Visual Dropoff Funnel */}
      <div className="funnel-section glass mt-6">
        <div className="funnel-header">
          <h3>Candidate Reduction Flow</h3>
          <span className="badge badge-primary">Step-by-step filtering</span>
        </div>
        <div className="funnel-visual">
          {pipelineStages.map((stage, idx) => {
            const dropPct = ((stage.count / pipelineStats.totalCandidates) * 100).toFixed(1);
            return (
              <div key={idx} className="funnel-stage">
                <div className="stage-top">
                  <span className="stage-label" style={{ color: stage.color }}>{stage.label}</span>
                  <span className="stage-pct">{dropPct}%</span>
                </div>
                <div className="stage-bar-bg">
                  <div className="stage-bar-fill" style={{ width: `${Math.max(dropPct, 2)}%`, background: stage.color }} />
                </div>
                <div className="stage-bottom">
                  <span>{stage.count.toLocaleString()} profiles</span>
                  {idx > 0 && idx < 3 && <span className="drop-tag">Dropped</span>}
                  {idx >= 3 && <span className="keep-tag">Retained</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid-2 mt-6 dashboard-bottom">
        {/* Score Distribution Histogram */}
        <div className="glass p-6 rounded-xl chart-card">
          <div className="chart-header mb-4">
            <div>
              <h3>Qualified Score Distribution</h3>
              <p className="text-sm text-secondary">Spread across 29,103 qualified AI engineers</p>
            </div>
            <TrendingUp size={20} className="text-primary" />
          </div>

          <div className="histogram">
            {scoreBuckets.map((bucket, i) => {
              const heightPct = (bucket.count / maxBucket) * 100;
              return (
                <div key={i} className="hist-col">
                  <div className="hist-val">{bucket.count >= 1000 ? `${(bucket.count/1000).toFixed(1)}k` : bucket.count}</div>
                  <div className="hist-bar-container">
                    <div 
                      className="hist-bar" 
                      style={{ 
                        height: `${heightPct}%`,
                        background: i >= 5 ? 'var(--color-primary)' : i >= 3 ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)'
                      }} 
                    />
                  </div>
                  <div className="hist-label">{bucket.range}</div>
                </div>
              );
            })}
          </div>
          <div className="chart-footer mt-4 pt-3 border-t text-xs text-secondary flex justify-between">
            <span>Minimum cutoff for Top 100: <strong>{top100Candidates[99]?.score.toFixed(3)}</strong></span>
            <span>Highest score: <strong>{top100Candidates[0]?.score.toFixed(3)}</strong></span>
          </div>
        </div>

        {/* Top 3 Preview Card */}
        <div className="glass p-6 rounded-xl top-preview-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3>Top Ranked Podium</h3>
              <p className="text-sm text-secondary">The highest scoring candidates in the challenge pool</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/rankings')}>
              View All 100 <ArrowRight size={14} />
            </button>
          </div>

          <div className="top-list">
            {top3.map((cand) => (
              <div key={cand.candidateId} className="top-item glass-interactive p-4 rounded-lg mb-3" onClick={() => navigate('/rankings')}>
                <div className="flex items-center gap-3">
                  <div className={`rank-badge rank-${cand.rank}`}>#{cand.rank}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-primary">{cand.title || 'AI Engineer'}</h4>
                      <span className="score-pill badge badge-primary">Score: {cand.score.toFixed(3)}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1">
                      {cand.company ? `at ${cand.company}` : ''} • {cand.yoe}y YOE • {cand.location || 'India'}
                    </p>
                    <div className="skill-tags mt-2 flex gap-1 flex-wrap">
                      {cand.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="tag text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
