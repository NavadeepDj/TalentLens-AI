import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Plus, Sparkles, MapPin, Clock, Users as UsersIcon } from 'lucide-react';
import { mockJobs } from '../data/mockData';
import './Jobs.css';

export default function Jobs() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleDescChange = (value) => {
    setJobDesc(value);
    if (value.length > 50 && !isExtracting) {
      setIsExtracting(true);
      setTimeout(() => {
        // Simulate AI skill extraction
        const skills = [];
        const skillMap = {
          'python': 'Python', 'fastapi': 'FastAPI', 'flask': 'Flask',
          'react': 'React', 'node': 'Node.js', 'docker': 'Docker',
          'kubernetes': 'Kubernetes', 'aws': 'AWS', 'sql': 'SQL',
          'postgresql': 'PostgreSQL', 'redis': 'Redis', 'ml': 'Machine Learning',
          'api': 'REST APIs', 'backend': 'Backend Development',
          'frontend': 'Frontend Development', 'devops': 'DevOps',
          'javascript': 'JavaScript', 'typescript': 'TypeScript',
          'pytorch': 'PyTorch', 'tensorflow': 'TensorFlow',
          'microservices': 'Microservices', 'cloud': 'Cloud Architecture'
        };
        const lower = value.toLowerCase();
        Object.entries(skillMap).forEach(([key, label]) => {
          if (lower.includes(key)) skills.push(label);
        });
        if (skills.length === 0) skills.push('Python', 'Backend Development');
        setExtractedSkills([...new Set(skills)]);
        setIsExtracting(false);
      }, 800);
    }
  };

  return (
    <div className="jobs-page page-enter">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title"><BriefcaseBusiness size={24} /> Jobs</h1>
          <p className="page-subtitle">{mockJobs.length} active job postings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={16} /> Create Job
        </button>
      </div>

      {/* Create Job Form */}
      {showCreate && (
        <div className="create-job glass" style={{ animation: 'slide-up 0.3s ease-out' }}>
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
            <Sparkles size={18} color="var(--color-primary)" /> Create New Job (AI-Powered)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <input
              className="input-field"
              placeholder="Job Title (e.g., Senior Python Backend Engineer)"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
            <textarea
              className="input-field textarea-field"
              placeholder="Paste the full job description here. AI will automatically extract required skills, nice-to-haves, and experience requirements..."
              value={jobDesc}
              onChange={e => handleDescChange(e.target.value)}
              rows={5}
            />
            {extractedSkills.length > 0 && (
              <div className="extracted-skills-preview">
                <div className="extracted-label">
                  <Sparkles size={14} color="var(--color-primary)" />
                  <span>AI Extracted Skills:</span>
                </div>
                <div className="extracted-skills-list">
                  {extractedSkills.map(s => (
                    <span key={s} className="skill-badge skill-badge-match">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-primary" onClick={() => { setShowCreate(false); navigate('/match'); }}>
                Create & Match Candidates
              </button>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Job Cards */}
      <div className="jobs-grid">
        {mockJobs.map((job, i) => (
          <div 
            key={job.id} 
            className="job-card glass glass-interactive"
            onClick={() => navigate('/match')}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="job-card-header">
              <h3 className="job-card-title">{job.title}</h3>
              <span className={`job-status-badge ${job.status}`}>{job.status}</span>
            </div>
            <p className="job-card-company">{job.company}</p>
            <div className="job-card-meta">
              <span><MapPin size={13} /> {job.location}</span>
              <span><Clock size={13} /> {job.posted}</span>
              <span><UsersIcon size={13} /> {job.candidates_matched} matches</span>
            </div>
            <p className="job-card-desc">{job.description}</p>
            <div className="job-card-skills">
              {job.required_skills.map(s => (
                <span key={s} className="skill-badge skill-badge-match">{s}</span>
              ))}
              {job.nice_to_have.slice(0, 2).map(s => (
                <span key={s} className="skill-badge skill-badge-neutral">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
