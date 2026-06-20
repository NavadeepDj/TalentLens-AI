import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Search, 
  Eye, 
  Gem,
  Zap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Upload,
} from 'lucide-react';
import { skillSimilarityPairs } from '../data/mockData';
import './LandingPage.css';

const features = [
  {
    icon: Brain,
    title: 'Skill Similarity',
    description: 'FastAPI ≈ Flask. PyTorch ≈ TensorFlow. AI understands skill relationships, not just exact keywords.',
    gradient: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
  },
  {
    icon: TrendingUp,
    title: 'Career Trajectory',
    description: 'Analyzes career growth velocity. An intern who became a senior engineer in 3 years signals exceptional potential.',
    gradient: 'linear-gradient(135deg, #10B981, #00D4FF)',
  },
  {
    icon: Search,
    title: 'Project Intelligence',
    description: 'AI extracts hidden skills from project descriptions. "Built recommendation system" reveals ML, Python, and ranking expertise.',
    gradient: 'linear-gradient(135deg, #7C3AED, #F472B6)',
  },
  {
    icon: Gem,
    title: 'Hidden Talent Discovery',
    description: 'Find candidates similar to your top performers. Uncover overlooked talent that traditional ATS systems reject.',
    gradient: 'linear-gradient(135deg, #F472B6, #F59E0B)',
  },
  {
    icon: Eye,
    title: 'Explainable Matching',
    description: 'Not just "89% match". See exactly why each candidate fits: skill-by-skill breakdown, strengths, and gaps.',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
  },
  {
    icon: Zap,
    title: '5-Signal Ranking',
    description: 'Combines semantic similarity, skill overlap, career growth, project relevance, and hidden potential into one score.',
    gradient: 'linear-gradient(135deg, #EF4444, #7C3AED)',
  },
];

const comparisonBefore = {
  title: 'Traditional ATS',
  results: [
    { skill: 'Python', status: 'match' },
    { skill: 'FastAPI', status: 'miss', note: 'Has Flask' },
    { skill: 'Docker', status: 'miss', note: 'Has Kubernetes' },
    { skill: 'PostgreSQL', status: 'match' },
  ],
  verdict: 'REJECTED',
  verdictColor: 'var(--color-error)',
};

