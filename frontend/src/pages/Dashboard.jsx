import { useNavigate } from 'react-router-dom';
import { 
  Users, BriefcaseBusiness, TrendingUp, Gem, 
  ArrowUpRight, ArrowRight, Sparkles, Search, Upload, Plus 
} from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import MatchScore from '../components/ui/MatchScore';
import { dashboardStats, mockCandidates, mockJobs, mockMatchResults } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const topMatches = mockMatchResults[1]?.slice(0, 3) || [];

  const kpis = [
    {
      icon: Users,
      label: 'Candidates Analyzed',
      value: dashboardStats.candidates_analyzed,
      change: dashboardStats.candidates_trend,
      positive: true,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-dim)',
    },
    {
      icon: BriefcaseBusiness,
      label: 'Active Jobs',
      value: dashboardStats.active_jobs,
      change: dashboardStats.jobs_trend,
      positive: true,
      color: 'var(--color-accent)',
      bg: 'var(--color-accent-dim)',
    },
    {
      icon: TrendingUp,
      label: 'Avg Match Rate',
      value: dashboardStats.avg_match_rate,
      suffix: '%',
      change: dashboardStats.match_trend,
      positive: true,
      color: 'var(--color-success)',
      bg: 'var(--color-success-dim)',
    },
    {
      icon: Gem,
      label: 'Hidden Gems Found',
      value: dashboardStats.hidden_gems_found,
      change: dashboardStats.gems_trend,
      positive: true,
      color: 'var(--color-pink)',
      bg: 'var(--color-pink-dim)',
    },
  ];

  return (
    <div className="dashboard page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back. Here's what's happening with your talent pipeline.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/add')}>
            <Upload size={16} /> Add Candidate
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/match')}>
            <Sparkles size={16} /> New Match
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4 dashboard-kpis">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card glass glass-interactive" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
              <kpi.icon size={22} />
            </div>
            <div className="kpi-value" style={{ color: kpi.color }}>
              <AnimatedCounter value={kpi.value} suffix={kpi.suffix || ''} />
            </div>
            <div className="kpi-label">{kpi.label}</div>
            <div className={`kpi-change ${kpi.positive ? 'positive' : 'negative'}`}>
              <ArrowUpRight size={12} /> {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Top Matches */}
        <div className="dashboard-section glass">
          <div className="section-header">
            <div>
              <h2 className="section-title">Recent Top Matches</h2>
              <p className="section-subtitle">For "Senior Python Backend Engineer"</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/match')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="match-list">
            {topMatches.map((match, i) => (
              <div 
                key={i} 
                className="candidate-card glass glass-interactive"
                onClick={() => navigate(`/candidates/${match.candidate.id}`)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="avatar" style={{ background: match.candidate.avatar_color }}>
                  {match.candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="candidate-info">
                  <div className="candidate-name">
                    {match.candidate.name}
                    {match.is_hidden_gem && (
                      <span className="hidden-gem-badge">
                        <Gem size={10} /> Hidden Gem
                      </span>
                    )}
                  </div>
                  <div className="candidate-title">{match.candidate.title} · {match.candidate.experience}y exp</div>
                  <div className="candidate-skills">
                    {match.matched_skills.slice(0, 3).map(s => (
                      <span key={s} className="skill-badge skill-badge-match">{s}</span>
                    ))}
                    {match.partial_skills.slice(0, 2).map(s => (
                      <span key={s} className="skill-badge skill-badge-partial">{s}</span>
                    ))}
                  </div>
                </div>
                <MatchScore score={match.overall_score} size={56} strokeWidth={4} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Active Jobs */}
        <div className="dashboard-sidebar-content">
          {/* Quick Actions */}
          <div className="glass quick-actions-card">
            <h3 className="section-title" style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-base)' }}>Quick Actions</h3>
            <div className="quick-actions-grid">
              {[
                { icon: Upload, label: 'Add Candidate', path: '/add', color: 'var(--color-primary)' },
                { icon: Plus, label: 'Create Job', path: '/jobs', color: 'var(--color-accent)' },
                { icon: Sparkles, label: 'AI Match', path: '/match', color: 'var(--color-pink)' },
                { icon: Gem, label: 'Find Gems', path: '/discover', color: 'var(--color-success)' },
              ].map((action, i) => (
                <button 
                  key={i}
                  className="quick-action-btn"
                  onClick={() => navigate(action.path)}
                  style={{ '--action-color': action.color }}
                >
                  <div className="quick-action-icon">
                    <action.icon size={18} />
                  </div>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="glass active-jobs-card">
            <div className="section-header">
              <h3 className="section-title" style={{ fontSize: 'var(--font-base)' }}>Active Jobs</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/jobs')}>
                All <ArrowRight size={14} />
              </button>
            </div>
            <div className="active-jobs-list">
              {mockJobs.map((job, i) => (
                <div key={i} className="active-job-item" onClick={() => navigate('/match')}>
                  <div className="job-info">
                    <div className="job-title-text">{job.title}</div>
                    <div className="job-meta">{job.posted} · {job.candidates_matched} matches</div>
                  </div>
                  <div className="job-match-count">
                    <span className="job-count-badge">{job.candidates_matched}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Gems Highlight */}
          <div className="glass hidden-gems-highlight">
            <div className="gems-header">
              <Gem size={20} className="gems-icon" />
              <h3>Hidden Gems</h3>
            </div>
            <p className="gems-text">
              <strong>{dashboardStats.hidden_gems_found}</strong> candidates discovered that traditional 
              ATS would have missed. Career switchers, self-taught developers, and growth trajectory stars.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/discover')}>
              Explore <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
