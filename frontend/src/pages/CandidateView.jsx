import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, MapPin, GraduationCap, Briefcase,
  TrendingUp, Code, Gem, ExternalLink, Github, Linkedin, FileText
} from 'lucide-react';
import MatchScore from '../components/ui/MatchScore';
import VerificationBadge from '../components/ui/VerificationBadge';
import './CandidateView.css';

export default function CandidateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch from FastAPI backend
    fetch(`http://localhost:8000/api/candidates/${id}`)
      .then(res => res.json())
      .then(data => {
        setCandidate(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch candidate:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="page-enter" style={{ padding: '40px', textAlign: 'center' }}>Loading candidate intelligence...</div>;
  }

  if (!candidate || candidate.detail) {
    return (
      <div className="page-enter">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Candidate not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-view page-enter">
      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-lg)' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Profile Header */}
      <div className="cv-header glass">
        <div className="cv-header-main">
          <div className="avatar" style={{ background: candidate.avatar_color, width: 72, height: 72, fontSize: '1.5rem', borderRadius: '16px' }}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="cv-header-info">
            <h1 className="cv-name">
              {candidate.name}
              {candidate.hidden_gem && (
                <span className="hidden-gem-badge"><Gem size={12} /> Hidden Gem</span>
              )}
              {candidate.cross_source && (
                <VerificationBadge 
                  status={candidate.cross_source.status} 
                  score={candidate.cross_source.overall_score} 
                />
              )}
            </h1>
            <p className="cv-title">{candidate.title || 'Software Engineer'}</p>
            <div className="cv-meta">
              <span><MapPin size={14} /> {candidate.location || 'Remote'}</span>
              <span><Briefcase size={14} /> {candidate.total_experience_years || 0} years</span>
              {candidate.email && <span><Mail size={14} /> {candidate.email}</span>}
            </div>
            
            <div className="source-indicators" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {candidate.sources_provided?.includes('github') && <span className="source-pill github"><Github size={12}/> GitHub Analyzed</span>}
              {candidate.sources_provided?.includes('linkedin') && <span className="source-pill linkedin"><Linkedin size={12}/> LinkedIn Analyzed</span>}
              {candidate.sources_provided?.includes('resume') && <span className="source-pill resume"><FileText size={12}/> Resume Analyzed</span>}
            </div>

          </div>
          <div className="cv-growth-ring">
            <MatchScore score={candidate.growth_score} size={80} strokeWidth={6} />
            <span className="cv-growth-label">Growth Velocity</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="cv-tabs">
        <button 
          className={`cv-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Sparkles size={16} /> AI Overview
        </button>
        
        {candidate.sources_provided?.includes('github') && (
          <button 
            className={`cv-tab ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            <Github size={16} /> GitHub Code Signals
          </button>
        )}
        
        {candidate.cross_source && (
          <button 
            className={`cv-tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <CheckCircle2 size={16} /> Cross-Source Verification
          </button>
        )}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="cv-grid tab-content-enter">
          {/* Skills */}
          <div className="cv-section glass">
            <h2 className="cv-section-title"><Code size={18} /> Verified Skill DNA</h2>
            <div className="cv-skills">
              {candidate.skill_names?.map(s => (
                <span key={s} className="skill-badge skill-badge-neutral" style={{ fontSize: 'var(--font-sm)', padding: '0.375rem 1rem' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Hidden Gem Explanation */}
          {candidate.hidden_gem && candidate.hidden_gem_reason && (
            <div className="cv-section glass hidden-gem-explanation">
              <h2 className="cv-section-title"><Gem size={18} color="var(--color-pink)" /> Why This Candidate Is a Hidden Gem</h2>
              <p className="gem-reason-text" style={{ fontSize: 'var(--font-base)', lineHeight: 1.8 }}>
                {candidate.hidden_gem_reason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Verification */}
      {activeTab === 'verification' && candidate.cross_source && (
        <div className="cv-grid tab-content-enter">
          <div className="cv-section glass cv-section-full">
            <h2 className="cv-section-title">AI Verification Report</h2>
            <ul style={{ margin: '0 0 20px 20px', color: 'var(--text-secondary)' }}>
              {candidate.cross_source.highlights.map((h, i) => <li key={i} style={{marginBottom: '8px'}}>{h}</li>)}
            </ul>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h3 style={{ color: '#10B981', margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16}/> Verified Skills (GitHub + Resume)</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {candidate.cross_source.verified_skills.map(s => <span key={s} style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#10B981' }}>{s}</span>)}
                </div>
              </div>

              {candidate.cross_source.understated_skills?.length > 0 && (
                <div style={{ background: 'rgba(124, 58, 237, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                  <h3 style={{ color: '#A78BFA', margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={16}/> Understated Skills (Found on GitHub, missing from Resume)</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {candidate.cross_source.understated_skills.map(s => <span key={s} style={{ background: 'rgba(124, 58, 237, 0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#A78BFA' }}>{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: GitHub */}
      {activeTab === 'github' && candidate.github_profile && (
        <div className="cv-grid tab-content-enter">
          <div className="cv-section glass cv-section-full">
            <h2 className="cv-section-title"><Github size={18} /> GitHub Code Intelligence</h2>
            
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 24px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{candidate.github_profile.public_repos}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Public Repos</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 24px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{candidate.github_profile.stars_received}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Stars Received</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Language Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
              {Object.entries(candidate.github_profile.languages).map(([lang, pct]) => (
                <div key={lang}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>{lang}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