const comparisonAfter = {
  title: 'TalentLens AI',
  results: [
    { skill: 'Python', status: 'match', score: '100%' },
    { skill: 'Flask → FastAPI', status: 'partial', score: '89%', note: 'Highly transferable' },
    { skill: 'Kubernetes ⊃ Docker', status: 'partial', score: '94%', note: 'Superset skill' },
    { skill: 'PostgreSQL', status: 'match', score: '100%' },
  ],
  verdict: '87% MATCH',
  verdictColor: 'var(--color-success)',
  extras: ['Growth Score: 92/100', 'Hidden Gem: Career Switcher'],
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeSkillPair, setActiveSkillPair] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveSkillPair(prev => (prev + 1) % skillSimilarityPairs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentPair = skillSimilarityPairs[activeSkillPair];

  return (
    <div className="landing-page">
      <div className="bg-mesh" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner container">
          <div className="landing-logo">
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <span className="logo-name">TalentLens</span>
            <span className="logo-badge">AI</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Launch Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`hero ${isVisible ? 'visible' : ''}`}>
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <Sparkles size={14} />
              <span>AI-Powered Talent Discovery</span>
            </div>
            <h1 className="hero-title">
              See Beyond Keywords.
              <br />
              <span className="text-gradient">Discover Potential.</span>
            </h1>
            <p className="hero-subtitle">
              TalentLens AI evaluates candidates through skill similarity, career trajectory, 
              project intelligence, and explainable matching — finding the talent that traditional 
              ATS systems miss.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                Get Started <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/match')}>
                <Search size={18} /> Try AI Matching
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">85%</span>
                <span className="hero-stat-label">Qualified candidates missed by keyword ATS</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">5</span>
                <span className="hero-stat-label">Matching signals beyond keywords</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Explainable match decisions</span>
              </div>
            </div>
          </div>

          {/* Live Skill Similarity Demo */}
          <div className="hero-demo">
            <div className="demo-card glass">
              <div className="demo-header">
                <Brain size={16} />
                <span>Skill Similarity Engine</span>
                <span className="demo-live-badge">LIVE</span>
              </div>
              <div className="demo-content">
                <div className="skill-pair-display" key={activeSkillPair}>
                  <div className="skill-node skill-node-left">
                    <span>{currentPair.skill1}</span>
                  </div>
                  <div className="skill-connection">
                    <div className="connection-line" />
                    <div className="similarity-score">
                      {Math.round(currentPair.similarity * 100)}%
                    </div>
                    <div className="connection-line" />
                  </div>
                  <div className="skill-node skill-node-right">
                    <span>{currentPair.skill2}</span>
                  </div>
                </div>
                <div className="skill-category">{currentPair.category}</div>
                <div className="skill-bar-wrapper">
                  <div 
                    className="skill-bar-fill" 
                    style={{ width: `${currentPair.similarity * 100}%` }}
                  />
                </div>
              </div>
              <div className="demo-pairs-grid">
                {skillSimilarityPairs.slice(0, 6).map((pair, i) => (
                  <div 
                    key={i}
                    className={`demo-pair-mini ${i === activeSkillPair ? 'active' : ''}`}
                    onClick={() => setActiveSkillPair(i)}
                  >
                    <span className="pair-mini-text">{pair.skill1}</span>
                    <span className="pair-mini-arrow">≈</span>
                    <span className="pair-mini-text">{pair.skill2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Comparison */}
      <section className="comparison-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title">The Problem We Solve</h2>
            <p className="section-subtitle" style={{ maxWidth: 600 }}>
              Traditional ATS rejects qualified candidates over keyword mismatches. 
              TalentLens AI understands that skills are transferable.
            </p>
          </div>

          <div className="comparison-grid">
            {/* Before: Traditional ATS */}
            <div className="comparison-card glass" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <div className="comparison-header">
                <XCircle size={20} color="var(--color-error)" />
                <h3>{comparisonBefore.title}</h3>
              </div>
              <div className="comparison-results">
                {comparisonBefore.results.map((r, i) => (
                  <div key={i} className="comparison-row">
                    <span className={`comparison-status ${r.status}`}>
                      {r.status === 'match' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </span>
                    <span className="comparison-skill">{r.skill}</span>
                    {r.note && <span className="comparison-note">{r.note}</span>}
                  </div>
                ))}
              </div>
              <div className="comparison-verdict" style={{ color: comparisonBefore.verdictColor }}>
                {comparisonBefore.verdict}
              </div>
            </div>

            <div className="comparison-arrow">
              <ChevronRight size={32} />
            </div>

            {/* After: TalentLens */}
            <div className="comparison-card glass" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <div className="comparison-header">
                <CheckCircle2 size={20} color="var(--color-success)" />
                <h3>{comparisonAfter.title}</h3>
              </div>
              <div className="comparison-results">
                {comparisonAfter.results.map((r, i) => (
                  <div key={i} className="comparison-row">
                    <span className={`comparison-status ${r.status}`}>
                      <CheckCircle2 size={14} />
                    </span>
                    <span className="comparison-skill">{r.skill}</span>
                    <span className="comparison-score">{r.score}</span>
                    {r.note && <span className="comparison-note">{r.note}</span>}
                  </div>
                ))}
              </div>
              <div className="comparison-verdict" style={{ color: comparisonAfter.verdictColor }}>
                {comparisonAfter.verdict}
              </div>
              <div className="comparison-extras">
                {comparisonAfter.extras.map((e, i) => (
                  <span key={i} className="comparison-extra-badge">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title">Six Dimensions of Intelligence</h2>
            <p className="section-subtitle" style={{ maxWidth: 600 }}>
              Most tools do one thing: embed and search. TalentLens evaluates candidates 
              across six complementary dimensions.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card glass glass-interactive" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon" style={{ background: feature.gradient }}>
                  <feature.icon size={22} color="white" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle" style={{ maxWidth: 600 }}>
              From resume upload to explainable match — in seconds, not hours.
            </p>
          </div>
          <div className="how-steps">
            {[
              { step: '01', title: 'Upload Resumes', desc: 'Drop PDFs or paste LinkedIn profiles. AI parses and structures everything.', icon: Upload },
              { step: '02', title: 'Describe Your Role', desc: 'Write a job description. AI extracts required skills and builds a skill graph.', icon: Search },
              { step: '03', title: 'AI Analyzes', desc: '5-signal matching engine evaluates every candidate across multiple dimensions.', icon: Brain },
              { step: '04', title: 'Review Matches', desc: 'See ranked candidates with full explainability — reasons, not just scores.', icon: Eye },
            ].map((item, i) => (
              <div key={i} className="how-step glass">
                <div className="step-number text-gradient">{item.step}</div>
                <div className="step-icon-wrapper">
                  <item.icon size={24} />
                </div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
                {i < 3 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass">
            <div className="cta-content">
              <h2 className="cta-title">
                Ready to find your next <span className="text-gradient">hidden gem</span>?
              </h2>
              <p className="cta-subtitle">
                Stop losing great candidates to keyword filters. Start discovering potential.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
                Launch TalentLens AI <ArrowRight size={18} />
              </button>
            </div>
            <div className="cta-decoration">
              <div className="cta-orb cta-orb-1" />
              <div className="cta-orb cta-orb-2" />
              <div className="cta-orb cta-orb-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>
            Built for <strong>INDIA.RUNS</strong> — Redrob AI Data & AI Challenge 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
