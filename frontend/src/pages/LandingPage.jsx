import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  ShieldAlert, 
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { pipelineStats, scoringWeights } from '../data/pipelineData';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      title: "1. Raw Candidate Pool",
      count: pipelineStats.totalCandidates,
      color: "#64748B",
      desc: "Ingested 100,000 diverse profiles from the Redrob India Runs Data & AI Challenge dataset.",
      badge: "100K Records",
      icon: Layers
    },
    {
      title: "2. Honeypot Detection",
      count: pipelineStats.honepotsFiltered,
      color: "#EF4444",
      desc: "Flagged and eliminated 2,835 synthetic honeypots with impossible durations or time-traveling careers.",
      badge: "-2.8%",
      icon: ShieldAlert
    },
    {
      title: "3. JD Disqualification",
      count: pipelineStats.unfitFiltered,
      color: "#F59E0B",
      desc: "Disqualified 68,062 candidates with non-tech titles or zero AI/ML production work history.",
      badge: "-68.1%",
      icon: Filter
    },
    {
      title: "4. Multi-Signal Scoring",
      count: pipelineStats.scoredCandidates,
      color: "#7C3AED",
      desc: "Scored the remaining 29,103 qualified candidates across 6 weighted dimensions using CPU-native vectors.",
      badge: "29.1K Scored",
      icon: Brain
    },
    {
      title: "5. Top 100 Shortlist",
      count: pipelineStats.topSelected,
      color: "#10B981",
      desc: "Selected the elite Top 100 AI Engineers ready for immediate deployment with full reasoning trails.",
      badge: "Top 0.1%",
      icon: Trophy
    }
  ];

  return (
    <div className="landing page-enter">
      {/* Navbar */}
      <nav className="landing-nav glass">
        <div className="nav-brand">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <span className="logo-name">TalentLens</span>
          <span className="logo-badge">v2 Pipeline</span>
        </div>
        <div className="nav-links">
          <button className="btn btn-ghost" onClick={() => navigate('/how-it-works')}>Semantic Engine</button>
          <button className="btn btn-ghost" onClick={() => navigate('/honeypots')}>Honeypot Trap</button>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Explore Live Pipeline <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge badge badge-primary">
          <Sparkles size={14} /> India Runs Data & AI Challenge Submission
        </div>
        <h1 className="hero-title">
          See Beyond Keywords.<br />
          <span className="gradient-text">Discover True AI Potential.</span>
        </h1>
        <p className="hero-subtitle">
          Traditional ATS keyword matching is easily spoofed by honeypots and misses hidden talent. 
          Our 6-signal semantic ranking engine processed <strong>100,000 profiles in {pipelineStats.runtimeSeconds} seconds</strong> — isolating the exact Top 100 engineers.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary btn-lg pulse-glow" onClick={() => navigate('/dashboard')}>
            View Live Funnel & KPIs <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/rankings')}>
            Inspect Top 100 Shortlist
          </button>
        </div>

        {/* Live Metrics Bar */}
        <div className="hero-stats grid-4">
          <div className="stat-card glass">
            <div className="stat-value text-primary">
              <AnimatedCounter value={pipelineStats.totalCandidates} />
            </div>
            <div className="stat-label">Total Candidates Analyzed</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-value text-error">
              <AnimatedCounter value={pipelineStats.honepotsFiltered} />
            </div>
            <div className="stat-label">Honeypot Traps Caught</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-value text-accent">
              <AnimatedCounter value={pipelineStats.scoredCandidates} />
            </div>
            <div className="stat-label">Deeply Scored Profiles</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-value text-success">
              {pipelineStats.runtimeSeconds}s
            </div>
            <div className="stat-label">CPU-Native Execution Time</div>
          </div>
        </div>
      </section>

      {/* Pipeline Funnel Interactive Explainer */}
      <section className="section section-funnel">
        <div className="section-header text-center">
          <h2 className="section-title">The 5-Stage Selection Pipeline</h2>
          <p className="section-subtitle">Click through each stage to see how our engine filters signal from noise.</p>
        </div>

        <div className="funnel-container grid-2">
          {/* Funnel Steps List */}
          <div className="funnel-steps">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div 
                  key={idx} 
                  className={`funnel-step-card glass ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  style={{ borderLeftColor: step.color }}
                >
                  <div className="step-icon" style={{ background: `${step.color}20`, color: step.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <span className="step-title">{step.title}</span>
                      <span className="step-badge badge" style={{ background: `${step.color}20`, color: step.color }}>
                        {step.badge}
                      </span>
                    </div>
                    <div className="step-count" style={{ color: step.color }}>
                      {step.count.toLocaleString()} profiles
                    </div>
                  </div>
                  <ChevronRight size={18} className="step-arrow" />
                </div>
              );
            })}
          </div>

          {/* Active Step Detail Preview */}
          <div className="funnel-detail glass">
            {(() => {
              const current = pipelineSteps[activeStep];
              const Icon = current.icon;
              return (
                <div className="detail-content fade-in" key={activeStep}>
                  <div className="detail-icon" style={{ background: `${current.color}20`, color: current.color }}>
                    <Icon size={40} />
                  </div>
                  <h3 className="detail-title" style={{ color: current.color }}>{current.title}</h3>
                  <div className="detail-metric">
                    <span>{current.count.toLocaleString()}</span> Candidates
                  </div>
                  <p className="detail-desc">{current.desc}</p>
                  
                  <div className="detail-highlight">
                    {activeStep === 0 && (
                      <div className="highlight-box">
                        <Activity size={18} /> Includes diverse titles across India: ML Engineers, Data Scientists, Backend devs, and synthetic noise.
                      </div>
                    )}
                    {activeStep === 1 && (
                      <div className="highlight-box error">
                        <AlertTriangle size={18} /> Catches "Time Travelers" claiming 10 years experience at companies founded 3 years ago!
                      </div>
                    )}
                    {activeStep === 2 && (
                      <div className="highlight-box warning">
                        <Filter size={18} /> Removes non-practitioners (e.g. Pure HR, Accountants) and academic researchers without production deployment history.
                      </div>
                    )}
                    {activeStep === 3 && (
                      <div className="highlight-box accent">
                        <Brain size={18} /> Evaluates semantic skill overlap, career depth, behavioral responsiveness, and notice period flexibility.
                      </div>
                    )}
                    {activeStep === 4 && (
                      <div className="highlight-box success">
                        <Trophy size={18} /> Generates verifiable audit trails showing exact skill depth and career alignment for every selected candidate.
                      </div>
                    )}
                  </div>

                  <button 
                    className="btn btn-primary w-full mt-4" 
                    onClick={() => navigate(activeStep === 1 ? '/honeypots' : activeStep === 4 ? '/rankings' : '/dashboard')}
                  >
                    Explore Stage {activeStep + 1} Deep Dive <ArrowRight size={16} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 6 Scoring Dimensions Grid */}
      <section className="section section-dimensions">
        <div className="section-header text-center">
          <h2 className="section-title">Why Our Composite Formula Wins</h2>
          <p className="section-subtitle">We balance technical excellence with real-world hiring availability.</p>
        </div>

        <div className="grid-3 dimensions-grid">
          {scoringWeights.map((dim, i) => (
            <div key={i} className="dimension-card glass">
              <div className="dimension-header">
                <span className="dimension-name" style={{ color: dim.color }}>{dim.name}</span>
                <span className="dimension-weight badge" style={{ background: `${dim.color}20`, color: dim.color }}>
                  {(dim.weight * 100).toFixed(0)}% Weight
                </span>
              </div>
              <div className="dimension-bar-bg">
                <div className="dimension-bar-fill" style={{ width: `${dim.weight * 100}%`, background: dim.color }} />
              </div>
              <p className="dimension-desc">{dim.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="section section-cta glass text-center">
        <h2>Ready to explore the real data?</h2>
        <p>Inspect our Top 100 ranked candidates or test our honeypot traps against adversarial profiles.</p>
        <div className="cta-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            Launch Dashboard <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/honeypots')}>
            Test Honeypots
          </button>
        </div>
      </section>
    </div>
  );
}
