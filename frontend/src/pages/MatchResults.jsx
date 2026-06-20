import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Search, ArrowRight, CheckCircle2, XCircle, 
  AlertCircle, Gem, TrendingUp, ChevronDown, ChevronUp,
  BriefcaseBusiness, Filter
} from 'lucide-react';
import MatchScore from '../components/ui/MatchScore';
import VerificationBadge from '../components/ui/VerificationBadge';
import { mockJobs, mockMatchResults, mockCandidates } from '../data/mockData';
import './MatchResults.css';

export default function MatchResults() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(1);
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [showHiddenGemsOnly, setShowHiddenGemsOnly] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const results = mockMatchResults[selectedJob] || [];
  const filteredResults = showHiddenGemsOnly 
    ? results.filter(r => r.is_hidden_gem)
    : results;

  const job = mockJobs.find(j => j.id === selectedJob);

  return (
    <div className="match-results-page page-enter">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">
            <Sparkles size={24} className="title-icon" /> AI Match Results
          </h1>
          <p className="page-subtitle">
            Multi-dimensional candidate ranking with full explainability
          </p>
        </div>
      </div>

      {/* Job Selection */}
      <div className="job-selector glass">
        <div className="job-selector-header">
          <BriefcaseBusiness size={18} />
          <span className="job-selector-label">Matching for:</span>
        </div>
        <div className="job-tabs">
          {mockJobs.map(j => (
            <button 
              key={j.id}
              className={`tab ${selectedJob === j.id ? 'active' : ''}`}
              onClick={() => setSelectedJob(j.id)}
            >
              {j.title}
            </button>
          ))}
        </div>
        {job && (
          <div className="job-skills-row">
            <span className="job-skills-label">Required:</span>
            {job.required_skills.map(s => (
              <span key={s} className="skill-badge skill-badge-match">{s}</span>
            ))}
            <span className="job-skills-label" style={{ marginLeft: '0.5rem' }}>Nice to have:</span>
            {job.nice_to_have.slice(0, 3).map(s => (
              <span key={s} className="skill-badge skill-badge-neutral">{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="match-filters">
        <div className="match-count">
          <strong>{filteredResults.length}</strong> candidates ranked
        </div>
        <button 
          className={`btn btn-sm ${showHiddenGemsOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowHiddenGemsOnly(!showHiddenGemsOnly)}
        >
          <Gem size={14} /> Hidden Gems Only
        </button>
      </div>

      {/* Results List */}
      <div className="results-list">
        {filteredResults.map((match, i) => (
          <div key={i} className="result-card glass" style={{ animationDelay: `${i * 0.08}s` }}>
            {/* Summary Row */}
            <div 
              className="result-summary"
              onClick={() => setExpandedMatch(expandedMatch === i ? null : i)}
            >
              <div className="result-rank">#{i + 1}</div>
              <div className="avatar" style={{ background: match.candidate.avatar_color }}>
                {match.candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="result-info">
                <div className="result-name">
                  {match.candidate.name}
                  {match.is_hidden_gem && (
                    <span className="hidden-gem-badge"><Gem size={10} /> Hidden Gem</span>
                  )}
                  {match.candidate.cross_source && (
                    <span style={{ marginLeft: '8px' }}>
                      <VerificationBadge 
                        status={match.candidate.cross_source.status} 
                        score={match.candidate.cross_source.overall_score} 
                      />
                    </span>
                  )}
                </div>
                <div className="result-title">
                  {match.candidate.title} · {match.candidate.experience}y exp · {match.candidate.location}
                </div>
                <div className="result-skills">
                  {match.matched_skills.slice(0, 4).map(s => (
                    <span key={s} className="skill-badge skill-badge-match">{s}</span>
                  ))}
                  {match.partial_skills.slice(0, 2).map(s => (
                    <span key={s} className="skill-badge skill-badge-partial">{s}</span>
                  ))}
                  {match.missing_skills.slice(0, 1).map(s => (
                    <span key={s} className="skill-badge skill-badge-miss">{s}</span>
                  ))}
                </div>
              </div>
              <div className="result-score-section">
                <MatchScore score={match.overall_score} size={64} strokeWidth={5} />
              </div>
              <button className="btn btn-ghost btn-icon expand-btn">
                {expandedMatch === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {/* Expanded Detail */}
            {expandedMatch === i && (
              <div className="result-detail">
                <div className="detail-grid">
                  {/* Score Breakdown */}
                  <div className="detail-section">
                    <h4 className="detail-title">Score Breakdown</h4>
                    <div className="breakdown-bars">
                      {Object.entries(match.breakdown).map(([key, value]) => (
                        <div key={key} className="breakdown-item">
                          <div className="breakdown-label">
                            <span>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            <span className="breakdown-value">{value}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ 
                                width: `${value}%`, 
                                background: value >= 80 
                                  ? 'linear-gradient(to right, var(--color-success), var(--color-primary))'
                                  : value >= 60
                                    ? 'linear-gradient(to right, var(--color-warning), var(--color-primary))'
                                    : 'linear-gradient(to right, var(--color-error), var(--color-warning))'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Gaps */}
                  <div className="detail-section">
                    <h4 className="detail-title">Why This Candidate?</h4>
                    <div className="reasons-list">
                      {match.strengths.map((s, j) => (
                        <div key={j} className="match-reason">
                          <span className="reason-icon positive"><CheckCircle2 size={14} /></span>
                          <span className="reason-text">{s}</span>
                        </div>
                      ))}
                      {match.gaps.map((g, j) => (
                        <div key={j} className="match-reason">
                          <span className="reason-icon negative"><AlertCircle size={14} /></span>
                          <span className="reason-text">{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hidden Gem Explanation */}
                  {match.is_hidden_gem && match.hidden_gem_reason && (
                    <div className="detail-section hidden-gem-explanation">
                      <h4 className="detail-title">
                        <Gem size={16} color="var(--color-pink)" /> Why This Is a Hidden Gem
                      </h4>
                      <p className="gem-reason-text">{match.hidden_gem_reason}</p>
                    </div>
                  )}

                  {/* Career Trajectory */}
                  <div className="detail-section">
                    <h4 className="detail-title">
                      <TrendingUp size={16} /> Career Trajectory
                    </h4>
                    <div className="trajectory-timeline">
                      {match.candidate.career_trajectory.map((step, j) => (
                        <div key={j} className="trajectory-step">
                          <div className="trajectory-dot" style={{
                            background: j === match.candidate.career_trajectory.length - 1 
                              ? 'var(--color-primary)' 
                              : 'var(--text-muted)'
                          }} />
                          <div className="trajectory-info">
                            <span className="trajectory-title">{step.title}</span>
                            <span className="trajectory-company">{step.company} · {step.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="growth-score-badge">
                      Growth Score: <strong>{match.candidate.growth_score}</strong>/100
                    </div>
                  </div>
                </div>

                <div className="detail-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/candidates/${match.candidate.id}`)}>
                    Full Profile <ArrowRight size={14} />
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    Shortlist
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
