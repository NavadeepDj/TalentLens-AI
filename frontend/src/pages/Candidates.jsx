import { useNavigate } from 'react-router-dom';
import { Search, Users, MapPin, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { mockCandidates } from '../data/mockData';
import MatchScore from '../components/ui/MatchScore';
import './Candidates.css';

export default function Candidates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const allSkills = [...new Set(mockCandidates.flatMap(c => c.skills))].sort();

  const filtered = mockCandidates.filter(c => {
    const matchesSearch = !search || 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSkill = !skillFilter || c.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="candidates-page page-enter">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title"><Users size={24} /> Candidates</h1>
          <p className="page-subtitle">{mockCandidates.length} candidates in the talent pool</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="candidates-controls glass">
        <div className="search-bar" style={{ flex: 1 }}>
          <Search size={18} className="search-icon" />
          <input 
            className="input-field"
            placeholder="Search by name, title, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="input-field skill-filter-select"
          value={skillFilter}
          onChange={e => setSkillFilter(e.target.value)}
        >
          <option value="">All Skills</option>
          {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Candidates Grid */}
      <div className="candidates-grid">
        {filtered.map((c, i) => (
          <div 
            key={c.id} 
            className="candidate-profile-card glass glass-interactive"
            onClick={() => navigate(`/candidates/${c.id}`)}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="profile-header">
              <div className="avatar" style={{ background: c.avatar_color, width: 56, height: 56, fontSize: '1.25rem' }}>
                {c.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="profile-growth-badge">
                <span>{c.growth_score}</span>
              </div>
            </div>
            <h3 className="profile-name">{c.name}</h3>
            <p className="profile-title">{c.title}</p>
            <div className="profile-meta">
              <span><MapPin size={12} /> {c.location}</span>
              <span><Briefcase size={12} /> {c.experience}y exp</span>
            </div>
            <div className="profile-skills">
              {c.skills.slice(0, 5).map(s => (
                <span key={s} className="skill-badge skill-badge-neutral">{s}</span>
              ))}
              {c.skills.length > 5 && (
                <span className="skill-badge skill-badge-neutral">+{c.skills.length - 5}</span>
              )}
            </div>
            {c.hidden_gem && (
              <div className="profile-gem-tag">
                <span className="hidden-gem-badge">💎 Hidden Gem</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No candidates found</div>
          <div className="empty-text">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
