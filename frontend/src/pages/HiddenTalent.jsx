import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Search, Sparkles, ArrowRight, Users, TrendingUp } from 'lucide-react';
import MatchScore from '../components/ui/MatchScore';
import LoadingOrb from '../components/ui/LoadingOrb';
import { mockCandidates } from '../data/mockData';
import './HiddenTalent.css';

const hiddenGems = mockCandidates.filter(c => c.hidden_gem);

export default function HiddenTalent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleSearch = () => {
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="hidden-talent-page page-enter">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title"><Gem size={24} color="var(--color-pink)" /> Hidden Talent Discovery</h1>
          <p className="page-subtitle">Find candidates that traditional ATS systems would miss</p>
        </div>
      </div>

      {/* Find Similar Input */}
      <div className="discover-search glass">
        <div className="discover-search-header">
          <Sparkles size={20} color="var(--color-primary)" />
          <h2>Find Similar Candidates</h2>
        </div>
        <p className="discover-search-desc">
          Describe your ideal candidate or top performer. AI will find pattern-matched candidates 
          with transferable skills and growth potential.
        </p>
        <div className="discover-input-row">
          <textarea
            className="input-field textarea-field"
            placeholder="e.g., 'Senior Python developer with experience building scalable APIs, preferably with some ML background. Someone who shows strong career growth and initiative...'"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            rows={3}
          />
          <button className="btn btn-primary btn-lg" onClick={handleSearch}>
            <Search size={18} /> Discover Talent
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="discover-loading">
          <LoadingOrb text="Analyzing talent patterns across candidate pool..." />
        </div>
      )}

      {/* Results */}
      {showResults && (
        <>
          <div className="discover-results-header">
            <h2 className="section-title">
              <Gem size={20} color="var(--color-pink)" /> Discovered Hidden Gems
            </h2>
            <p className="section-subtitle">
              {hiddenGems.length} candidates found that traditional keyword matching would miss
            </p>
          </div>

          <div className="discover-grid">
            {hiddenGems.map((c, i) => (
              <div 
                key={c.id}
                className="discover-card glass glass-interactive glass-accent"
                onClick={() => navigate(`/candidates/${c.id}`)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="discover-card-header">
                  <div className="avatar" style={{ background: c.avatar_color, width: 48, height: 48 }}>
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="discover-card-name">{c.name}</h3>
                    <p className="discover-card-title">{c.title} · {c.experience}y exp</p>
                  </div>
                  <div className="discover-card-score">
                    <MatchScore score={c.growth_score} size={52} strokeWidth={4} />
                    <span className="score-label">Growth</span>
                  </div>
                </div>

                <div className="discover-reason">
                  <div className="discover-reason-badge">
                    <Gem size={12} /> Why Hidden Gem
                  </div>
                  <p>{c.hidden_gem_reason}</p>
                </div>

                <div className="discover-card-skills">
                  {c.skills.slice(0, 6).map(s => (
                    <span key={s} className="skill-badge skill-badge-neutral">{s}</span>
                  ))}
                </div>

                <div className="discover-trajectory-mini">
                  <TrendingUp size={14} color="var(--color-success)" />
                  <span>
                    {c.career_trajectory[0]?.title} → {c.career_trajectory[c.career_trajectory.length - 1]?.title}
                  </span>
                  <span className="trajectory-years">
                    ({c.career_trajectory[c.career_trajectory.length - 1]?.year - c.career_trajectory[0]?.year}y)
                  </span>
                </div>

                <button className="btn btn-ghost btn-sm discover-view-btn">
                  View Full Profile <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
